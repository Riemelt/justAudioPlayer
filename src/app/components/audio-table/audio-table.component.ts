import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { AudioDataSource } from '../../../data-sources/audio-table-data-source/audio-table-data-source';
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
  audioDataSource = new AudioDataSource(this.audioPlayer);

  constructor(public audioPlayer: AudioPlayerService) {}

  ngOnInit(): void {}

  onPageChange({ pageIndex }: PageEvent) {
    this.audioPlayer.setPage(pageIndex + 1);
  }

  onRowClick(id: number) {
    this.audioPlayer.skipTo(id);
  }
}
