import { Component } from '@angular/core';
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
export class PlayerControlPanelComponent {}
