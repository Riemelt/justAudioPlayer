import { Component } from '@angular/core';
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
export class PlayerVolumePanelComponent {}
