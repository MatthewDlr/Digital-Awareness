import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockpageTabComponent } from './blockpage-tab.component';

describe('BlockpageTabComponent', () => {
  let component: BlockpageTabComponent;
  let fixture: ComponentFixture<BlockpageTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockpageTabComponent]
    });
    fixture = TestBed.createComponent(BlockpageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
