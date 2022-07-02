import { Component } from '@angular/core';
// For translations
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './_services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, first } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Storage } from '@ionic/storage';
//import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  user : any = {};
  editUser : any = {};
  edit : boolean = false;
  profileRef: AngularFirestoreDocument<any>;
  profile: Observable<any[]>;
  connect: boolean = false;
  language: string = this.translateService.currentLang;
  texting : any = {};

  public appPages = [
    { title: 'Compte', url: '../profile', icon: 'person' },
    { title: 'Notifications', url: '/notifications', icon: 'notifications' },
    { title: 'Historique', url: '/history', icon: 'time' },
    { title: 'Travaux programmés', url: '/works', icon: 'calendar' },
    { title: 'Aide', url: '/folder/Trash', icon: 'help' },
    { title: 'Astuces et conseils', url: '/astuces', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  loc: string;
  lg: string;

  constructor(
    private translate: TranslateService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public auth : AuthService,
    private router : Router,
    private translateService: TranslateService,
    private loadingController : LoadingController,
    private db : AngularFirestore,
    private afAuth : AngularFireAuth,
    private storage: Storage,
    //private storage: AngularFireStorage,
    private alertController : AlertController,
    private nativeStorage: NativeStorage
  ) {
    
    this.initializeApp();

  }

  initializeApp() {
    // Set default language
    this.lg = localStorage.getItem('langue');
    if(this.lg==null || this.lg==undefined){
      this.translate.setDefaultLang('en');
  }
  else{
    this.translate.setDefaultLang(this.lg);
  }
    this.platform.ready().then(() => {
    this.splashScreen.hide();
    this.pushToAppOnboarding();
    this.platform.backButton.subscribeWithPriority(0, () => {
     this.sortir();
     
   });

    this.userProfile();  
    });
      }

      async sortir(){
        const alert = await this.alertController.create({
          header: this.texting.close_t,
          message: this.texting.close_d,
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
                navigator['app'].exitApp();
              }
            }
          ]
        });
    
      }

hideSplashScreen() {
    if (this.splashScreen) {
      setTimeout(() => {
        this.splashScreen.hide();
        
      }, 3000);
      
      //this.userProfile();
     // this.pushToAppOnboarding();
     }
  }


 /* Pull up Profile if user is logged in*/
 async userProfile(){
  this.auth.isLoggedIn().then(data => {
    if (data) {
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
        this.translateService.use(info[0]["langue"]);  
        this.editUser = this.user;
        this.connect = true ;

      });
    }
    else{
      this.connect = false ;
    }
  });
    
}

pushToAppOnboarding() {
    this.loc = localStorage.getItem('loan');
    console.log(this.loc);
    if(this.loc==null || this.loc==undefined){
      this.router.navigateByUrl( '/sliding' );
  }
}
logOut(){
  this.afAuth.auth.signOut();
  this.router.navigateByUrl( '/login' );
}
}
