import { TestBed } from "@angular/core/testing";

import { WebsitePaletteService } from "./website-palette.service";

describe("WebsitePaletteService", () => {
  let service: WebsitePaletteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsitePaletteService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
