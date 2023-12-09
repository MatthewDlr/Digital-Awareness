import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NotificationsOptionComponent } from "./notifications-option.component";

describe("NotificationsOptionComponent", () => {
  let component: NotificationsOptionComponent;
  let fixture: ComponentFixture<NotificationsOptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsOptionComponent],
    });
    fixture = TestBed.createComponent(NotificationsOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
