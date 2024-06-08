import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CommonMethodService {

  constructor(
    private domSanitizer: DomSanitizer
  ) { }

  getImageUrl(imageData: string, imageDefaultURL: string) {
    if (imageData != null && imageData.length > 0) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
    } else {
      return imageDefaultURL;
    }
  }
}
