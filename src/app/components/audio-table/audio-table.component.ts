import { Component, OnInit } from '@angular/core';
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
export class AudioTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'filename'];

  constructor(public audioPlayer: AudioPlayerService) {}

  ngOnInit(): void {}

  onPageChange({ pageIndex }: PageEvent) {
    this.audioPlayer.fetchAudioData(pageIndex + 1);
  }

  onRowClick(id: number) {
    this.audioPlayer.skipTo(id);
  }
}
