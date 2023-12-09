import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AwarenessPageOptionComponent } from "./awareness-page-option.component";

describe("AwarenessPageOptionComponent", () => {
  let component: AwarenessPageOptionComponent;
  let fixture: ComponentFixture<AwarenessPageOptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AwarenessPageOptionComponent],
    });
    fixture = TestBed.createComponent(AwarenessPageOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
