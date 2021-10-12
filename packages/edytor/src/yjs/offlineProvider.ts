import { IndexeddbPersistence } from "y-indexeddb";

export const createOfflineProvider = (doc, documentId) => {
  return new Promise((res) => {
    const localPersistance = new IndexeddbPersistence(`edytor-${documentId}`, doc);
    localPersistance.whenSynced.then(() => {
      res(true);
    });
  });
};
