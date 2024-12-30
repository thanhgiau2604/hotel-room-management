import { setDoc, type DocumentReference } from "firebase/firestore";

export interface FirebaseActionError {
  error?: string;
}

export const setDocument = async <T extends object>(
  ref: DocumentReference,
  data: Partial<T>,
  isMerged = true
): Promise<FirebaseActionError> => {
  let error = undefined;
  try {
    await setDoc(ref, data, { merge: isMerged });
  } catch (err) {
    error = (err as Error).message;
  }

  return { error };
};
