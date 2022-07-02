import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {
  language: string = this.translateService.currentLang;
  texting : any = {};
  categoryCollection: AngularFirestoreCollection<any>;
  category: Observable<any[]>;
  principal: any = [];
  lang : string ;

  constructor(
    private translateService: TranslateService,
    private db : AngularFirestore,
    private afAuth : AngularFireAuth,
  private toastController : ToastController,
    private readonly afs: AngularFirestore,
    private storage: AngularFireStorage,
  ) {
    
   }

  ngOnInit() {
    let foo = this.translateService.get('tab1').subscribe((data:any)=> {
      console.log(data);
      this.texting = data;
      console.log(this.texting)
     });
    //this.getCodes();
    const lan : string = this.translateService.currentLang;
    console.log(lan)
    this.getCodes(lan);
  }

  getCodes(lan){

    if(lan=='en'){
      this.categoryCollection = this.afs.collection<any>('blog', ref => ref
      .where('lang', '==', lan)
      .where('visible', '==', true)
      .orderBy('titre','asc')
      );
    this.category = this.categoryCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        console.log(data)
        return { id, ...data };
  
      }))
    );   
    console.log(this.category)
    this.category.subscribe(data => {
  
      this.principal = data;
      console.log(this.principal)
      
  
    });
    }
    else{
      const frr ="fr";
      this.categoryCollection = this.afs.collection<any>('blog', ref => ref
      .where('lang', '==', frr)
      .where('visible', '==', true)
      .orderBy('titre','asc')
      );
    this.category = this.categoryCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        console.log(data)
        return { id, ...data };
  
      }))
    );   
    console.log(this.category)
    this.category.subscribe(data => {
  
      this.principal = data;
      console.log(this.principal)
      
  
    });
      
    }

 
 
 
 
   }
 

}
