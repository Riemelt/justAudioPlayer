import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerVolumePanelComponent } from './player-volume-panel.component';

describe('PlayerVolumePanelComponent', () => {
  let component: PlayerVolumePanelComponent;
  let fixture: ComponentFixture<PlayerVolumePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerVolumePanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerVolumePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
