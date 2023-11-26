import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { AudioPlayerService } from '../../services/audio-player/audio-player.service';

@Component({
  selector: 'app-audio-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './audio-table.component.html',
  styleUrl: './audio-table.component.scss',
})
export class AudioTableComponent {
  displayedColumns: string[] = ['id', 'name', 'filename'];

  constructor(public audioPlayer: AudioPlayerService) {}

  public onPageChange({ pageIndex }: PageEvent) {
    this.audioPlayer.fetchAudioData(pageIndex + 1);
  }

  public onRowClick(id: number) {
    this.audioPlayer.skipTo(id);
  }
}
