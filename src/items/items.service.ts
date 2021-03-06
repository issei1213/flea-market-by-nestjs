import { Injectable, NotFoundException } from "@nestjs/common";
import { Item } from "./item.model";
import { ItemStatus } from "./item-status.enum";
import { CreateItemDto } from "./dto/create-item.dto";
import { v4 as uuid } from 'uuid'
import admin from 'firebase-admin';

// @ts-ignore
admin.initializeApp({
  credential: admin.credential.cert({
    'project_id': "flea-market-fb770",
    "private_key_id": "f58d0f3ceb8e643f8da9df79a62392cddb4642e6",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4QPTFl+1LDToU\njUuM0iLMnKwUcRoYz2a+Iw/aP4sgyfxLnSICgGToHt3CUhheU1EoCM7qOZdifv15\nQ351alKG82kFbomD23D1J30ck0+z/Wa5UWv7RdGQm5Y6p7ZHiYiokdjjlTkD7hIo\n8AR/H45OukUfZDPOfxkulzxDsMP1A9H2da5JKbBmFnA6eIjLdIJcaiQZ+ZsP1SqX\nQU0CfCoj/9YCtSC9m0nUwOIcwagCrzfM00Ps0pN/LdfGk9Pq5gJ5uAcg8pbSMEUG\nB4YxlkWJ34vYATVD5ZF8VzFsnpqYVLFWZ2dc+XN/CQor0a+wDfcQFUAEVS/lc99q\n4+kRPvOLAgMBAAECggEACf8e3e2SkUTZcYNXpans+2mbUyHucYl8dd+/HMSKeYVG\nlppNiGc2PPsXuv2V7DWHAgNgU92QtLurvZLc3zqdLvcxK9CbI2KaK/gwKzG5hva+\nRlsANHTNnD6PawVDDXnicTWLLTshCcaL3llkqmT9j+XpRCe9QScs0utKThM0E9dB\nSZd+be+YFppfZ1qBqBHqeQRR3LerWPHuFhu5o6phHA4D9W4zWSvNmBMivktWHcIl\nwo2rzE09ApoZW6oWNyH0E1hQGV9jtx/jK5dBc/GsMKdoK8IxeWQBci3ii3z7Xbdm\n6qIQzO1L9IWcBdfJwMYaqa/zT/9Dy99IAGmotKDYEQKBgQDkpP5idT3aSYGTHoN6\nmAuCettgca54CVDUAYTE5/CEfH0R6ONwjGpWEb+VEIfC985VbtMylZ4ue0sS5I2+\nZEjF3op8kVoqKq/XKlidDVttkU5yd3WwCub71fpmpXp11v4E4AcopU6CznkL/rVi\nV1ueHZwy2Q8c5GebsNpGRMumiQKBgQDOTFiNOAU50Hh/AP0SDBUI+0zARVSQWIbC\nh+DiexGy93ehIDcmJUz56hJB7dyCEBE6ut7NsE+u651duicp6M6WlPVHbwRqK1uw\nZcrRlXko+As4TN0HctJ2MpD2W5AH25xGIIgsKqQiBW5g8tR6O4xA0aVOWtKazlT3\npamnh6EEcwKBgDxdz4gBOlZip+JG4SHB+O/3Lep1uUGZ/AwtZndyYU8pawAKg9oY\nSI722qUpmx5/vKtTulEVrZDKHpUbYM0OvyP20It4+Nw/LvPZC1JTz3rLLXINVjYn\nerqs0RK+x+lK3QA+gcVad7MTfmQLWKphNCA34yCNrG7NYwl5FPgOe9I5AoGAHqgT\nxLCdfjDvpxfzg5oOCi6mAjCLV4QASqo8jgtx3uGNgoEyENYcMUtKeUeqrB1NIigg\n8foQbVMQKJyAM2coRBJQvNPPmSNmVblawXhv79mkeTJa6j9y7SOojSOgLLrC51zw\nP3f6uh+Kfpe3YY610fAVm6Y9g8nDsKWKp52tHOcCgYAMQqUBd7cENKeu1KHW2CDR\n9+7/jwSkOGr+fMv1uyH/CUdUtLE+bYP3i4nJW4A7HXOR90rOMReoGhsv7LXqxy/4\nsdOH8jk7OEYWBPNbgQ9oy5TCuAPQc2X+loReOz+9ifl9LrHv9ivrGHpWscWsNsem\nVEFxS8masKwh8DFUdaw9rQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-n91xw@flea-market-fb770.iam.gserviceaccount.com",
    "client_id": "112530037641620706969",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n91xw%40flea-market-fb770.iam.gserviceaccount.com"
  } as admin.ServiceAccount),
});
const firestore = admin.firestore();
const collectionRef = firestore.collection('items');

interface SnapshotOptions {
  readonly serverTimestamps?: "estimate" | "previous" | "none";
}
interface DocumentData {
  [key: string]: any;
}
interface QueryDocumentSnapshot {
  data(option?: SnapshotOptions): DocumentData;
}
type Converter<T> = {
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    op?: SnapshotOptions
  ): T;
  toFirestore(model: Partial<T>): DocumentData;
};

const converter: Converter<Item> = {
  fromFirestore(ss, op) {
    return ss.data(op) as Item;
  },
  toFirestore(model) {
    return model;
  },
};

@Injectable()
export class ItemsService {
  private items: Item[] = []
  findAll(): Item[] {
    return this.items
  }

  findById(id: string): Item {
    const found = this.items.find(item => item.id === id)
    if(!found) {
      throw new NotFoundException()
    }
    return found
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const docRef = await collectionRef.withConverter(converter).add({
      // id: uuid(),
      status: ItemStatus.ON_SALE,
      ...createItemDto
    })
    const snapshot = await docRef.get()
    const data = snapshot.data()
    return data
  }

  updateStatus(id: string): Item {
    const item = this.findById(id)
    item.status = ItemStatus.SOLD_OUT
    return item
  }

  delete(id: string): void {
    this.items = this.items.filter(item => item.id !== id)
  }
}
