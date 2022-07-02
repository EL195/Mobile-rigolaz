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
  selector: 'app-compte',
  templateUrl: './compte.page.html',
  styleUrls: ['./compte.page.scss'],
})
export class ComptePage implements OnInit {
  language: string = this.translateService.currentLang;
  texting : any = {};
  user : any = {};
  editUser : any = {};
  edit : boolean = false;
  profileRef: AngularFirestoreDocument<any>;
  profile: Observable<any[]>;
  imgPic : Observable<any>;

	activate_credit_button = false;

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
    private alertController : AlertController
  
    ) {
		if(this.plt.is('ios')){
			this.activate_credit_button = false;
		} else {
			this.activate_credit_button = true;
		}
	}

  ngOnInit() {

    this.userProfile();
    
  }

  takePic(){
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType : this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      //console.log(imageData);
      let Pic = 'data:image/jpeg;base64,' + imageData;
      const filePath = `profile_photos/${this.user.id}.jpeg`;
      //alert(filePath);
      const ref = this.storage.ref(filePath);
      const task = ref.putString(Pic, 'data_url');
      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          //this.imgPic = (url); // <-- do what ever you want with the url..
          this.updateProfilePhoto(url);
          });
        })
      ).subscribe();

     }, (err) => {
      // Handle error this.imgPic = ref.getDownloadURL()
      console.log(err);
     });

  }

  updateProfilePhoto(url){
    this.profileRef = this.db.doc(`${this.user.role}/${this.user.key}`);
    this.profileRef.update({
      photoURL : url
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
            this.translateService.use(info[0]["langue"]);  
           // this.log = true ;
            console.log(this.user.email)
           // this.connect=true;
          });
        }
        else{
         // this.log = false ;
        }
      });
       
    }

  editProfile(profile){
    console.log(profile.value);
    this.profileRef = this.db.doc(`${this.user.role}/${this.user.key}`);
    this.profileRef.update({ 
      email : this.user.email,
      fName : this.user.fName,
      lName : this.user.lName,
      pays : this.user.pays,
      region : this.user.region,
      ville : this.user.ville,
      address : this.user.address,
      telephone : this.user.tel,
      });
    this.edit = false;
    }

    editPassword(newPassword){
      this.editPasswordPrompt()
      //this.auth.updatePassword()
    }

    async editPasswordPrompt() {
      const alert = await this.alertController.create({
        header: 'Changer Mot De Passe!',
        inputs: [
          {
            name: 'email',
            type: 'email',
            placeholder : 'Mail'
          },
          {
            name: 'oldPassword',
            type: 'password',
            placeholder : 'Ancien Mot De Passe'
          },
          {
            name: 'newPassword',
            type: 'password',
            placeholder : 'Nouveau Mot De Passe'
          }
        ],
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              console.log('Confirm Ok');
              if(data.oldPassword.trim() != ''){
                console.log('New Password : ' + data.newPassword);
                let credentials = { "email" : data.email, "password" : data.oldPassword }
                this.auth.updatePassword(credentials, data.newPassword)
              }
              
            }
          }
        ]
      });
  
      await alert.present();
    }


    delete(){
      if(confirm("Voulez-vous vraiment supprimer votre compte Challenge international?")) {
     //   this.afAuth.authState.first().subscribe((authState) => { authState.delete(); });
  // this.afAuth.authState.first().subscribe((authState) => { authState.delete(); }); 
 /*   this.afAuth.auth
        .first()
        .subscribe(authState => {
          console.log(authState);
          authState.auth.delete()
            .then(_ => alert("Compte supprime"))
            .catch(e => console.error(e))
        });
       
        */
      }

    }
    logOut(){
      this.afAuth.auth.signOut();
      this.router.navigateByUrl( '/login' );
    }

  }

