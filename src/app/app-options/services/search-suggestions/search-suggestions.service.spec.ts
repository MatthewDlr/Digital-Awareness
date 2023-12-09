import { TestBed } from "@angular/core/testing";

import { SearchSuggestionsService } from "./search-suggestions.service";

describe("SearchSuggestionsService", () => {
  let service: SearchSuggestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchSuggestionsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
