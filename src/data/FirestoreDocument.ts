import { DocumentReference, DocumentData, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import FirestoreDb from './FirestoreDb';

export default class FirestoreDocument<T extends DocumentData = DocumentData> {
  private readonly docRef: DocumentReference<T>;

  constructor(private readonly collectionName: string, private readonly docId: string) {
    const firestore = FirestoreDb.getInstance();
    this.docRef = doc(firestore, collectionName, docId) as DocumentReference<T>;
  }

  /** Returns just the document data */
  public async get(): Promise<T | null> {
    const snapshot = await getDoc(this.docRef);
    return snapshot.exists() ? (snapshot.data() as T) : null;
  }

  /** Returns the document ID */
  public getId(): string {
    return this.docId;
  }

  public async set(data: T, merge: boolean = false): Promise<void> {
    await setDoc(this.docRef, data, { merge });
  }

  public async delete(): Promise<void> {
    await deleteDoc(this.docRef);
  }

  public getRef(): DocumentReference<T> {
    return this.docRef;
  }
}
