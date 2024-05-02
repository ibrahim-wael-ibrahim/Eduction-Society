import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma";
import NextAuth from "next-auth/next";


export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret : process.env.NEXTAUTH_SECRET,
  session:{
      strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
          email: { label: "email", type: "text" },
          password: {  label: "password", type: "password" }
      },})
  ],
  callbacks: {
        
    debug: process.env.NODE_ENV === "development",
    async jwt({ token, user , session , trigger}) {
        if (user) {
            token.id = user.id
            token.type = user.type
            token.email = user.email
            token.name = user.name
            token.image = user.image
            token.institution = user.institution
            token.student = user.student
            token.teacher = user.teacher
            token.department = user.department
            token.semester = user.semester
            token.year = user.year

        }
        if ( trigger === "update" && session?.user) {
            token.id = session.user.id
            token.type = session.user.type
            token.email = session.user.email
            token.name = session.user.name
            token.image = session.user.image
            token.institution = session.user.institution
            token.student = session.user.student
            token.teacher = session.user.teacher
            token.department = session.user.department
            token.semester = session.user.semester
            token.year = session.user.year

        }
        return token
    },
    async session({ session, token }) {
        if (session?.user) {
            session.user.id = token.id
            session.user.type = token.type
            session.user.email = token.email
            session.user.name = token.name
            session.user.image = token.image
            session.user.institution = token.institution
            session.user.student = token.student
            session.user.teacher = token.teacher
            session.user.department = token.department
            session.user.semester = token.semester
            session.user.year = token.year
        }

        return session
    },
    
}
};

export default NextAuth(authOptions);