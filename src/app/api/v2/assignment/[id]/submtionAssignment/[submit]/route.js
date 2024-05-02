import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


export const DELETE = async (req, { params: { submit } }) => {

    // check if user have access or session
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    // check if user is ADMIN_SOCIAL or PROFESSOR or TEACHER 

    if (session.user.type !== "STUDENT") return NextResponse.json({ error: "don't have access " }, { status: 400 })

    // check if user is in database
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: "don't found user " }, { status: 400 })

    // check if submit is in database
    const submitAssignment = await prisma.submtionAssignment.findUnique({ where: { id: submit } })
    if (!submitAssignment) return NextResponse.json({ error: "don't found submit " }, { status: 400 })

    try {
        await prisma.submtionAssignment.delete({ where: { id: submit } })
        return NextResponse.json({ message: "Successfully deleted submit" }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


export const PATCH = async (req, { params: { submit } }) => {

    // check if user have access or session
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    // check if user is ADMIN_SOCIAL or PROFESSOR or TEACHER 

    if (session.user.type !== "PROFESSOR" && session.user.type !== "TEACHER") return NextResponse.json({ error: "don't have access " }, { status: 400 })

    // check if user is in database
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: "don't found user " }, { status: 400 })

    // check if submit is in database
    const submitAssignment = await prisma.submtionAssignment.findUnique({ where: { id: submit } })
    if (!submitAssignment) return NextResponse.json({ error: "don't found submit " }, { status: 400 })
    const { status } = await req.json()

    try {
        await prisma.submtionAssignment.update({ where: { id: submit }, data: {  status } })
        return NextResponse.json({ message: "Successfully updated submit" }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

}