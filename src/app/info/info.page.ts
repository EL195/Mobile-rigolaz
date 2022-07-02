import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; 
@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  language: string = this.translateService.currentLang;
  texting : any = {};


  constructor(
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }

}
