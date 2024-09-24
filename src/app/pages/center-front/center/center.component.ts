import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CenterService } from 'src/app/services/center/center.service';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.css']
})
export class CenterComponent  implements OnInit {
  center: any;

  constructor(
    private centerService: CenterService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.centerService.getCenterDetails().subscribe(data => {
      this.center = data;
      console.log(this.center);
    });
  }


  getImageUrl(imageData: string) {
    if (imageData) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
    } else {
      return 'assets/DefaultImage.png';
    }
  }
}