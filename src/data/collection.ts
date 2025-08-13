import {
  CollectionReference,
  DocumentData,
  collection,
  getDocs
} from 'firebase/firestore';
import FirestoreDb from './FirestoreDb';
import FirestoreDocument from './FirestoreDocument';

export default class FirestoreCollection<T extends DocumentData = DocumentData> {
  private readonly collectionRef: CollectionReference<T>;

  constructor(private readonly collectionName: string) {
    const firestore = FirestoreDb.getInstance();
    this.collectionRef = collection(firestore, collectionName) as CollectionReference<T>;
  }

  public getCollectionRef(): CollectionReference<T> {
    return this.collectionRef;
  }

  public doc(docId: string): FirestoreDocument<T> {
    return new FirestoreDocument<T>(this.collectionName, docId);
  }

  /** Returns an array of FirestoreDocument instances */
  public async getDocs(): Promise<FirestoreDocument<T>[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(docSnapshot => new FirestoreDocument<T>(this.collectionName, docSnapshot.id));
  }
}
