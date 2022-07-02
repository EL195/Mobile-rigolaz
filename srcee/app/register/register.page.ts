import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AlertController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { AuthService } from '../_services/auth.service';
import { UtilityFunctionsService } from '../_services/utility-functions.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core'; 
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email : string = "";
  password : string = "";
  pseudo : string = "";
  cpt : string = "01429472";
  born : any = "";
  sex : string = "";
  cpassword : string = "";
  term: boolean = false;
  language: string = this.translateService.currentLang;
  texting : any = {};
  usert: AngularFirestoreCollection<any>;

	mail : any;

  constructor(
    private afAuth : AngularFireAuth,
    private translateService: TranslateService,
    public toastController: ToastController,
    private authS : AuthService,
    private readonly afs: AngularFirestore,
    private utilityF : UtilityFunctionsService,
    private db : AngularFirestore,
    private router : Router,
    private alertController : AlertController
  ) { }

  ngOnInit() {
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }

  async signUp() {
    console.log(this.email);
    console.log(this.pseudo);
    console.log(this.password);
    console.log(this.cpassword);
    if(this.email == "" || this.pseudo=="" || this.password=="" || this.cpassword==""){
      this.presentToast(this.texting.identerror);
    }
    else{
      if(this.cpt.length == 12){
      const bi = this.born.split('T')[0]; 
      const text = "Pseudo : "+this.pseudo+"<br /> "+this.texting.compteur+" : "+this.cpt+"<br /> Email : "+this.email+"<br /> "+this.texting.nee+" : "+bi+"<br /> "+this.texting.sexe+" : "+this.sex+"\n";
      const alert = await this.alertController.create({
        header: "Confirmation",
        message: text,
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
              if(this.password!=this.cpassword){
                this.presentToast(this.texting.matches);
               }
               else{
                this.seachUser(this.pseudo).subscribe((data) => {
                  if(data.length != 0){
                    this.presentToast(this.texting.pris);
                  }else{
                    this.log();
                   // console.log('é')
                  }
                  })
               }
            }
          }
        ]
      });
      await alert.present();
      }
      else{
        this.presentToast(this.texting.ptrerror3);
      }
    }
    
  }

  async log(){
    const { email, password, cpassword  } = this ;
     

    if (password !== cpassword){
      console.log("Passwords do not match");
      this.presentToast(this.texting.notmatch);
      return;
    }





    const res = await this.authS.signUp(email, password);
    console.log(res);

    const alert = await this.alertController.create({
      header: this.texting.cgun,
      message: this.texting.notice,
      buttons: [
   {
          text: this.texting.btnok,
          handler: (data) => {
              
    if( "code" in res) {
      this.presentToast(res.message);
    }
    else {
      // Create New User in Database
      console.log('Success');
      console.log(res.user);
      let credentials = { "texte":res.user.key, "id" : res.user.uid, "email" : res.user.email, "pseudo" : this.pseudo , "sex" : this.sex, "born" : this.born, "cpt" : this.cpt}
      res.user.updateProfile({
        displayName: 'client'
      });
      this.authS.registerUser(credentials, 'client');
      //this.authS.sendVerificationEmail();
      this.presentToast('Success');
    
    this.authS.setCurrentUser();
    localStorage.setItem('verif-code', UtilityFunctionsService.getRandomArbitrary(100000, 999999)+'');
    
    this.router.navigateByUrl( '/login' );
    
      //this.logOut()
    }
          }
        }
      ]
    });

    await alert.present();
  


  
  }

    async presentToast(message) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000
      });
      toast.present();
    }

    async notice() {
      const alert = await this.alertController.create({
        header: this.texting.reinitialisation,
        message: this.texting.notice,
        buttons: [
     {
            text: this.texting.valider,
            handler: (data) => {
             // this.save();
            }
          }
        ]
      });
  
      await alert.present();
    } 

    seachUser(user) {
      console.log(user)
      //sconsole.log(this.user.key)
      this.usert = this.afs.collection<any>('client', ref => ref
        .where('pseudo', '==', user));
      return this.usert.valueChanges().pipe(first());
    }

    go(){
      this.router.navigate(['/tablinks/pay']);
     }

     login(){
      this.router.navigate(['/login']);
     }



     async emailPrompt() {

    } 

}
