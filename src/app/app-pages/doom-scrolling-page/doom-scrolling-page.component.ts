import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doom-scrolling-page',
  templateUrl: './doom-scrolling-page.component.html',
  styleUrls: ['./doom-scrolling-page.component.css']
})
export class DoomScrollingPageComponent {
  outputUrl!: URL;
  tabId!: string;
  
  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe((params) => {
      this.tabId = decodeURIComponent(params['tabId']);
      this.outputUrl = new URL(decodeURIComponent(params['outputURL']));
    });
    
   }
}
