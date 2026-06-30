import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  setDoc,
  query,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Score } from '../models/score.model';

const COLLECTION_NAME = 'scores';
const TOP_N = 10;

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly firestore = inject(Firestore);

  /** Live top-N scores, ordered highest first. */
  getTopScores(): Observable<Score[]> {
    const scoresRef = collection(this.firestore, COLLECTION_NAME);
    const topScoresQuery = query(
      scoresRef,
      orderBy('score', 'desc'),
      limit(TOP_N)
    );
    return collectionData(topScoresQuery) as Observable<Score[]>;
  }

  /** Submits a score, only overwriting the player's record if it's a new high. */
  async submitScore(name: string, score: number): Promise<void> {
    const id = name.trim().toLowerCase();
    if (!id) return;

    const scoreDocRef = doc(this.firestore, COLLECTION_NAME, id);
    const existingDoc = await getDoc(scoreDocRef);
    const existingScore = existingDoc.exists() ? existingDoc.data()['score'] : -1;

    if (score > existingScore) {
      const record: Score = { name: name.trim(), score, updatedAt: Date.now() };
      await setDoc(scoreDocRef, record);
    }
  }
}