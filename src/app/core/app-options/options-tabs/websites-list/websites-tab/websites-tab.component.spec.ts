import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WebsitesTabComponent } from "./websites-tab.component";

describe("WebsitesTabComponent", () => {
  let component: WebsitesTabComponent;
  let fixture: ComponentFixture<WebsitesTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WebsitesTabComponent],
    });
    fixture = TestBed.createComponent(WebsitesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
