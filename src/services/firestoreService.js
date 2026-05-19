import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../firebase/config.js';

const canUseFirestore = () => hasFirebaseConfig && db;

export async function listDocuments(collectionName, sortField = 'createdAt') {
  if (!canUseFirestore()) return [];
  let snapshot;
  try {
    const q = query(collection(db, collectionName), orderBy(sortField, 'desc'));
    snapshot = await getDocs(q);
  } catch {
    snapshot = await getDocs(collection(db, collectionName));
  }
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getDocument(collectionName, id) {
  if (!canUseFirestore()) return null;
  const snapshot = await getDoc(doc(db, collectionName, id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function findUserByEmail(email) {
  if (!canUseFirestore() || !email) return null;
  const q = query(collection(db, 'users'), where('email', '==', email));
  const snapshot = await getDocs(q);
  const first = snapshot.docs[0];
  return first ? { id: first.id, ...first.data() } : null;
}

export async function createDocument(collectionName, data) {
  if (!canUseFirestore()) return { id: data.id };
  const payload = { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  if (data.id) {
    await setDoc(doc(db, collectionName, data.id), payload, { merge: true });
    return { id: data.id };
  }
  return addDoc(collection(db, collectionName), payload);
}

export async function updateDocument(collectionName, id, data) {
  if (!canUseFirestore()) return;
  await updateDoc(doc(db, collectionName, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(collectionName, id) {
  if (!canUseFirestore()) return;
  await deleteDoc(doc(db, collectionName, id));
}
