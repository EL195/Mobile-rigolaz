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
  selector: 'app-works',
  templateUrl: './works.page.html',
  styleUrls: ['./works.page.scss'],
})
export class WorksPage implements OnInit {
  language: string = this.translateService.currentLang;
  texting : any = {};
  geniusCollection: AngularFirestoreCollection<any>;
  categoryCollection: AngularFirestoreCollection<any>;
  principal: any = [];
  commentData: any = [];
  category: any = [];
  category1: any = [];
  eventi : boolean = false;

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
     this.getVille();
  }
  getVille() {
   // console.log(category)
    this.categoryCollection = this.afs.collection<any>('villes', ref => ref
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

      this.principal = data;
      console.log(this.principal)
      //console.log(this.principal[0].idDetailArticle)
      


    });

   
  }

  onChange($event){
    this.eventi = true ;
    console.log($event.target.value);
    this.getWorks($event.target.value);
  }
  getWorks(value: any) {
    this.geniusCollection = this.afs.collection<any>('works', ref => ref
      .where('ville', '==', value)
      .where('visible', '==', true));
    this.category1 = this.geniusCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
      //  this.idDesc = id;
        console.log(data)
        return { id, ...data };

      }))
    ); this.category1.subscribe(data => {

      this.commentData = data;
      console.log(this.commentData)
      //console.log(this.principal[0].idDetailArticle)
      


    });
  }

}
