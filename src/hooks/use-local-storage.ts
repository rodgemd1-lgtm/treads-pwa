'use client';

import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) setStored(JSON.parse(item));
    } catch (err) {
      console.error(`localStorage read error for key "${key}":`, err);
    }
    setLoaded(true);
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStored((prev) => {
      const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch (err) {
        console.error('localStorage quota exceeded', err);
      }
      return next;
    });
  }, [key]);

  return [stored, setValue, loaded] as const;
}