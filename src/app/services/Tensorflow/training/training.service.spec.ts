import { TestBed } from "@angular/core/testing";

import { TrainingService } from "./tf-training.service";

describe("TrainingService", () => {
  let service: TrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
