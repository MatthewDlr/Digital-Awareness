import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TensorflowService } from "./services/tensorflow/tensorflow.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: true,
  imports: [RouterOutlet],
  providers: [TensorflowService],
})
export class AppComponent {
  constructor(private tensorflowService: TensorflowService) {}
}
