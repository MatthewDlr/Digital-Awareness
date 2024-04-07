import { TestBed } from "@angular/core/testing";

import { InferenceService } from "../tf-inference/tf-inference.service";

describe("InferenceService", () => {
  let service: InferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InferenceService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
