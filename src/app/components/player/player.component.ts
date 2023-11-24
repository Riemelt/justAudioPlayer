import { Component, OnInit } from '@angular/core';
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
export class PlayerComponent implements OnInit {
  constructor(public audioPlayer: AudioPlayerService) {}

  ngOnInit(): void {}

  onProgressSliderDragEnd({ value }: MatSliderDragEvent) {
    this.audioPlayer.seek(value);
  }

  onPause() {
    this.audioPlayer.pause();
  }

  onPlay() {
    this.audioPlayer.play();
  }

  onStop() {
    this.audioPlayer.stop();
  }

  onPrevious() {
    this.audioPlayer.skip('previous');
  }

  onNext() {
    this.audioPlayer.skip('next');
  }

  onMuteButtonClick(value: number) {
    this.audioPlayer.mute(!this.audioPlayer.isSoundOff);
    this.audioPlayer.volume(value);
  }

  onVolumeChange(value: number) {
    this.audioPlayer.volume(value);
  }

  formatLabel(time: number) {
    return formatTime(time);
  }
}
