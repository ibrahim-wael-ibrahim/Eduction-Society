import NextAuth from "next-auth/next";
import {authOptions} from "@/lib/next-auth"

const authHandler = NextAuth(authOptions);


export {authHandler as GET , authHandler as POST};