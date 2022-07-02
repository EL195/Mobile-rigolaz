import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// For translations
import { TranslateService } from '@ngx-translate/core'; 


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  language: string = this.translateService.currentLang;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService
    )
     { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }
  languageChange() {  
    this.translateService.use(this.language);  
  }

}
