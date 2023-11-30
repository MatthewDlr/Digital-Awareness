import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreathingWidgetComponent } from './breathing-widget.component';

describe('BreathingWidgetComponent', () => {
  let component: BreathingWidgetComponent;
  let fixture: ComponentFixture<BreathingWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreathingWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreathingWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
