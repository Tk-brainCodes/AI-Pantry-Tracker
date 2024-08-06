"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  expiry: string;
  category: string;
  imageUrl?: string;
}

interface PantryContextProps {
  items: PantryItem[];
  addItem: (
    name: string,
    quantity: string,
    expiry: string,
    category: string,
    image?: string | null
  ) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  editItem: (
    id: string,
    name: string,
    quantity: string,
    expiry: string,
    category: string
  ) => Promise<void>;
}
const PantryContext = createContext<PantryContextProps | undefined>(undefined);

export const usePantry = () => {
  const context = useContext(PantryContext);
  if (!context) {
    throw new Error("usePantry must be used within a PantryProvider");
  }
  return context;
};

export const PantryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<PantryItem[]>([]);

  const fetchItems = async () => {
    const itemsCollection = await getDocs(collection(db, "pantry"));
    const fetchedItems: PantryItem[] = itemsCollection.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as PantryItem[];
    setItems(fetchedItems);
  };

  const addItem = async (
    name: string,
    quantity: string,
    expiry: string,
    category: string,
    image?: string | null
  ) => {
    const newItem = {
      name,
      quantity,
      expiry,
      category,
      imageUrl: "",
    };

    if (image) {
      const base64Image = image.split(",")[1];
      const blob = base64ToBlob(base64Image, "image/png");
      const storageRef = ref(storage, `images/photo-${Date.now()}.png`);

      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      newItem.imageUrl = url;
    }

    await addDoc(collection(db, "pantry"), newItem);
    fetchItems();
  };

  const base64ToBlob = (base64: string, type: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  };

  const editItem = async (
    id: string,
    name: string,
    quantity: string,
    expiry: string,
    category: string
  ) => {
    await updateDoc(doc(db, "pantry", id), {
      name,
      quantity,
      expiry,
      category,
    });
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    try {
      const itemDoc = doc(db, "pantry", id);
      await deleteDoc(itemDoc);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <PantryContext.Provider value={{ items, addItem, deleteItem, editItem }}>
      {children}
    </PantryContext.Provider>
  );
};
