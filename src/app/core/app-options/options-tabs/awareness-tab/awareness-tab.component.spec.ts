import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AwarenessTabComponent } from "./awareness-tab.component";

describe("AwarenessTabComponent", () => {
  let component: AwarenessTabComponent;
  let fixture: ComponentFixture<AwarenessTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AwarenessTabComponent],
    });
    fixture = TestBed.createComponent(AwarenessTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
