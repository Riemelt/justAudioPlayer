import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Subscription,
  animationFrameScheduler,
  of,
} from 'rxjs';
import { Howl, Howler } from 'howler';

import { AUDIO_FILES } from '../../../data-sources/audio-table-data-source/mock-data';
import { Audio } from '../../../data-sources/audio-table-data-source/types';
import { environment } from '../../../environments/environment';

import { Direction, FreesoundResponse, Status } from './types';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private responseSource = new BehaviorSubject<Audio[]>([]);

  public response = this.responseSource.asObservable();
  public trackStatus: Status = 'idle';

  private playList?: Audio[];
  public currentTrack?: Audio;
  public isPlaying = false;
  public total = 6;
  public time = 0;
  public duration = 0;
  public isSoundOff = false;
  public page = 1;

  private frameSubscription: Subscription | null = null;

  constructor(private http: HttpClient) {}

  public setPage(page: number) {
    this.page = page;
  }

  public volume(value: number) {
    Howler.volume(value);
  }

  public mute(value: boolean) {
    this.isSoundOff = value;
    Howler.mute(value);
  }

  public play(id: number = this.currentTrack?.id ?? NaN) {
    this.trackStatus = 'loading';
    const audio = Number.isNaN(id)
      ? this.getTrackByIndex(0)
      : this.getTrackById(id);

    if (audio === undefined) {
      console.error('Track is not found');
      return;
    }

    this.currentTrack = audio;

    const howl =
      audio.howl ??
      new Howl({
        src: audio.src,
        html5: true,
        onload: () => {
          this.trackStatus = 'loaded';
        },
        onplay: () => {
          this.isPlaying = true;
          this.duration = howl.duration();
          this.runFrameScheduler();
        },
        onpause: () => {
          this.isPlaying = false;
        },
        onend: () => {
          this.skip('next');
        },
        onstop: () => {
          this.isPlaying = false;
          this.time = 0;
        },
        onseek: (value) => {
          //this.runFrameScheduler();
        },
      });

    audio.howl = howl;
    howl.play();
  }

  public seek(time: number) {
    this.currentTrack?.howl?.seek(time);
  }

  public pause() {
    this.currentTrack?.howl?.pause();
  }

  public stop() {
    this.currentTrack?.howl?.stop();
  }

  public skipTo(id: number) {
    this.currentTrack?.howl?.stop();
    this.play(id);
  }

  public runFrameScheduler() {
    const that = this;
    if (this.frameSubscription) {
      this.frameSubscription.unsubscribe();
      this.frameSubscription = null;
    }

    this.frameSubscription = animationFrameScheduler.schedule(
      function () {
        const howl = that.currentTrack?.howl;
        if (!howl) return;

        that.time = howl.seek();

        if (that.isPlaying) {
          this.schedule();
        }
      },
      0,
      0
    );
  }

  public skip(direction: Direction) {
    const newIndex =
      this.currentTrack?.index === undefined
        ? 0
        : this.getNewIndex(direction, this.currentTrack.index);

    const audio = this.getTrackByIndex(newIndex);

    if (audio === undefined) {
      console.error('Track is not found');
      return;
    }

    this.skipTo(audio.id);
  }

  public fetchAudioData(page: number = 1, filter: string = '') {
    const { freesoundApiToken, freesoundApiUrl } = environment;

    const params = new URLSearchParams({
      token: freesoundApiToken,
      sort: 'rating_desc',
      page_size: '5',
      page: `${page}`,
      filter: `type:mp3 original_filename:'${filter}'`,
      fields: 'id,name,previews',
    });

    const query = `${freesoundApiUrl}/search/text?${params}`;

    this.http.get(query).subscribe((resp: FreesoundResponse) => {
      console.log(resp);
    });
  }

  private getNewIndex(direction: Direction, currentIndex: number) {
    const shift = direction === 'previous' ? -1 : 1;
    return this.validateIndex(currentIndex + shift);
  }

  private validateIndex(index: number) {
    if (index < 0) return 0;
    if (index >= this.total) return this.total - 1;
    return index;
  }

  private getTrackByIndex(index: number) {
    return this.playList?.find((track) => track.index === index);
  }

  private getTrackById(id: number) {
    return this.playList?.find((track) => track.id === id);
  }

  private initPlaylist(audioFiles: Audio[]) {
    this.playList = audioFiles;
  }
}
