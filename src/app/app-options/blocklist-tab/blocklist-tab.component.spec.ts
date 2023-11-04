import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocklistTabComponent } from './blocklist-tab.component';

describe('BlocklistTabComponent', () => {
  let component: BlocklistTabComponent;
  let fixture: ComponentFixture<BlocklistTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlocklistTabComponent]
    });
    fixture = TestBed.createComponent(BlocklistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
