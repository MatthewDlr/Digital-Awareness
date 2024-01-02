import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HighlightedWebsitesRowComponent } from "./highlighted-websites-row.component";

describe("HighlightedWebsitesRowComponent", () => {
  let component: HighlightedWebsitesRowComponent;
  let fixture: ComponentFixture<HighlightedWebsitesRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlightedWebsitesRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HighlightedWebsitesRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
