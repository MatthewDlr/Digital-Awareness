import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HighlightedWebsitesOptionComponent } from "./highlighted-websites-option.component";

describe("HighlightedWebsitesOptionComponent", () => {
  let component: HighlightedWebsitesOptionComponent;
  let fixture: ComponentFixture<HighlightedWebsitesOptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightedWebsitesOptionComponent]
    });
    fixture = TestBed.createComponent(HighlightedWebsitesOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
