import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { LayoutComponent } from './layouts/layout/layout.component';
import { AudioTableComponent } from './components/audio-table/audio-table.component';
import { PlayerComponent } from './components/player/player.component';
import { AudioPlayerService } from './services/audio-player/audio-player.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LayoutComponent,
    AudioTableComponent,
    PlayerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'justAudioPlayer';

  constructor(public audioPlayer: AudioPlayerService) {}

  ngOnInit(): void {
    this.audioPlayer.fetchAudioData();
  }
}
