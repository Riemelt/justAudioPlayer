import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

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
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '*',
          visibility: 'visible',
          opacity: '1',
          display: '*',
        })
      ),
      state(
        'closed',
        style({
          height: '0px',
          visibility: 'hidden',
          opacity: '0',
          display: 'none',
        })
      ),
      transition('open <=> closed', [animate('0.2s')]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = 'justAudioPlayer';

  constructor(
    public audioPlayer: AudioPlayerService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.audioPlayer.onTimeNotify().subscribe(() => {
      this.changeDetector.detectChanges();
    });
    this.audioPlayer.fetchAudioData();
  }

  onSearch(query: string) {
    this.audioPlayer.fetchAudioData(1, query);
  }
}
