import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, first } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-compteur',
  templateUrl: './compteur.page.html',
  styleUrls: ['./compteur.page.scss'],
})
export class CompteurPage implements OnInit {
  compteurCollection: AngularFirestoreCollection<any>;
  user : any = {};
  editUser : any = {};
  edit : boolean = false;
  profileRef: AngularFirestoreDocument<any>;
  profile: Observable<any[]>;
  connect: boolean = false;
  vue: boolean = false;
  compteurtext: any;
  comteurelt: any;
  puissance: any;
  programme: any;
  language: string = this.translateService.currentLang;
  texting : any = {};

  constructor(
    //private translate: TranslateService,
    public auth : AuthService,
    private router : Router,
    private toastController : ToastController,
    private loadingController : LoadingController,
    private afAuth : AngularFireAuth,
    public plt: Platform,
    private storage: AngularFireStorage,
    private alertController : AlertController,
    private readonly afs: AngularFirestore,
    private db: AngularFirestore,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
    this.userProfile();
    
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
          //loading.dismiss();
          console.log(this.user.key)
          this.checkcompteurExistUser(this.user.key).subscribe((data) => {
            //console.log(data)
            if (data.length != 0) {
              this.vue= true;
              console.log(data[0].cpt)
              this.comteurelt = data[0].cpt;
              this.puissance = data[0].puisance;
              this.programme = data[0].programme;
              
            }
          })
        });
      }
      else{
       // this.log = false ;
      }
    });
     
  }

async Add() {
  this.vue=true;
  const alert = await this.alertController.create({
    header: this.texting.newM,
    message: this.texting.svpM,
    inputs: [
      {
        name: 'email',
        type: 'text',
        placeholder : 'Ex: 456653475267',
        value : "014"
      }
    ],
    buttons: [
      {
        text: this.texting.cancel,
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
          this.vue=false;
        }
      }, {
        text: this.texting.valider,
        handler: (data) => {
          this.vue = false;
          console.log('Confirm Ok');
          if(data.email.trim() != ''){
            console.log('email : ' + data.email);
            this.compteurtext=data.email;
            console.log(data.email.length);
            if (data.email.length!=12){
              this.presentToast(this.texting.ptrerror3);
            }
            else{
             
             
              this.checkcompteur(this.compteurtext).subscribe((datass) => {
                console.log(data)
                if (datass.length == 0) {
                  console.log(data)
                  this.presentToast(this.texting.errorM);
                }
              else{

                this.checkcompteurExist(this.compteurtext).subscribe((datas) => {
                  console.log(data)
                  if (datas.length != 0) {
                    console.log(data)
                    this.presentToast(this.texting.deja);
                  }
                else{
                  this.db.collection("compteursLiaison").add({
                    id: 'cpt' + Math.random().toString(36).substr(2, 9),
                    autor: this.user.key,
                    cpt : this.compteurtext,
                    Programme: "",
                    Puissance : "",
                    user : this.user.id,
                    dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
                    visible: true             
                  });
                  this.presentToast(this.texting.dejaAcc);
                  this.vue=true; 
                }
              })
              }
            })







          }
          
        }
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

checkcompteur(compteur) {
  console.log(compteur)
  //sconsole.log(this.user.key)
  this.compteurCollection = this.afs.collection<any>('compteurs', ref => ref
    .where('cpt', '==', compteur));
  return this.compteurCollection.valueChanges().pipe(first());
}

checkcompteurExist(compteurt) {
  console.log(compteurt)
  //sconsole.log(this.user.key)
  this.compteurCollection = this.afs.collection<any>('compteursLiaison', ref => ref
    .where('cpt', '==', compteurt));
  return this.compteurCollection.valueChanges().pipe(first());
}


checkcompteurExistUser(compteurt) {
  console.log(compteurt)
  //sconsole.log(this.user.key)
  this.compteurCollection = this.afs.collection<any>('compteursLiaison', ref => ref
    .where('autor', '==', compteurt));
  return this.compteurCollection.valueChanges().pipe(first());
}


}
