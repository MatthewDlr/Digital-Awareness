import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WebsitesPaletteComponent } from "./websites-palette.component";

describe("WebsitesPaletteComponent", () => {
  let component: WebsitesPaletteComponent;
  let fixture: ComponentFixture<WebsitesPaletteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebsitesPaletteComponent]
    });
    fixture = TestBed.createComponent(WebsitesPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
