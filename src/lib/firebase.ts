'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

console.log('🔧 Firebase 初期化開始');
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ 設定済み' : '✗ 未設定');
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

console.log('Firebase Config:', firebaseConfig);

// Firebase アプリが既に初期化されているかを確認
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
console.log('✓ Firebase アプリ初期化完了');

export const db = getFirestore(app);
console.log('✓ Firestore DB 初期化完了');
