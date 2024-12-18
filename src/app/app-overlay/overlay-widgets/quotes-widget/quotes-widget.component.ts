import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Quotes } from "./quotes";

@Component({
  selector: "app-quotes-widget",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./quotes-widget.component.html",
  styleUrl: "./quotes-widget.component.css",
})
export class QuotesWidgetComponent {
  quoteText = "";
  quoteAuthor = "";

  constructor(private quote: Quotes) {
    const randomQuote = this.quote.getRandomQuote();
    this.quoteText = randomQuote.text;
    this.quoteAuthor = randomQuote.author;
  }
}
