import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import * as firebase from 'firebase';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  language: string = this.translateService.currentLang;
  texting : any = {};
  eventi : boolean = false;
  geniusCollection: AngularFirestoreCollection<any>;
  categoryCollection: AngularFirestoreCollection<any>;
  principal: any = [];
  commentData: any = [];
  category: any = [];
  category1: any = [];

  constructor(
    private translateService: TranslateService,
    public router: Router,
    public auth: AuthService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private readonly afs: AngularFirestore,
    private db: AngularFirestore,
    public toastController: ToastController,

  ) { }

  ngOnInit() {
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
     });
     this.getHistoy();
  }
  async getHistoy() {
      //Loader
      const loading = await this.alertController.create({
      });
      await loading.present();
      // console.log(category)
      this.categoryCollection = this.afs.collection<any>('history', ref => ref
      //.where('ville', '==', category)
       .where('visible', '==', true));
     this.category = this.categoryCollection.snapshotChanges().pipe(
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
         this.eventi= true;
         this.principal = data;
       console.log(this.principal)
       //console.log(this.principal[0].idDetailArticle)
       }
       else{
        this.eventi= false;
       }
 
       
       
 
 
     });
     loading.dismiss();
  }

}
