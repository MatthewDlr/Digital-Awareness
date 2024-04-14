import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BedtimeModeComponent } from "./bedtime-mode.component";

describe("BedtimeModeComponent", () => {
  let component: BedtimeModeComponent;
  let fixture: ComponentFixture<BedtimeModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedtimeModeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BedtimeModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
