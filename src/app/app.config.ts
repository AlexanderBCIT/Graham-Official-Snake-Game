import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

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
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ],
};