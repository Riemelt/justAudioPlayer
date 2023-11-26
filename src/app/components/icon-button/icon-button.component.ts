import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

type IconType =
  | 'skip_previous'
  | 'skip_next'
  | 'play_arrow'
  | 'pause'
  | 'volume_up'
  | 'volume_off'
  | 'stop'
  | 'search';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
  @Input() type: IconType = 'play_arrow';
  @Input() ariaLabel = '';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter();

  public handleClick() {
    this.onClick.emit();
  }
}
