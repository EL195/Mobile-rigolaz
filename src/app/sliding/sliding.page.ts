import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-sliding',
  templateUrl: './sliding.page.html',
  styleUrls: ['./sliding.page.scss'],
})
export class SlidingPage implements OnInit {

  @ViewChild('slides') slides: IonSlides;
  
  language: string = this.translateService.currentLang;
  texting : any = {};
  color: string ="#876CB6";

  

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };


  constructor(
    private nativeStorage: NativeStorage,
    private storage: Storage,
    private router : Router,
    private translateService: TranslateService,
    
  ) { }

  ngOnInit() {
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });

     console.log(this.slideOpts)
  }

  nextSlide(item) {
    console.log(item)
    this.slides.slideNext();
}
nextPrev(item){
  console.log(item)
  this.slides.slidePrev();
}


slideChanged() { 
  this.slides.getActiveIndex().then(index => {
     console.log(index);
     if(index==0){
      this.color ="#876CB6";
     }
     if(index==1){
      this.color ="#FFFFFF";
     }
     if(index==2){
      this.color ="#72A3F4";
    }
  });

  }

  finishAppOnboarding() {
    localStorage.setItem('loan' ,'true');
    this.router.navigate(['/tablinks/pay']);
  }


}
