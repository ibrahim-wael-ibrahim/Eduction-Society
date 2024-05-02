import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'



export const POST = async (req , {params : {id}}) => {
     // check if user have access or session
     const session = await getServerSession(authOptions)
     if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })
 
 
     if (session.user.type !== "PROFESSOR" && session.user.type !== "TEACHER" ) return NextResponse.json({ error: "don't have access " }, { status: 400 })
     
     // check if user is in database
     const user = await prisma.user.findUnique({ where: { id: session.user.id } })
     if (!user) return NextResponse.json({ error: "don't found user " }, { status: 400 })

     const {content} = await req.json()
     try{
        await prisma.answer.create({
            data: 
        {
            question: {
                connect: {
                    id
                }
            },
            content,
            teacher: {
                connect: {
                    id: session.user.teacher
                }
            },
            
        }})
        return NextResponse.json({ Massage : "success" }, { status: 200 })
     }
        catch(err){
            console.log(err)
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
}




