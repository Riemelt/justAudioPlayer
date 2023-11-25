import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Subscription,
  animationFrameScheduler,
  catchError,
  map,
  of,
  throwError,
} from 'rxjs';
import { Howl, Howler } from 'howler';

import { environment } from '../../../environments/environment';

import { Direction, FreesoundResponse, Status, Audio } from './types';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private responseSource = new BehaviorSubject<Audio[]>([]);
  public response = this.responseSource.asObservable();

  public playlistStatus: Status = 'idle';
  public playlistError?: string;
  public playList?: Audio[];

  public trackStatus: Status = 'idle';
  public trackError?: string;

  public currentTrack?: Audio;
  public isPlaying = false;
  public total = 0;
  public time = 0;
  public duration = 0;
  public isSoundOff = false;
  public page = 1;
  public filterQuery = '';

  private frameSubscription: Subscription | null = null;

  constructor(private http: HttpClient) {}

  public setFilterQuery(query: string) {
    this.filterQuery = query;
  }

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
    const audio = Number.isNaN(id)
      ? this.playList?.[0]
      : id === this.currentTrack?.id
      ? this.currentTrack
      : this.getTrackById(id);

    if (audio === undefined) {
      this.trackError = 'Track not found';
      this.trackStatus = 'failed';
      return;
    }

    this.currentTrack = audio;

    const howl = audio.howl ?? this.initHowl(audio.src);

    audio.howl = howl;
    howl.play();
  }

  public initHowl(src: string) {
    this.trackStatus = 'loading';

    const howl = new Howl({
      src,
      html5: true,
      onload: () => {
        this.trackStatus = 'loaded';
      },
      onplay: () => {
        this.playlistStatus = 'idle';
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
      onloaderror: () => {
        this.trackStatus = 'failed';
        this.trackError = 'Failed to load track';
      },
      onplayerror: () => {
        this.trackStatus = 'failed';
        this.trackError = 'Failed to play track';
      },
    });

    return howl;
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
      this.currentTrack?.id === undefined
        ? 0
        : this.getNewIndex(
            direction,
            this.getTrackIndex(this.currentTrack.id) ?? 0
          );

    const audio = this.playList?.[newIndex];

    if (audio === undefined) {
      console.error('Track is not found');
      return;
    }

    this.skipTo(audio.id);
  }

  public fetchAudioData(page: number = 1, filter: string = this.filterQuery) {
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

    this.playlistStatus = 'loading';

    this.http.get<FreesoundResponse>(query).subscribe({
      next: ({ count, results }: FreesoundResponse) => {
        this.total = count;
        const audioFiles: Audio[] = results.map((result) => ({
          id: result.id,
          name: result.name,
          src: result.previews['preview-hq-mp3'],
          filename: this.getFileNameFromSrc(result.previews['preview-hq-mp3']),
          howl: null,
        }));
        this.initPlaylist(audioFiles);
        this.responseSource.next(audioFiles);
      },
      error: () => {
        this.playlistError = 'Failed to load playlist';
        this.playlistStatus = 'failed';
      },
    });
  }

  private getFileNameFromSrc(src: string) {
    return src.slice(src.lastIndexOf('/') + 1);
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

  public getTrackIndex(id: number) {
    return this.playList?.findIndex((track) => track.id === id);
  }

  private getTrackById(id: number) {
    return this.playList?.find((track) => track.id === id);
  }

  private initPlaylist(audioFiles: Audio[]) {
    this.playlistStatus = 'loaded';
    this.playList = audioFiles;
  }
}
