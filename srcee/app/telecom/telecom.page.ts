import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-telecom',
  templateUrl: './telecom.page.html',
  styleUrls: ['./telecom.page.scss'],
})
export class TelecomPage implements OnInit {
  user : any = {};
  editUser : any = {};
  edit : boolean = false;
  profileRef: AngularFirestoreDocument<any>;
  profile: Observable<any[]>;
  connect: boolean = false;
  compteurCollection: AngularFirestoreCollection<any>;
  comteurelt: any;
  event: any = "mine";
  language: string = this.translateService.currentLang;
  texting : any = {};



  constructor(
    //private translate: TranslateService,
    public auth : AuthService,
    private translateService: TranslateService,
    private router : Router,
    private loadingController : LoadingController,
    private db : AngularFirestore,
    private afAuth : AngularFireAuth,
  private toastController : ToastController,
    public plt: Platform,
    private readonly afs: AngularFirestore,
    private storage: AngularFireStorage,
    private alertController : AlertController,
  ) { }

  ngOnInit() {
    this.userProfile();
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }
  /* Pull up Profile if user is logged in*/
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
       //   loading.dismiss();
          this.checkcompteurExistUser(this.user.key).subscribe((data) => {
            //console.log(data)
            if (data.length != 0) {
              //this.vue= true;
              console.log(data[0].cpt)
              this.comteurelt = data[0].cpt;
              
            }
          })
      });
    }
    else{
      this.connect = false ;
    }
  });
   
}

pay(){
  if(this.connect == false){
    this.payTraitement();
  }
  else{
    this.premium();
  }
}
  Validatepay() {
    console.log("Payé")
  }

async payTraitement() {
  const alert = await this.alertController.create({
    header: this.texting.connect,
    message: this.texting.svp,
    buttons: [
      {
        text: this.texting.cancel,
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: this.texting.login,
        handler: (data) => {
          console.log('Confirm Ok');
          this.router.navigate(['/login']);
        }
      }
    ]
  });

  await alert.present();
} 




checkcompteurExistUser(compteurt) {
  console.log(compteurt)
  //sconsole.log(this.user.key)
  this.compteurCollection = this.afs.collection<any>('compteursLiaison', ref => ref
    .where('autor', '==', compteurt));
  return this.compteurCollection.valueChanges().pipe(first());
}

segmentChanged(ev: any) {
  console.log(ev);
  console.log(ev.detail.value);
  this.event=ev.detail.value;
}

async premium(){
  const alert = await this.alertController.create({
    header: this.texting.pyt,
    message: this.texting.ptext,
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
          //this.afAuth.auth.signOut();
          //this.router.navigateByUrl( '/login' );
          
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
