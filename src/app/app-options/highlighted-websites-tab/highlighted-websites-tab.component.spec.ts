import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightedWebsitesTabComponent } from './highlighted-websites-tab.component';

describe('HighlightedWebsitesTabComponent', () => {
  let component: HighlightedWebsitesTabComponent;
  let fixture: ComponentFixture<HighlightedWebsitesTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightedWebsitesTabComponent]
    });
    fixture = TestBed.createComponent(HighlightedWebsitesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
