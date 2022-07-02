import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { UtilityFunctionsService } from '../_services/utility-functions.service';
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})

export class ContactPage implements OnInit {
    user : any = {};
    success : boolean;
    complaintForm : FormGroup;
    messages : AngularFirestoreCollection<any>;
    send: boolean;
    language: string = this.translateService.currentLang;
    texting : any = {};
  
    constructor(
      private fb : FormBuilder,
      private translateService: TranslateService,
      private db : AngularFirestore,
      public auth : AuthService,
      public router : Router,
      private utilityF : UtilityFunctionsService,
      public toastController: ToastController
    ) { }
  
    ngOnInit() {
      /* Connected User Info */
      this.userProfile();
  
      this.complaintForm = this.fb.group({
        nomC : [
          '', 
          [
            Validators.required
          ]
        ],
        messageC : ['', [Validators.required] ]
      });
    
    }
  
    
    newComplaint(){
      if(this.send = true){
        this.messages = this.db.collection('contact');
        this.messages.add({
          "idMessage" : 'contact_'+ this.utilityF.generateUid(),
          "message" : this.complaintForm.value.messageC,
          "nomPrenom" : this.user.fName +' '+ this.user.lName,
          "dateCreated" : firebase.firestore.Timestamp.fromDate(new Date()),
          "objet" : this.complaintForm.value.nomC,
          "email" : 'micheltanga0@gmail.com',
          "createdByID" : this.user.id,
          "telephone": this.user.phone,
          "createdByName" : this.user.fName +' '+ this.user.lName,
          "visible" : true
        })
        .then(res => {
          console.log('Message Sent');
          this.presentToast(this.texting.sent);
          this.complaintForm.reset();
        })
        .catch(err => {
          console.log(err);
        });
    
    
      }
      else {
        this.router.navigate(['/login']);
      }
    
  
  
  
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
          });
        }
        else{
          this.send = false ;
        }
      });
       
    }
  
    async presentToast(message) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000
      });
      toast.present();
    }
  
  }
  
  