import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    secret : process.env.NEXTAUTH_SECRET,
    session:{
        strategy: "jwt",
    },
    pages : {
        signIn : '/login'
    },
    providers:[
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: {  label: "password", type: "password" }
            },
            async authorize(credentials) {
                const admin = await prisma.admin.findUnique({ where: { email: credentials.email },
                    include:{
                        institution:true,
                    }
                });
                if(!admin){
                    const user = await prisma.user.findUnique({ where: { email: credentials.email } ,
                        include:{
                            student:true,
                            teacher:true,
                        }
                    });
                    if(!user){
                        throw new Error("Email or Password not valid");
                    }
                    const valid = await bcrypt.compare(credentials.password, user.password);
                    if(valid){
                        if(user.type === "STUDENT"){
                            return {
                                id: user.id , type: user.type ,
                                email: user.email,
                                name: user.name, image: user.image,
                                institution: user.institutionId,
                                student: user.student.id,
                                department: user.student.departmentId,
                                semester: user.student.semesterId,
                                year: user.student.yearId,
                            }
                        }
                        if(user.type === "TEACHER" || user.type === "PROFESSOR"){
                            return {
                                id: user.id , type: user.type ,
                                email: user.email,
                                name: user.name, image: user.image,
                                institution: user.institutionId,
                                teacher: user.teacher.id,
                            }
                        }
                        if(user.type === "ADMIN_REGISTER" || user.type === "ADMIN_SOCIAL"){
                            return {
                                id: user.id , type: user.type ,
                                email: user.email,
                                name: user.name, image: user.image,
                                institution: user.institutionId,
                            }
                        }
                    }
                    else{
                        throw new Error("Email or Password not valid");
                    }
                }
                if(admin.virify === false){
                    throw new Error("Email not virified");
                }
                const valid = await bcrypt.compare(credentials.password, admin.password);
                if(valid){
                    return { id: admin.id , type: admin.type ,
                        email: admin.email,
                        name: admin.name, image: admin.image,
                        institution: admin.institution.id,
                    };}
                else{
                    throw new Error("Email or Password not valid");
                }
            }
        })
    ] ,
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
    
}