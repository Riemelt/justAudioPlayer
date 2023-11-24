import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-player-control-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, IconButtonComponent],
  templateUrl: './player-control-panel.component.html',
  styleUrl: './player-control-panel.component.scss',
})
export class PlayerControlPanelComponent {
  @Input() isPlaying = false;
  @Input() total = 0;
  @Input() index = 0;
  @Output() onPlayClick = new EventEmitter();
  @Output() onPauseClick = new EventEmitter();
  @Output() onStopClick = new EventEmitter();
  @Output() onPreviousClick = new EventEmitter();
  @Output() onNextClick = new EventEmitter();

  handlePauseButton() {
    this.onPauseClick.emit();
  }

  handlePlayButton() {
    this.onPlayClick.emit();
  }

  handleStopButton() {
    this.onStopClick.emit();
  }

  handlePreviousButton() {
    this.onPreviousClick.emit();
  }

  handleNextButton() {
    this.onNextClick.emit();
  }
}
