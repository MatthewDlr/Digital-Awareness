import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisconnectTabComponent } from "./disconnect-tab.component";

describe("DisconnectTabComponent", () => {
  let component: DisconnectTabComponent;
  let fixture: ComponentFixture<DisconnectTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DisconnectTabComponent],
    });
    fixture = TestBed.createComponent(DisconnectTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
