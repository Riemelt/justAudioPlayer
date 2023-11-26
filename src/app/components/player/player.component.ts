import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderDragEvent, MatSliderModule } from '@angular/material/slider';

import { formatTime } from '../../utilities/utilities';
import { AudioPlayerService } from '../../services/audio-player/audio-player.service';
import { PlayerControlPanelComponent } from '../player-control-panel/player-control-panel.component';
import { PlayerVolumePanelComponent } from '../player-volume-panel/player-volume-panel.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    PlayerControlPanelComponent,
    PlayerVolumePanelComponent,
    MatSliderModule,
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent {
  constructor(public audioPlayer: AudioPlayerService) {}

  public onProgressSliderDragEnd({ value }: MatSliderDragEvent) {
    this.audioPlayer.seek(value);
  }

  public onPause() {
    this.audioPlayer.pause();
  }

  public onPlay() {
    this.audioPlayer.play();
  }

  public onStop() {
    this.audioPlayer.stop();
  }

  public onPrevious() {
    this.audioPlayer.skip('previous');
  }

  public onNext() {
    this.audioPlayer.skip('next');
  }

  public onMuteButtonClick(value: number) {
    this.audioPlayer.mute(!this.audioPlayer.isSoundOff);
    this.audioPlayer.volume(value);
  }

  public onVolumeChange(value: number) {
    this.audioPlayer.volume(value);
  }

  public formatLabel(time: number) {
    return formatTime(time);
  }
}
