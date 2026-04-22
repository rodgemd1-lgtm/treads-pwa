const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function supabaseFrom(table: string) {
  return {
    select: async () => {
      const data = JSON.parse(localStorage.getItem(`treads_${table}`) || '[]');
      return { data, error: null };
    },
    insert: async (row: any) => {
      const key = `treads_${table}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const newRow = { ...row, id: row.id || crypto.randomUUID?.() || `${Date.now()}` };
      localStorage.setItem(key, JSON.stringify([newRow, ...existing]));
      return { data: newRow, error: null };
    },
    update: async (row: any) => {
      const key = `treads_${table}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const idx = existing.findIndex((r: any) => r.id === row.id);
      if (idx >= 0) existing[idx] = { ...existing[idx], ...row };
      localStorage.setItem(key, JSON.stringify(existing));
      return { data: existing[idx], error: null };
    },
    eq: function(f: string, v: any) { return this; },
    order: function(f: string, o?: any) { return this; },
  };
}

export async function uploadImage(file: File) {
  const reader = new FileReader();
  return new Promise<string>((resolve) => {
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
