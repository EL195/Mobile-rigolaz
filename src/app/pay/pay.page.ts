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
import { PayementService } from '../services/payement.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
  backButtonSubscription: any;
  user : any = {};
  editUser : any = {};
  edit : boolean = false;
  cool : boolean = false;
  profileRef: AngularFirestoreDocument<any>;
  profile: Observable<any[]>;
  connect: boolean = false;
  compteurCollection: AngularFirestoreCollection<any>;
  compteurCollection1: AngularFirestoreCollection<any>;
  comteurelt2: any;
  comteurelt: any;
  event: any = "mine";
  language: string = this.translateService.currentLang;
  texting : any = {};
  owner: any;
  paiement_type : any;
  numero : any;
  tiers : string = "";
  cpt : any = "014"
 // defaultt : string = "014";
  principal: any = [];
  commentData: any = [];
  category: any = [];
  eventi: boolean;
  default : any = "014_";
  type: any;
  compteurOk: string;
  price: any;


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
    private con: PayementService,
    private alertController : AlertController,
    private http: HttpClient
  ) {
    
  }

  ngOnInit() {
    this.userProfile();
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
  }


/* Pull up Profile if user is logged in*/
async userProfile(){
      //Loader
      const loading = await this.loadingController.create({
      });
      await loading.present();
    this.auth.isLoggedIn().then(data => {
      console.log("tsssss")
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
          this.connect = true ;
          const languages = info[0]["langue"];
          this.translateService.use(languages);  
          this.checkcompteurExistUser(this.user.key);
        });
        loading.dismiss();
      }
      else{
        //loading.dismiss();
        loading.dismiss();
        this.connect = false ;
        this.presentToast(this.texting.connectNone);
      }
    });
     
  }

    pay(){
      if(this.connect == false){
        this.payTraitement();
      }
      else{
        this.cool = true;
        this.goToPay();
      }
    }



    goToPay(){

    }


onChange($event){
  // this.eventi = true ;
   console.log($event.target.value);
   this.comteurelt = $event.target.value;
  // this.getWorks($event.target.value);
  this.compteurOk == $event.target.value;
 }


 async Validatepay() {
    const alert = await this.alertController.create({
      header: this.texting.pyt,
      message: this.texting.ptexte,
      inputs: [
        {
          name: 'orange',
          type: 'radio',
          label: 'Orange Money',
          handler: () => {
            console.log('OM selected');
            this.type = 2
          }
        },
        {
          name: 'mtn',
          type: 'radio',
          label: 'MTN Mobile Money',
          handler: () => {
            console.log('MTN selected');
            this.type = 1
          }
        },
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
            console.log(data.type);
            this.hitNimber();
            
          }
        }
      ]
    });
  
    await alert.present();
  }



  async hitNimber() {
    const alert = await this.alertController.create({
      header: this.texting.pyt,
      message: this.texting.hitnumber,
      inputs: [
        {
          name: 'number',
          type: 'number',
          value: this.user.tel || 6,
          cssClass: 'specialClass',
          min: 9, 
          max: 9,
          handler: (data) => {
            console.log(data);
            //this.numero = data.number
          }
        },
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
            //console.log(donnees);
            console.log(data);
            //this.router.navigateByUrl( '/login' );
            
          }
        }
      ]
    });
  
    await alert.present();
  }





  async payt(){
    if(this.tiers == ""){
      this.presentToast(this.texting.ptrerror);
    }
    else{
      if(this.tiers.length != 12){
        this.presentToast(this.texting.ptrerror3);
      }
      else{
        this.seachUser(this.tiers).subscribe((data) => {
          //console.log(data)
          if (data.length != 0) {
            //this.vue= true;
            console.log(data[0].cpt)
            console.log(data[0].pp)
            console.log(data[0])
            this.owner = data[0].pp;
            this.paydirectly(this.owner);
            
          }
          else{
            this.presentToast(this.texting.ptrerror2);
          }
        })
      }
   
    }
    //456653475269
 


  }
  async paydirectly(owner: any) {
    const alert = await this.alertController.create({
      header: this.texting.pyt,
      message: this.texting.tiers + owner,
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
  ters(ters: any) {
    throw new Error('Method not implemented.');
  }

  payNow(){
    if(this.paiement_type==undefined){
      this.presentToast(this.texting.errtyp);
    }
    else if(this.numero==undefined || this.numero.toString().length!=9){
      this.presentToast(this.texting.phoneerr);
    }
/*     else if(this.compteurOk==undefined || this.compteurOk.length != 12){
      this.presentToast(this.texting.ptrerror3);
      console.log(this.compteurOk);
    } */
    else{
      let info = {
            name : this.user.pseudo,
            montant : this.price,
            type : this.paiement_type,
            telephone : this.numero
      }
      console.log(info);
      if(this.price==null){
        this.presentToast(this.texting.priceError);
      }
      else{
        let data = {
          uri : "https://www.my-dohone.com/dohone/pay?cmd=start&rN="+info.name+"&rDvs=XAF&rMt="+info.montant+"&rMo="+info.type+"&rT="+info.telephone+"&rH=YE216F41649257123018200&rI=10401&source=Recharge+ENEO"
        }
        console.log("Ici1");
       this.con.getData("paynow", data).subscribe((da:any)=>{
          console.log("Ici");
          console.log(da.text);
        })
        if(this.paiement_type==2){
            this.checkPay();
        } 
      }
     //let uri = "pay?cmd=start&rN="+info.name+"&rDvs=XAF&rMt="+info.montant+"&rMo="+info.type+"&rT="+info.telephone+"&rH=YE216F41649257123018200&rI=1001&source=Recharge+ENEO"
      console.log("Ici2");
    }
    console.log("Ici3");
  }

  async checkPay(){
    const alert = await this.alertController.create({
      header: this.texting.AskCode,
      message: this.texting.AskCodeDesc,
      inputs: [
        {
          name: 'code',
          type: 'text',
        },
      ], 
      buttons: [
        {
          text: this.texting.valider,
          handler: (data) => {
            console.log('Confirm Ok');
            //this.router.navigate(['/login']);
            this.presentToast(this.texting.PayementOk);
            let datas = {
              uri : "https://www.my-dohone.com/dohone/pay?cmd=cfrmsms&rCS="+data.code+"&rT="+this.numero+""
            }
            this.con.getData("paynow", data).subscribe((da:any)=>{
              console.log("Ici");
              //alert(da.text);
              this.presentToast(da.text);
            })
          }
        }
      ]
    });
  
    await alert.present();

}


async payTraitement() {
  const alert = await this.alertController.create({
    header: 'Demande de connexion',
    message: 'Veuillez vous connecter avant de poursuivre.',
/*     inputs: [
      {
        name: 'Orange Money',
        type: 'radio',
        placeholder: 'Placeholder 1'
      },
      {
        name: 'MTN',
        type: 'radio',
        placeholder: 'Placeholder 1'
      }
    ], */
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Se connecter',
        handler: (data) => {
          console.log('Confirm Ok');
          this.router.navigate(['/login']);
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

checkcompteurExistUser(compteurt) {
  console.log(compteurt)
  //sconsole.log(this.user.key)
  this.compteurCollection = this.afs.collection<any>('compteursLiaison', ref => ref
    .where('autor', '==', compteurt));
 // return this.compteurCollection1.valueChanges().pipe(first());
  this.category = this.compteurCollection.snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as any;
      const id = a.payload.doc.id;
    //  this.idDesc = id;
      console.log(data)
      return { id, ...data };

    }))
    ); this.category.subscribe(data => {
      if(data.length>0){
       console.log(data.length)
        //this.eventi= true;
        this.principal = data;
      console.log(this.principal)
      //console.log(this.principal[0].idDetailArticle)
      }
      else{
       this.eventi= false;
      }

      
      


    });
}

seachUser(compteurt) {
  console.log(compteurt)
  //sconsole.log(this.user.key)
  this.compteurCollection1 = this.afs.collection<any>('compteursLiaison', ref => ref
    .where('cpt', '==', compteurt));
  return this.compteurCollection1.valueChanges().pipe(first());
}

segmentChanged(ev: any) {
  console.log(ev);
  if(ev.detail.value=="mine"){
    this.cool = false;
  }
  else{
    this.cool = true;
  }
  console.log(ev.detail.value);
  this.event=ev.detail.value;
}



}
