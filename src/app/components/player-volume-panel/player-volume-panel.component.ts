import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';

import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-player-volume-panel',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, MatSliderModule],
  templateUrl: './player-volume-panel.component.html',
  styleUrl: './player-volume-panel.component.scss',
})
export class PlayerVolumePanelComponent {
  @Output() onMuteButtonClick = new EventEmitter<number>();
  @Output() onVolumeChange = new EventEmitter<number>();
  @Input() isMuted = false;

  public volume: number = 1;

  public handleMuteButtonClick() {
    this.onMuteButtonClick.emit(this.volume);
  }

  public handleVolumeChange(value: number) {
    this.volume = value;
    this.onVolumeChange.emit(value);
  }

  public formatLabel(value: number) {
    return `${Math.round(value * 100)}`;
  }
}
