import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bfdxswvgncllwtthghdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmZHhzd3ZnbmNsbHd0dGhnaGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MTQzODAsImV4cCI6MjA2ODk5MDM4MH0.0CYHTA3qWiuEkSmHMY6SZl7xX-BbP30Z8ZRhnX70WUA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
