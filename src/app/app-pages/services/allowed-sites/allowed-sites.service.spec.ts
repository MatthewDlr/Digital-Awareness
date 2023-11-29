import { TestBed } from "@angular/core/testing";

import { AllowedSitesService } from "./allowed-sites.service";

describe("AllowedSitesService", () => {
  let service: AllowedSitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllowedSitesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
