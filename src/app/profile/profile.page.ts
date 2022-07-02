import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user : any = {};
  editUser : any = {};
  edit : boolean = false;
  profileRef: AngularFirestoreDocument<any>;
  profile: Observable<any[]>;
  connect: boolean = false;
  language: string = this.translateService.currentLang;
  texting : any = {};



  constructor(
    //private translate: TranslateService,
    public auth : AuthService,
    private router : Router,
    private loadingController : LoadingController,
    private db : AngularFirestore,
    private afAuth : AngularFireAuth,
    private toastController : ToastController,
    private translateService: TranslateService,
    public plt: Platform,
    private storage: AngularFireStorage,
    private alertController : AlertController
  ) { }

  ngOnInit() {
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
    this.userProfile();
    
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
        this.editUser = this.user;
        this.connect = true ;
       // loading.dismiss();
      });
    }
    else{
     // this.log = false ;
    }
  });
   
}

async delete(){
  console.log(this.user.key)
   const alert = await this.alertController.create({
    header: this.texting.deleteaccount,
    message: this.texting.deleteacsms,
    buttons: [
      {
        text: this.texting.cancel,
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, 
      {
        text: this.texting.valider,
        handler: (data) => {
          console.log('Confirm Ok');
          this.afAuth.authState.pipe(first()).subscribe((authState) => { authState.delete(); });
          this.afAuth.authState.pipe(first()).subscribe((authState) => { authState.delete(); }); 
         this.afAuth.authState.pipe(first()).subscribe(authState => {
             console.log(authState);
             authState.delete()
             //  .then(_ => alert("Compte supprimé"))
               .catch(e => console.error(e))
           });
          
        }
      }
    ]
  });

  await alert.present();

}

 /* Function Shows Notifications */
 async presentToast(message : string){
  const toast = await this.toastController.create({
    message: message,
    duration: 6000
  });
  toast.present();
}




}
