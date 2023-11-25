import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LayoutComponent } from './layouts/layout/layout.component';
import { AudioTableComponent } from './components/audio-table/audio-table.component';
import { PlayerComponent } from './components/player/player.component';
import { AudioPlayerService } from './services/audio-player/audio-player.service';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LayoutComponent,
    AudioTableComponent,
    PlayerComponent,
    SearchBarComponent,
    MatDividerModule,
    MatProgressSpinnerModule,
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

  onSearch(query: string) {
    this.audioPlayer.setFilterQuery(query);
    this.audioPlayer.fetchAudioData(1);
  }
}
