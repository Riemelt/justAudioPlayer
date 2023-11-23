import { Component, Input } from '@angular/core';
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
  | 'stop';

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
}
