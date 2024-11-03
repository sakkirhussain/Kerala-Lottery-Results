import { Injectable, OnInit } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  CollectionReference,
  DocumentReference,
  getDoc,
  doc,
} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(public firestore: Firestore) {}

  async fetchData() {
    const lotteryCollection: CollectionReference = collection(
      this.firestore,
      'Lotteries'
    );
    try {
      const querySnapshot = await getDocs(lotteryCollection);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error: any) {
      console.log(error.status);
      return error;
    }
  }

  async fetchDocumentById(documentId: string) {
    const docRef: DocumentReference = doc(
      this.firestore,
      'Lotteries',
      documentId
    );

    try {
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = { id: docSnapshot.id, ...docSnapshot.data() };
        return data;
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching document: ', error);
      throw new Error('Failed to fetch document');
    }
  }

  async fetchBlog() {
    const blogCollection: CollectionReference = collection(
      this.firestore,
      'Blogs'
    );
    try {
      const querySnapshot = await getDocs(blogCollection);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error: any) {
      console.log(error.status);
      return error;
    }
  }
}
