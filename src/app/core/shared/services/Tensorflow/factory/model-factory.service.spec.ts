import { TestBed } from "@angular/core/testing";

import { ModelFactoryService } from "./model-factory.service";

describe("ModelFactoryService", () => {
  let service: ModelFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelFactoryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
