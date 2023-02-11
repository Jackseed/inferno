import { addDoc, Firestore } from '@angular/fire/firestore';
import { EntityStore } from '@datorama/akita';
import {
  query,
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  Unsubscribe,
  DocumentReference,
} from 'firebase/firestore';

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
): Unsubscribe {
  const q = query(collection(db, collectionName));
  //const unsubscribe =
  return onSnapshot(q, (snapshot) => {
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

export async function addFirestoreDoc(
  db: Firestore,
  collectionPath: string,
  object: any
): Promise<DocumentReference> {
  const collectionRef = collection(db, collectionPath);
  const docRef = await addDoc(collectionRef, object).catch((err) =>
    console.log('Error on adding firestore doc: ', err)
  );
  return docRef as DocumentReference;
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
