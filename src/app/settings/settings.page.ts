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
//import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  language: string = this.translateService.currentLang;
  texting : any = {};
  user : any = {};
  editUser : any = {};
  edit : boolean = false;
  profileRef: AngularFirestoreDocument<any>;
  profile: Observable<any[]>;
  imgPic : Observable<any>;
  lg: string = "";
  ch : boolean = false;
  len: string;
  connect: boolean = false;



  constructor(
    public auth : AuthService,
    private translateService: TranslateService,
    private router : Router,
    private loadingController : LoadingController,
    private db : AngularFirestore,
    private camera: Camera,
    private afAuth : AngularFireAuth,
    public plt: Platform,
    private storage: AngularFireStorage,
    private alertController : AlertController,
    //private storageService: Storage
  ) { }

  ngOnInit() {
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
    this.userProfile();
  }



  languageChange() {  
    console.log(this.language)
    localStorage.setItem('langue' ,this.language);
    this.translateService.use(this.language);  
    this.ch=true;
    if(this.language=="fr"){
      this.len = "Français";
      console.log(this.len)
    }
    else{
      this.len = "Anglais";
      console.log(this.len)
    }
    this.editProfile(this.language);
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
          this.connect=true;
          console.log(info[0]["langue"])
          const llll = info[0]["langue"];
          if(llll=="en"){
            console.log(llll)
            this.lg = this.texting.eng;
            console.log(this.lg)
          }
          else{
            this.lg = this.texting.fre;
          }
          
        });
      }
      else{
      //  this.send = false ;
      }
    });
     
  }

  editProfile(lang){
    if (this.connect==true){
      console.log(lang);
      const refe ="client"
      this.profileRef = this.db.doc(`${refe}/${this.user.key}`);
      this.profileRef.update({ 
            langue : lang
        });
    }
    }



}
