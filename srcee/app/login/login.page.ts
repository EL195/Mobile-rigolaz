import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { ToastController, Platform, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../_services/auth.service';
import { first, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core'; 
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pseudo : string = "";
  password : string = "";
  subscription: any;
  language: string = this.translateService.currentLang;
  texting : any = {};
  categoryCollection: AngularFirestoreCollection<any>;
  category: Observable<any[]>;
  principal: any = [];
  email: string = "";

  constructor(
    private translateService: TranslateService,
    private router : Router,
    private splashScreen: SplashScreen,
    private toastController : ToastController,
    private auth : AuthService,
    private afAuth : AngularFireAuth,
    private readonly afs: AngularFirestore,
    private platform : Platform,
    private alertController : AlertController
    ) { }

  ngOnInit() {
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }

  languageChange() {  
    this.translateService.use(this.language);  
  }

  async login() {
           const { email, password } = this ;
           const res = await this.auth.login(email, password);
           if( "code" in res) {
             this.presentToast(res.message);
           }
           else{
            /* this.auth.currentUser().subscribe(data => {
               console.log(data);
             });*/
             this.auth.setCurrentUser()
             this.router.navigate(['/tablinks/pay']);
           }
 }

 go(){
  this.router.navigate(['/tablinks/pay']);
 }

 loginEmail(){
   
 }

  /* Function Shows Notifications */
  async presentToast(message : string){
    const toast = await this.toastController.create({
      message: message,
      duration: 6000
    });
    toast.present();
  }

  async emailPrompt() {
    const alert = await this.alertController.create({
      header: this.texting.connect_forg,
      message: this.texting.loginsms,
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder : 'votre@email.com'
        }
      ],
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
            console.log('Confirm Ok');
            if(data.email.trim() != ''){
              console.log('email : ' + data.email);
              this.auth.passwordResetEmail(data.email)
              this.presentToast(this.texting.checksms);
            }
            
          }
        }
      ]
    });

    await alert.present();
  } 

  getEmail() {
    if(this.pseudo=="" || this.password=="") {
      this.presentToast(this.texting.identerror);
    }
    else{
   // console.log(category)
   this.categoryCollection = this.afs.collection<any>('client', ref => ref
   .where('pseudo', '==', this.pseudo)
  // .where('visible', '==', true)
   );
 this.category = this.categoryCollection.snapshotChanges().pipe(
   map(actions => actions.map(a => {
     const data = a.payload.doc.data() as any;
     const id = a.payload.doc.id;
    // this.idDesc = id;
     console.log(data)
     return { id, ...data };

   }))
 ); this.category.subscribe(data => {

   this.principal = data[0];
   console.log(this.principal)
   if(data[0].length !=0){
    console.log(this.principal)
    console.log(this.principal.email)
    this.email = this.principal.email;
    this.login();
   }
   else{
    this.presentToast(this.texting.errrif);
   }
   console.log(this.principal)
   console.log(this.principal.email)
  // console.log(this.principal[0].idDetailArticle)
   //this.loginEmail();


 });
    }

  }

}
