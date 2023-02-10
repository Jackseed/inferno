import { Firestore } from '@angular/fire/firestore';
import { EntityStore } from '@datorama/akita';
import { query, collection, onSnapshot } from 'firebase/firestore';

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
      if (change.type === 'modified') {
        store.update(updatedDoc['id'], updatedDoc);
      }
      if (change.type === 'removed') {
        store.remove(updatedDoc['id']);
      }
    });
  });
}
