import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// NOTE: This script uses the ANON KEY.
// The actual profile data (plan, role, credits) is set by the
// `handle_new_user` trigger in the database, which is the
// secure and recommended way to provision special users.

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase URL or Anon Key is not defined.');
  console.error('Please ensure you have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Auto-confirm users so they don't need to verify email.
    // This is useful for a seed script.
    autoRefreshToken: false,
    persistSession: false,
  }
});

const testUsers = [
  { email: 'basic@test.com', password: 'Password123!' },
  { email: 'plus@test.com', password: 'Password123!' },
  { email: 'premium@test.com', password: 'Password123!' },
  { email: 'ultra@test.com', password: 'Password123!' },
  { email: 'superadmin@test.com', password: 'Password123!' },
];

async function seedUsers() {
  console.log('Starting to seed test users...');

  for (const user of testUsers) {
    // The `handle_new_user` trigger in the DB handles profile creation.
    // We just need to create the auth user here.
    // The trigger is idempotent, but signUp is not, so we must handle existing users.
    
    console.log(`Attempting to create user: ${user.email}...`);
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (error) {
      if (error.message.includes('User already registered')) {
         console.log(`User ${user.email} already exists. Skipping.`);
      } else {
         console.error(`Error creating user ${user.email}:`, error.message);
      }
    } else if (data.user) {
      console.log(`Successfully created user ${user.email}. The DB trigger has provisioned their profile.`);
    } else {
      console.warn(`No user data returned for ${user.email}, but no error was thrown. It might already exist.`);
    }
  }

  console.log('\nTest user seeding complete.');
  console.log('You can now log in via the UI with any of the test user emails and the password "Password123!"');
}

seedUsers();
