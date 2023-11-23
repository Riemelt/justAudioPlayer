import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { Howl } from 'howler';

import { AUDIO_FILES } from '../../../data-sources/audio-table-data-source/mock-data';
import { Audio } from '../../../data-sources/audio-table-data-source/types';
import { Status } from './types';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private responseSource = new BehaviorSubject<Audio[]>([]);
  public response = this.responseSource.asObservable();
  public status: Status = 'idle';
  howl?: Howl;

  constructor() {}

  play() {
    this.howl?.play();
  }

  initHowl(audioFiles: Audio[]) {
    this.status = 'loading';
    this.howl = new Howl({
      src: audioFiles.map((audio) => audio.src),
      onload: () => {
        this.status = 'loaded';
      },
    });
  }

  fetchAudioData() {
    of(AUDIO_FILES).subscribe((resp) => {
      this.initHowl(resp);
      this.responseSource.next(resp);
    });
  }
}
