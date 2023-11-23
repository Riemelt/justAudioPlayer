import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { AudioPlayerService } from '../../app/services/audio-player/audio-player.service';
import { AUDIO_FILES } from './mock-data';
import { Audio } from './types';

export class AudioDataSource extends DataSource<Audio> {
  data: Observable<Audio[]> = of(AUDIO_FILES);

  constructor(public audioPlayer: AudioPlayerService) {
    super();
    this.data = this.audioPlayer.response;
  }

  connect(): Observable<Audio[]> {
    return this.data;
  }

  disconnect() {}
}
