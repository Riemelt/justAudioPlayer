import { Injectable } from '@angular/core';
import { BehaviorSubject, animationFrameScheduler, of } from 'rxjs';
import { Howl, Howler } from 'howler';

import { AUDIO_FILES } from '../../../data-sources/audio-table-data-source/mock-data';
import { Audio } from '../../../data-sources/audio-table-data-source/types';
import { Direction, Status } from './types';

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

  constructor() {}

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
          this.isPlaying = false;
        },
        onstop: () => {
          this.isPlaying = false;
          this.time = 0;
        },
        onseek: () => {
          this.runFrameScheduler();
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

    animationFrameScheduler.schedule(
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

  public fetchAudioData() {
    of(AUDIO_FILES).subscribe((resp) => {
      this.initPlaylist(resp);
      this.responseSource.next(resp);
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
