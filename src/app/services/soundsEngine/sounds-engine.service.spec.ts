import { TestBed } from "@angular/core/testing";

import { SoundsEngineService } from "./sounds-engine.service";

describe("SoundsEngineService", () => {
  let service: SoundsEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoundsEngineService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
