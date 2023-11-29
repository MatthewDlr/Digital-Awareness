import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AwarenessPageTabComponent } from "./awareness-page-tab.component";

describe("AwarenessPageTabComponent", () => {
  let component: AwarenessPageTabComponent;
  let fixture: ComponentFixture<AwarenessPageTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AwarenessPageTabComponent]
    });
    fixture = TestBed.createComponent(AwarenessPageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
