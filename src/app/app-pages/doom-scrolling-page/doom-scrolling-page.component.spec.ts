import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoomScrollingPageComponent } from './doom-scrolling-page.component';

describe('DoomScrollingPageComponent', () => {
  let component: DoomScrollingPageComponent;
  let fixture: ComponentFixture<DoomScrollingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoomScrollingPageComponent]
    });
    fixture = TestBed.createComponent(DoomScrollingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
