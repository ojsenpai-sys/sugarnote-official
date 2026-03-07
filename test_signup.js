// test_signup.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function signUp() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test_admin@sugarnote.jp',
    password: 'password123',
  });
  console.log('Signup result:', { data, error });
}
signUp();
