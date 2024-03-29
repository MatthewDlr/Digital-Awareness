import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AwarenessPageComponent } from "./awareness-page.component";

describe("AwarenessPageComponent", () => {
  let component: AwarenessPageComponent;
  let fixture: ComponentFixture<AwarenessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwarenessPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwarenessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
