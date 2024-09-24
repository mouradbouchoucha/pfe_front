import { Component } from '@angular/core';

@Component({
  selector: 'app-center-front',
  templateUrl: './center-front.component.html',
  styleUrls: ['./center-front.component.css']
})
export class CenterFrontComponent {
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
