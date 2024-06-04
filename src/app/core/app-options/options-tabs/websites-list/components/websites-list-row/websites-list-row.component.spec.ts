import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WebsitesListRowComponent } from "./websites-list-row.component";

describe("WebsitesListRowComponent", () => {
  let component: WebsitesListRowComponent;
  let fixture: ComponentFixture<WebsitesListRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsitesListRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebsitesListRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
