import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('supabase', supabase);

export interface Zip {
  id: string;
  name: string;
  description: string;
  app_url: string;
  landing_page_html: string;
}

export async function saveZip(zip: Zip) {
  const { data, error } = await supabase
    .from('zips')
    .insert([zip])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getZips() {
  const { data, error } = await supabase
    .from('zips')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching zips:', error);
    throw error;
  }

  console.log('Fetched zips:', data);
  return data;
}

export async function getZip(id: string) {
  const { data, error } = await supabase
    .from('zips')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
