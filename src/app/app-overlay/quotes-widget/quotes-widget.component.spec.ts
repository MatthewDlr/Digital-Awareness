import { ComponentFixture, TestBed } from "@angular/core/testing";

import { QuotesWidgetComponent } from "./quotes-widget.component";

describe("QuotesWidgetComponent", () => {
  let component: QuotesWidgetComponent;
  let fixture: ComponentFixture<QuotesWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotesWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuotesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
