import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  Subject,
  Subscription,
  animationFrameScheduler,
  catchError,
  map,
  of,
} from 'rxjs';
import { Howl, Howler } from 'howler';

import { environment } from '../../../environments/environment';

import { Direction, FreesoundResponse, Status, Audio } from './types';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  public playlistStatus: Status = 'idle';
  public playlistError?: string;
  public playList?: Audio[];

  public trackStatus: Status = 'idle';
  public trackError?: string;

  public readonly tracksPerPage = 5;
  public currentTrack?: Audio;
  public isPlaying = false;
  public total = 0;
  public time = 0;
  public duration = 0;
  public isSoundOff = false;
  public page = 1;

  private filterQuery = '';
  private frameSubscription: Subscription | null = null;

  private timeNotifierSubject = new Subject<number>();

  constructor(private http: HttpClient) {}

  public onTimeNotify(): Observable<number> {
    return this.timeNotifierSubject.asObservable();
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

  public skip(direction: Direction) {
    const [newIndex, newPage] =
      this.currentTrack?.id === undefined
        ? [0, 1]
        : this.getNewPosition(
            direction,
            this.getLocalTrackIndex(this.currentTrack.id) ?? 0
          );

    if (newPage !== this.page) {
      this.createAudioDataRequest(newPage).subscribe(() => {
        this.skipByIndex(newIndex);
      });

      return;
    }

    this.skipByIndex(newIndex);
  }

  public fetchAudioData(page: number = 1, filter: string = this.filterQuery) {
    this.createAudioDataRequest(page, filter).subscribe();
  }

  public getGlobalTrackIndex(id: number) {
    const localIndex = this.getLocalTrackIndex(id) ?? 0;
    return localIndex + (this.page - 1) * this.tracksPerPage;
  }

  private getLocalTrackIndex(id: number) {
    return this.playList?.findIndex((track) => track.id === id);
  }

  private getTrackById(id: number) {
    return this.playList?.find((track) => track.id === id);
  }

  private timeNotify(time: number) {
    this.timeNotifierSubject.next(time);
  }

  private createAudioDataRequest(
    page: number = 1,
    filter: string = this.filterQuery
  ) {
    this.page = page;
    this.filterQuery = filter;

    const { freesoundApiToken, freesoundApiUrl } = environment;

    const params = new URLSearchParams({
      token: freesoundApiToken,
      sort: 'rating_desc',
      page_size: `${this.tracksPerPage}`,
      page: `${page}`,
      filter: `type:mp3 original_filename:'${filter}'`,
      fields: 'id,name,previews',
    });

    const query = `${freesoundApiUrl}/search/text?${params}`;

    this.playlistStatus = 'loading';

    return this.http.get<FreesoundResponse>(query).pipe(
      catchError(() => {
        this.playlistError = 'Failed to load playlist';
        this.playlistStatus = 'failed';
        return of<FreesoundResponse>({
          count: 0,
          results: [],
        });
      }),
      map(({ count, results }) => {
        this.total = count;

        const audioFiles: Audio[] = results.map((result) => ({
          id: result.id,
          name: result.name,
          src: result.previews['preview-hq-mp3'],
          filename: this.getFileNameFromSrc(result.previews['preview-hq-mp3']),
          howl: null,
        }));

        this.initPlaylist(audioFiles);
      })
    );
  }

  private skipByIndex(index: number) {
    const audio = this.playList?.[index];

    if (audio === undefined) {
      this.trackError = 'Track is not found';
      this.trackStatus = 'failed';
      return;
    }

    this.skipTo(audio.id);
  }

  private getNewPosition(direction: Direction, currentIndex: number) {
    const shift = direction === 'previous' ? -1 : 1;
    return this.validateIndex(currentIndex + shift);
  }

  private validateIndex(index: number) {
    if (index < 0) return [this.tracksPerPage - 1, this.page - 1];
    if (index >= this.tracksPerPage) return [0, this.page + 1];
    return [index, this.page];
  }

  private getFileNameFromSrc(src: string) {
    return src.slice(src.lastIndexOf('/') + 1);
  }

  private runFrameScheduler() {
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
        that.timeNotify(that.time);

        if (that.isPlaying) {
          this.schedule();
        }
      },
      0,
      0
    );
  }

  private initPlaylist(audioFiles: Audio[]) {
    this.playlistStatus = 'loaded';
    this.playList = audioFiles;
  }

  private initHowl(src: string) {
    this.trackStatus = 'loading';

    const howl: Howl = new Howl({
      src,
      html5: true,
      onload: this.handleHowlLoad.bind(this),
      onplay: () => this.handleHowlPlay(howl),
      onpause: this.handleHowlPause.bind(this),
      onend: this.handleHowlEnd.bind(this),
      onstop: this.handleHowlStop.bind(this),
      onloaderror: this.handleHowlLoadError.bind(this),
      onplayerror: this.handleHowlPlayError.bind(this),
    });

    return howl;
  }

  private handleHowlLoad() {
    this.trackStatus = 'loaded';
  }

  private handleHowlPlay(howl: Howl) {
    this.playlistStatus = 'idle';
    this.isPlaying = true;
    this.duration = howl.duration();
    this.runFrameScheduler();
  }

  private handleHowlPause() {
    this.isPlaying = false;
  }

  private handleHowlEnd() {
    const index = this.currentTrack?.id ?? 0;

    if (this.getGlobalTrackIndex(index) === this.total - 1) {
      this.isPlaying = false;
      this.time = 0;
      return;
    }

    this.skip('next');
  }

  private handleHowlStop() {
    this.isPlaying = false;
    this.time = 0;
  }

  private handleHowlLoadError() {
    this.trackStatus = 'failed';
    this.trackError = 'Failed to load track';
  }

  private handleHowlPlayError() {
    this.trackStatus = 'failed';
    this.trackError = 'Failed to play track';
  }
}
