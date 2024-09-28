import { Component, OnInit } from '@angular/core';
import { CenterService } from './services/center/center.service';
import { DomSanitizer, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  center!: any;
  title!: string;

  constructor(
    private centerService: CenterService,
    private titleService: Title,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.centerService.getCenterDetails().subscribe(data => {
      this.center = data;
      console.log(this.center);

      if (this.center) {
        this.title = this.center.name || 'Training Center';
        this.titleService.setTitle(this.title);

        if (this.center.image) {
          this.changeFavicon(this.getImageUrl(this.center.image));
        }
      }
    });
  }

  getImageUrl(imageData: string) {
    if (imageData) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
    } else {
      return 'assets/DefaultImage.png'; 
    }
  }

  changeFavicon(iconUrl: any) {
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) {
      link.href = iconUrl.changingThisBreaksApplicationSecurity || iconUrl; // Handle safe URL or fallback
    }
  }
}
