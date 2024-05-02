import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'



export const GET = async (req,{params}) => {
    const { id } = params

    try{
        const post = await prisma.post.findUnique({
            where : {id},
include: {
                file: true,
                teacher: {
                    include:{
                        user: {
                        include : {
                            institution: true,
                            followedBy : true ,
                            following : true
                        }
                      }
                    }
                },
                reaction: true,
                comment: {
                    include: {
                        user: true
                    }   
                }, 
                userSave: true,
                institution: true
            }
        })

        if(!post) return NextResponse.json({error: "Post not found"}, {status: 400})

        return NextResponse.json({ ...post, status: 200 });
    }
    catch(err){
        console.log(err)
        return NextResponse.json({ error: err }, { status: 500 });
    }
}


export const DELETE = async (req,{params}) => {

    const { id } = params
    // check if user have access or session
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    // check if user is in database
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: "don't found user " }, { status: 400 })

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: "don't found post " }, { status: 400 })


    try{
        await prisma.post.delete({where : {id}})
        return NextResponse.json({ Message: "Success" , status: 200 });
    }
    catch(err){
        console.log(err)
        return NextResponse.json({ error: err }, { status: 500 });
    }

}

