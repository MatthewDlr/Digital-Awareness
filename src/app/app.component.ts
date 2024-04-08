import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { WebsiteAccessService } from "./services/Tensorflow/Website Access/website-access.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor(private websiteAccess: WebsiteAccessService) {}
}
