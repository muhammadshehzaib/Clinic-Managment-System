import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmails = [`${process.env.NEXT_ADMIN_EMAIL}`];
const adminPassword = `${process.env.NEXT_ADMIN_PASSWORD}`; // Replace with your admin password

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (email === adminEmails[0] && password === adminPassword) {
          // If the provided credentials match the admin, authorize the user as admin
          console.log("Admin authorized:", email);
          return {
            email: adminEmails[0],
            isAdmin: true,
            role: "admin",
          };
        }

        try {
          await mongooseConnect();
          const user = await User.findOne({ email: email });
          if (!user) {
            console.log("User not found:", email);
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            console.log("Password does not match for user:", email);
            return null;
          }

          console.log("User authorized:", email);
          return user;
        } catch (error) {
          console.log("Error during authorization:", error);
        }
      },
    }),
  ],
  callbacks: {},
  session: async ({ session, token, user }) => {},
};

export default NextAuth(authOptions);

// export async function isAdminRequest(req, res) {
//   const session = await getServerSession(req, res, authOptions);
//   if (!adminEmails.includes(session?.user?.email)) {
//     res.status(401);
//     res.end();
//     throw "not an admin";
//   }
// }
