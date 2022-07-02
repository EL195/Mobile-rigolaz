import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  language: string = this.translateService.currentLang;
  compteurCollection: AngularFirestoreCollection<any>;
  userA : any;
  userRef: AngularFirestoreCollection<any>;
  docRef: AngularFirestoreDocument<any>;
  items : Observable<any[]>;
  texting: any;

  constructor(
    private afAuth : AngularFireAuth,
    //private db : AngularFireDatabase,
    private router : Router,
    private db: AngularFirestore,
    private translateService: TranslateService,
    private readonly afs: AngularFirestore,
    private toastController : ToastController,
    ) {
    /* Subscribe to Authentication State */
    this.afAuth.authState.pipe(first()).toPromise().then((user) => {
      if (user) {
        console.log(user)
        this.setCurrentUser()
      }
    });
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
   }


   setCurrentUser(){
    this.afAuth.authState.subscribe(user => {
      console.log(user)
      if (user){
        this.userA = user;
        console.log(this.userA)
      }
    });
   }



   


  /* User Authentication Function */
  async login(email : string, password : string){
    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      //console.log(res);
      return res;
    }
    catch(err){
      //console.dir(err);
      return err;
    } 
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first()).toPromise();
   // firebase.auth().onAuthStateChanged((user) =>{
   // return this.afAuth.auth.currentUser;
    /*  var promise = new Promise((resolve, reject) => {
        resolve(this.afAuth.auth.currentUser)
        
      });
      return promise;*/
 }

  /* Get currently Signed In User */
  currentUser(user) {
    this.userA = user;
    console.log(this.userA);
    let userId = this.userA.uid;
    console.log('User role : '+ this.userA.displayName);
    let role = this.userA.displayName;
    this.userRef = this.db.collection(role, ref => ref.
    where('id', '==', userId) );
    return this.userRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const key = a.payload.doc['id'];
        return { key, ...data };
      }))
    );

    /*this.userRef = this.db.collection('parent', ref => ref.where('id', '==', userId) );
    return this.userRef.valueChanges();*/
  }




  /* Register New User */
  async signUp(email : string, password : string){
    try {
    const res = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    return res;
    }
    catch(err){
      //console.dir(err);
      return err;
    } 
  }

  /* Register New User into Database */
  registerUser(user : any, role : string){
    //this.userRef = this.db.list(role);
	  let visible = role == 'client' ? false : true;
    this.userRef = this.db.collection(role);
    this.userRef.add({
      id : user.id,
      email : user.email,
      fName : '',
      lName : '',
      address : '',
      telephone : '',
      photoURL : '',
      compteur: '',
      pseudo : user.pseudo,
      sexe :user.sex,
      naissance : user.born,
      premium : false,
      son : false,
      vibreur : false,
      langue : "en",
      role,
      //dateCreated : firebase.firestore.Timestamp.fromDate(new Date()),
      createdByID : '',
      createdByName : '',
      visible : visible,
      comptePrincipal :0,
      compteBonus :0
    });
    this.checkcompteur(user.cpt).subscribe((datass) => {
      //console.log(data)
      if (datass.length == 0) {
        ///console.log(data)
        this.presentToast(this.texting.errorM);
      }
    else{

      this.checkcompteurExist(user.cpt).subscribe((datas) => {
       // console.log(data)
        if (datas.length != 0) {
         // console.log(data)
          this.presentToast(this.texting.deja);
        }
      else{
        this.db.collection("compteursLiaison").add({
          id: 'cpt' + Math.random().toString(36).substr(2, 9),
          autor: "",
          cpt : user.cpt,
          Programme: "",
          Puissance : "",
          user : user.id,
          dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
          visible: true             
        });
        this.presentToast(this.texting.dejaAcc);
        //this.vue=true; 
      }
    })
    }
  })
  }

   /* Function Shows Notifications */
 async presentToast(message : string){
  const toast = await this.toastController.create({
    message: message,
    duration: 6000
  });
  toast.present();
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

  checkcompteur(compteur) {
    console.log(compteur)
    //sconsole.log(this.user.key)
    this.compteurCollection = this.afs.collection<any>('compteurs', ref => ref
      .where('cpt', '==', compteur));
    return this.compteurCollection.valueChanges().pipe(first());
  }

  

  async updatePassword(oldCredentials, newPassword){
    const user = await this.afAuth.auth.currentUser;
    console.log("Current User is : ");
    console.log(user);

    const credential = firebase.auth.EmailAuthProvider.credential(
      oldCredentials.email, 
      oldCredentials.password
  );

    user.reauthenticateWithCredential(credential).then(function() {
      // User re-authenticated.
      console.log("User Reauthenticated");
        user.updatePassword(newPassword).then(function() {
          // Update successful.
          console.log("Password Modified Successfully");
        }).catch(function(error) {
          // An error happened.
          console.log("Password Not Modified");
        });
    }).catch(function(error) {
      // An error happened.
      console.log("User Not Reauthenticated");
    });

  }

  passwordResetEmail(emailAddress){
    this.afAuth.auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
      console.log("Email Sent");
    }).catch(function(error) {
      // An error happened.
      console.log("Email not Sent");
      console.log(error);
    });
  }

  async sendVerificationEmail(){
    const user = await this.afAuth.auth.currentUser;
    console.log("Current User is : ");
    console.log(user);
    user.sendEmailVerification();
  }

}
