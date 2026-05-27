import { useState } from 'react';

export interface BirdListSession {
  name: string;
  id: string;
  fecha: string;
  hora: string;
  regionCode: string;
  regionName: string;
  birds: string[];
  synced: boolean;
  updatedAt: number;
}

const STORAGE_KEY = 'birdlists';

export const useBirdLists = () => {
  const [lists, setLists] = useState<BirdListSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const save = (updated: BirdListSession[]) => {
    setLists(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const createList = (name?: string, regionCode?: string) => {
    const now = new Date();

    const newList: BirdListSession = {
      id: (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : 'id-' + Date.now(),
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().split(' ')[0],
      regionCode: regionCode || '',
      regionName: '',
      birds: [],
      synced: false,
      updatedAt: Date.now(),
      name: name || ''
    };

    const updated = [...lists, newList];
    save(updated);

    return newList.id;
  };

  const updateList = (id: string, changes: Partial<BirdListSession>) => {
    const updated = lists.map(l =>
      l.id === id
        ? {
            ...l,
            ...changes,
            synced: false,
            updatedAt: Date.now()
          }
        : l
    );
    save(updated);
  };

  const toggleBird = (id: string, code: string) => {
    const updated = lists.map(l => {
      if (l.id !== id) return l;

      // normalize birds to array (old data may have object map)
      const birdsArr: string[] = Array.isArray(l.birds) ? l.birds : (l.birds ? Object.keys(l.birds) : []);
      const exists = birdsArr.includes(code);

      return {
        ...l,
        birds: exists
          ? birdsArr.filter(b => b !== code)
          : [...birdsArr, code],
        synced: false,
        updatedAt: Date.now()
      };
    });

    save(updated);
  };

  const getList = (id: string) =>
    lists.find(l => l.id === id);

  const deleteList = (id: string) => {
    const updated = lists.filter(l => l.id !== id);
    save(updated);
  };

  return { lists, createList, updateList, toggleBird, getList, deleteList };
};
