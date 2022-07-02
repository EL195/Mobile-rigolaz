import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  language: string = this.translateService.currentLang;
  texting : any = {};


  constructor(
    private translateService: TranslateService,
    private router : Router,
    private menu: MenuController

  ) { }

  ngOnInit() {
  }
  

  async  openMenu() {
    await MenuController.call('MainMenu');
  }

}
