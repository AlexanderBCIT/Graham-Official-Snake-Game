import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBj8sfJ9PTd-uNCCn8N6-waG_lTRKCmAYg',
  authDomain: 'graham-snake-game.firebaseapp.com',
  projectId: 'graham-snake-game',
  storageBucket: 'graham-snake-game.firebasestorage.app',
  messagingSenderId: '808839699969',
  appId: '1:808839699969:web:03f8d2146894d4d419ea00',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
};