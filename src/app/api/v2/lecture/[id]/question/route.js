import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'



export const POST = async (req , {params : {id}}) => {
     // check if user have access or session
     const session = await getServerSession(authOptions)
     if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })
 
 
     if (session.user.type !== "STUDENT" ) return NextResponse.json({ error: "don't have access " }, { status: 400 })
     
     // check if user is in database
     const user = await prisma.user.findUnique({ where: { id: session.user.id } })
     if (!user) return NextResponse.json({ error: "don't found user " }, { status: 400 })

     const {content} = await req.json()
     try{
        await prisma.question.create({
            data: 
        {
            lecture: {
                connect: {
                    id
                }
            },
            content,
            student: {
                connect: {
                    id: session.user.student
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


export const GET = async (req , {params : {id}}) => {
    try{
        const question = await prisma.question.findMany({
            where: {
                lectureId: id
            },
            include : {
                student : {
                    include : {
                        user : true
                    }
                },
                answer:{
                    include : {
                        teacher : {
                            include : {
                                user : true
                            }
                        }
                    }
                }
            }
        })
        return NextResponse.json(question , { status: 200 })
    }
    catch(err){
        console.log(err)
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}