import { Firestore } from '@angular/fire/firestore';
import { EntityStore } from '@datorama/akita';
import { query, collection, onSnapshot } from 'firebase/firestore';

export interface Vector {
  x: number;
  y: number;
}

export interface KeyPressed {
  up: boolean;
  down: boolean;
  right: boolean;
  left: boolean;
  cross: boolean;
  square: boolean;
  circle: boolean;
  triangle: boolean;
}

export function syncCollection<T>(
  db: Firestore,
  collectionName: string,
  store: EntityStore<any, any>
) {
  const q = query(collection(db, collectionName));
  //const unsubscribe =
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const updatedDoc = change.doc.data();
      if (change.type === 'added') {
        store.add(updatedDoc);
      }
    });
  });
}
