import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  getDoc,
  doc,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  prizeInfo: any;
  prizeDetails: any;
  dataset: string[][] = [];
  id: any;
  arraylength: any;
  numbers: any;
  str: any;
  lottery: any;
  matchedItem: any;

  constructor(public firestore: Firestore) {}

  async search(inputNumber: any, formattedDate: any) {
    this.lottery = await this.getDocByDate(formattedDate);
    if (this.lottery) {
      await this.getLotteryDetails(this.lottery.lottery_serial_number);
      await this.getLotteryInfo(this.lottery.lottery_serial_number);
      this.dataset = this.cleanDataset(this.dataset);
    } else {
      return 'No';
    }
    this.matchedItem = this.findMatch(inputNumber);
    return this.matchedItem;
  }

  findMatch(inputNumber: string): number | undefined {
    for (let i = 0; i < this.dataset.length; i++) {
      const item = this.dataset[i];
      const matchedElement = item.find((element) => element === inputNumber);
      if (matchedElement) {
        return this.prizeInfo.prize_details[i];
      }
    }
    return undefined;
  }

  async getLotteryDetails(id: string) {
    const docRef = doc(collection(this.firestore, 'PrizeDetails'), id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.prizeDetails = docSnap.data(); // Use the data
      this.arraylength = this.prizeDetails.prize_details.length;
      this.numbers = this.createRange(this.arraylength);
      this.dataset = this.prizeDetails.prize_details.map((item: string) => {
        if (/[a-zA-Z]/.test(item)) {
          let stringArray = item
            .split('   ')
            .map((subItem: string) => subItem.trim());
          return stringArray
            .map((i: string) => {
              if (/\r\n/.test(i)) {
                return i.split('\r\n').map((subItem: string) => subItem.trim());
              } else {
                // If no "\r\n", return the original trimmed item
                return i;
              }
            })
            .flat();
        } else {
          return item.split('  ').map((subItem) => subItem.trim());
        }
      });
    } else {
      console.log('No such document!');
    }
  }

  async getLotteryInfo(id: string) {
    const docRef = doc(collection(this.firestore, 'PrizeInfos'), id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.prizeInfo = docSnap.data();
    } else {
      console.log('No such document!');
    }
  }

  createRange(limit: number): number[] {
    return Array.from({ length: limit }, (_, index) => index);
  }

  async getDocByDate(date: string) {
    const lotteryCollection = collection(this.firestore, 'Lotteries');
    const q = query(lotteryCollection, where('draw_date', '==', date));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {});

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      } else {
        console.log('No matching documents found.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      return null;
    }
  }

  cleanDataset = (dataset: string[][]): string[][] => {
    return dataset.map((item) =>
      item.map((element) => {
        const cleanedElement = element.replace(/\s+/g, '');
        return cleanedElement.length > 8
          ? cleanedElement.slice(0, 8)
          : cleanedElement.padEnd(8, '');
      })
    );
  };
}
