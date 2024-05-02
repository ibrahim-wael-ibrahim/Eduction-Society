import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const POST = async (req, { params }) => {
    const { id } = params
    // check if user have access or session
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    // check if user is in database
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: "don't found user " }, { status: 400 })

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: "don't found post " }, { status: 400 })
    const { content } = await req.json()
    try {
        await prisma.post.update({
            where: { id },
            data: {
                comment: {
                    create: {
                        content,
                        user: {
                            connect: {
                                id: user.id
                            }
                        }
                    }
                }
            }
        })
        return NextResponse.json({ message: "comment" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "error" }, { status: 400 })
    }
}

export const DELETE = async (req, { params }) => {
    const { id } = params
    // check if user have access or session
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    // check if user is in database
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: "don't found user " }, { status: 400 })

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: "don't found post " }, { status: 400 })
    const { commentId } = await req.json()
    try {
        await prisma.comment.delete({
            where: {
                id : commentId,
            }
        })
        return NextResponse.json({ message: "comment" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "error" }, { status: 400 })
    }
}

export const GET = async (req, { params }) => {
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
        const comments = await prisma.comment.findMany({
            where: {
                postId: post.id
            }
        })
        return NextResponse.json({ comments }, { status: 200 })
    }
    catch(error){
        console.log(error)
        return NextResponse.json({ error: "error" }, { status: 400 })
    }
}