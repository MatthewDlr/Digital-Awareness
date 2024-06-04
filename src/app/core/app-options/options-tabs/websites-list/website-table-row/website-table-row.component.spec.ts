import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WebsiteTableRowComponent } from "./website-table-row.component";

describe("WebsiteTableRowComponent", () => {
  let component: WebsiteTableRowComponent;
  let fixture: ComponentFixture<WebsiteTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteTableRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebsiteTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
