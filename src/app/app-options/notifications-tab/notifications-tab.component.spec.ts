import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsTabComponent } from './notifications-tab.component';

describe('NotificationsTabComponent', () => {
  let component: NotificationsTabComponent;
  let fixture: ComponentFixture<NotificationsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsTabComponent]
    });
    fixture = TestBed.createComponent(NotificationsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
