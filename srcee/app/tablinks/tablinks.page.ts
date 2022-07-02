import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuController, ToastController, AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AuthService } from '../_services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilityFunctionsService } from '../_services/utility-functions.service';

@Component({
  selector: 'app-tablinks',
  templateUrl: './tablinks.page.html',
  styleUrls: ['./tablinks.page.scss'],
})
export class TablinksPage implements OnInit {
  language: string = this.translateService.currentLang;
  texting : any = {};routerOutlet: any;
  log: boolean = false;
  user : any = {};
  slider1: any ={
    value1 : "",
    value2:""
   
  };
  slider2: any ={
    value1 : "",
    value2:""
   
  };
  slider3: any ={
    value1 : "",
    value2:""
   
  };
  connect: boolean =  false;

  constructor(
    private translateService: TranslateService,
    public menuCtrl: MenuController,
    public router: Router,
    public auth : AuthService,
    public toastController: ToastController,
    private alertCtrl: AlertController,
    private afAuth : AngularFireAuth,
    public plt: Platform,
   // private storage: AngularFireStorage,
    private alertController : AlertController
    //private platform: Platform
  ) {

  }

  ngOnInit() {
    /* Connected User Info */
    this.userProfile();
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });

  }

  login(){
    this.router.navigate(['/login']);
    console.log("vu")
  }

  settings(){
    this.router.navigate(['/settings']);
  }

  help(){
    this.router.navigate(['/help']);
  }

  search(){
    this.router.navigate(['/search']);
  }

  profile(){
    this.router.navigate(['/profile']);
  }



  profileGo(){
    if(this.connect==false){
        this.presentToast(this.texting.svp);

    }
      else{
      this.router.navigateByUrl( '/profile' );
    }

  }

  history(){
    if(this.connect==false){
        this.presentToast(this.texting.svp);

    }
      else{
      this.router.navigateByUrl( '/history' );
    }

  }
  /* Function Shows Notifications */
async presentToast(message : string){
  const toast = await this.toastController.create({
    message: message,
    duration: 6000
  });
  toast.present();
}

  news(){
    this.router.navigate(['/newsletter']);
  }
  kiosque(){
    this.router.navigate(['/kiosque']);
  }

  download(){
    this.router.navigate(['/download']);
  }
  galerry(){
    this.router.navigate(['/gallery']);
  }

  category(item){
    console.log(item)
    this.router.navigate(['/category', item]);

  }
  charge(){
    this.router.navigate(['/telechargement']);
  }
  async logOut(){
    const alert = await this.alertController.create({
      header: this.texting.logout,
      message: this.texting.logoutm,
      buttons: [
        {
          text: this.texting.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.texting.valider,
          handler: (data) => {
            this.afAuth.auth.signOut();
            this.router.navigateByUrl( '/login' );
            
          }
        }
      ]
    });
  
    await alert.present();
  }

async userProfile(){
    this.auth.isLoggedIn().then(data => {
      if (data) {
        console.log(data)
        this.auth.currentUser(data).subscribe(info => {
          this.user.email = info[0]["email"];
          this.user.fName = info[0]["fName"];
          this.user.lName = info[0]["lName"];
          this.user.address = info[0]["address"];
          this.user.id = info[0]["id"];
          this.user.photoURL = info[0]["photoURL"];
          this.user.role = info[0]["role"];
          this.user.tel = info[0]["telephone"];
          this.user.key = info[0]["key"];
          this.user.comptePrincipal = info[0]["comptePrincipal"];
          this.user.compteBonus = info[0]["compteBonus"];
          this.user.pays = info[0]["pays"];
          this.user.pseudo = info[0]["pseudo"];
          this.user.ville = info[0]["ville"]; 
          this.log = true ;
          console.log(this.user.email)
          this.connect=true;
        });
      }
      else{
        this.log = false ;
      }
    });
     
  }

  showSlider1(){
    console.log(this.slider1);
    if ( this.slider1 == 'a'){
      this.router.navigate(['/news-only']);
    }
    if ( this.slider1 == 'b'){
      const cate = "actualites";
      this.router.navigate(['/category', cate]);
    }
  }

  showSlider2(){
    console.log(this.slider2);
    if ( this.slider2 == 'c'){
      this.router.navigate(['/interview']);
    }
    if ( this.slider2 == 'd'){
      this.router.navigate(['/gallery']);
    }
  }

  showSlider3(){
    console.log(this.slider3);
    if ( this.slider3 == 'e'){
      const cate = "soirees";
      this.router.navigate(['/category', cate]);
    }
    if ( this.slider3 == 'f'){
      this.router.navigate(['/spot']);
    }
  }

pdg(){
  this.router.navigate(['/tabs/tab2']);
}

editrial(){
  this.router.navigate(['/tabs/tab2']);
}
select(){
  this.router.navigate(['/news-only']);
}

tv(){
  this.router.navigate(['/tabs/tab3']);
}


test(){
  this.router.navigate(['/home']);
}



async presentAlertConfirm() {
  const alert = await this.alertCtrl.create({
    header: 'Confirmation de fermeture',
    message: 'Voulez-vous vraiment fermer Challenge international?',
    buttons: [
      {
        text: 'Annuler',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Valider',
        handler: () => {
          console.log('Confirm Okay');
          navigator['app'].exitApp()
        }
      }
    ]
  });

  await alert.present();
}

}
