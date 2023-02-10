import { Firestore } from '@angular/fire/firestore';
import { EntityStore } from '@datorama/akita';
import {
  query,
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

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

export async function setFirestoreDoc(
  db: Firestore,
  docPath: string,
  object: any
): Promise<void> {
  const document = doc(db, docPath);
  await setDoc(document, object).catch((err) =>
    console.log('Error on setting firestore doc: ', err)
  );
}

export async function updateFirestoreDoc(
  db: Firestore,
  docPath: string,
  updatedValues: any
): Promise<void> {
  const document = doc(db, docPath);
  await updateDoc(document, updatedValues).catch((err) =>
    console.log('Error on updating firestore doc: ', err)
  );
}

export async function deleteFirestoreDoc(
  db: Firestore,
  docPath: string
): Promise<void> {
  const document = doc(db, docPath);
  await deleteDoc(document).catch((err) =>
    console.log('Error on updating firestore doc: ', err)
  );
}
