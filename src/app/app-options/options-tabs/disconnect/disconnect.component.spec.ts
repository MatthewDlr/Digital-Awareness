import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisconnectComponent } from "./disconnect.component";

describe("DisconnectComponent", () => {
  let component: DisconnectComponent;
  let fixture: ComponentFixture<DisconnectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DisconnectComponent],
    });
    fixture = TestBed.createComponent(DisconnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
