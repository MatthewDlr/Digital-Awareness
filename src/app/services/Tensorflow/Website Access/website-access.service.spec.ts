import { TestBed } from "@angular/core/testing";

import { WebsiteAccessService } from "./website-access.service";

describe("WebsiteAccessService", () => {
  let service: WebsiteAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsiteAccessService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
