import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UtilityFunctionsService {

  constructor() {}

  static API_KEY_FOR_BROWSER_RELEASE = 'AIzaSyC4c9IP1Tr0NyNr07YE-hCIKgWqCcJxdpA';
  static API_KEY_FOR_BROWSER_DEBUG = 'AIzaSyC4c9IP1Tr0NyNr07YE-hCIKgWqCcJxdpA';

	static STRIPE_FIREBASE_FUNCTION_URL = 'https://us-central1-geniusproject-84a33.cloudfunctions.net/stripePayment';

  generateUid () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  dateNow() {
    let today = new Date();
    let date = today.getFullYear()+'-'+((today.getMonth()+1)).toString().padStart(2,'0')+'-'+today.getDate().toString().padStart(2,'0');
    let time = today.getHours().toString().padStart(2,'0') + ":" + today.getMinutes().toString().padStart(2,'0') + ":" + today.getSeconds().toString().padStart(2,'0');
    let dateTime = date+' '+time;
    //returns datetime string
    return dateTime;
  }

  timeWithLeadingZeros(dt) 
  { 
    return (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
  }
  
	static getRandomArbitrary(min, max) {
	  return Math.floor(Math.random() * (max - min) + min);
	}
	
	linkify(text) {
		let urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		return text.replace(urlRegex, function(url) {
			return '<a href="' + url + '">' + url + '</a>';
		});
	}
}