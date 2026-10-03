import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import authConfig from "@/lib/auth.config";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const admin = await Admin.findOne({
          email: String(credentials.email).toLowerCase().trim(),
        }).select("+password");

        if (!admin) return null;

        const valid = await bcrypt.compare(String(credentials.password), admin.password);
        if (!valid) return null;

        return {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
        };
      },
    }),
  ],
});
