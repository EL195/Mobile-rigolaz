import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  language: string = this.translateService.currentLang;
  texting : any = {};
  user : any = {};
  editUser : any = {};
  edit : boolean = false;
  profileRef: AngularFirestoreDocument<any>;
  profile: Observable<any[]>;
  imgPic : Observable<any>;
  vibreur : boolean ;
  son : boolean ;

	activate_credit_button = false;
  viber: any;
  sone: any;
  client: string = "client";


  constructor(
    private translateService: TranslateService,
    public auth : AuthService,
    private router : Router,
    private loadingController : LoadingController,
    private db : AngularFirestore,
    private camera: Camera,
    private afAuth : AngularFireAuth,
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

     console.log(this.vibreur)
     console.log(this.son)
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
         // this.user.pseudo = info[0]["pseudo"];
          this.viber = info[0]["vibreur"];
          this.sone = info[0]["son"]
        });
      }
      else{
      //  this.send = false ;
      }
    });
     
  }

  myChanges($event){
    const refe = "client";
              console.log($event.target.value);
              console.log(this.sone)
              console.log(this.user.key)
          //    console.log(this.son);
          if(this.sone = true){

            this.profileRef = this.db.doc(`${refe}/${this.user.key}`);
            this.profileRef.update({ 
                  son : false
              });
            }
              
              else{
                this.profileRef = this.db.doc(`${refe}/${this.user.key}`);
                this.profileRef.update({ 
                      son : true
                  });
              } 
  }


  myChange($event){
    const refe = "client";
    console.log($event.target.value);
    console.log(this.sone)
    console.log(this.user.key)
//    console.log(this.son);
if(this.viber = true){

  this.profileRef = this.db.doc(`${refe}/${this.user.key}`);
  this.profileRef.update({ 
        vibreur : false
    });
  }
    
    else{
      this.profileRef = this.db.doc(`${refe}/${this.user.key}`);
      this.profileRef.update({ 
            vibreur : true
        });
    } 
  }



}
