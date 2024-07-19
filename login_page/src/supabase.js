import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://brascriwpyjszukhbylt.supabase.co'
const supabaseAnonkey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyYXNjcml3cHlqc3p1a2hieWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwMjgzNDUsImV4cCI6MjAzMjYwNDM0NX0.JVjgr50U_bAK30eP1VN95WVoa5hq8CjP6-D_CGsNZWg'
const supabase = createClient(supabaseUrl, supabaseAnonkey);

export default supabase;
