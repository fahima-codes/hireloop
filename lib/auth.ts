import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
const client = new MongoClient(process.env.BETTER_AUTH_DB_URL as string);

const db = client.db('hireloopdb');

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ['seeker', 'recruiter', 'admin'], // better-auth fields are single primitives, not arrays
        input: true, // client sign-up request থেকে role পাঠানো যাবে
        defaultValue: 'seeker', // ফর্মের default
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
