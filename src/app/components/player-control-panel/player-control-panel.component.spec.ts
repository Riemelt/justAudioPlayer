import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlPanelComponent } from './player-control-panel.component';

describe('PlayerControlPanelComponent', () => {
  let component: PlayerControlPanelComponent;
  let fixture: ComponentFixture<PlayerControlPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerControlPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
