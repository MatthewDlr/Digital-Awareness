import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DoomScrollingComponent } from "./doom-scrolling.component";

describe("DoomScrollingComponent", () => {
  let component: DoomScrollingComponent;
  let fixture: ComponentFixture<DoomScrollingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoomScrollingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoomScrollingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
