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

export function addVectors(v1: Vector, v2: Vector) {
  const sum = {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
  return sum;
}

export function multiplyVectors(k: number, v: Vector) {
  const product = {
    x: k * v.x,
    y: k * v.y,
  };
  return product;
}

export function vectorOpposite(v: Vector) {
  const opposite = {
    x: -v.x,
    y: -v.y,
  };
  return opposite;
}

export function normalizeVector(v: Vector) {
  const length = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
  const normalisedVect = {
    x: v.x / length,
    y: v.y / length,
  };
  return normalisedVect;
}

export function vectorLength(v: Vector) {
  const length = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
  return length;
}

export function distanceToLine(
  point: Vector,
  line: { startPoint: Vector; endPoint: Vector }
) {
  const lineToVector = addVectors(
    line.startPoint,
    vectorOpposite(line.endPoint)
  );
  const lineDirection = normalizeVector(lineToVector);
  const lineLength = vectorLength(lineToVector);
  let distances: number[] = [];
  for (let i = 0; i <= lineLength / 5; i++) {
    const checkPoint = addVectors(
      line.startPoint,
      multiplyVectors(i, lineDirection)
    );
    const distanceFromPointToCheckPoint = vectorLength(
      addVectors(checkPoint, vectorOpposite(point))
    );
    distances.push(distanceFromPointToCheckPoint);
  }
  const shortestDistance = Math.min(...distances);

  return shortestDistance;
}

export function isColliding(
  point: Vector,
  line: {
    startPoint: Vector;
    endPoint: Vector;
  }
) {
  if (distanceToLine(point, line) <= 5) return true;
  else return false;
}



export function syncCollection<T>(
  db: Firestore,
  collectionName: string,
  store: EntityStore<any, any>
): Unsubscribe {
  const q = query(collection(db, collectionName));
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
