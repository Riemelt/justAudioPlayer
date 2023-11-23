import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';

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

  playSound() {
    this.audioPlayer.play();
  }
}
