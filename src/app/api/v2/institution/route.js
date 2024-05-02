import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


export const GET = async (req) => {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })
    
    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get('id')
    if(id){
        try {
            const institution = await prisma.institution.findUnique({
                where: {
                    id
                },
                include: {
                    user: true,
                    post: {
                        include: {
                            institution: true,
                            file: true,
                            reaction: true,
                            comment: true,
                            userSave : true
                        },
                        orderBy :{
                            date : 'desc'
                        }
                    },
                    department: true,
                }
            });
            if (!institution) return NextResponse.json({ error: "Institution not found" }, { status: 404 });
            return NextResponse.json({ ...institution }, { status: 201 })
    
        }
        catch (e) {
            return NextResponse.json({ message: "can't get institution" }, { status: 404 })
        }
    } else {
    try {
        const institution = await prisma.institution.findUnique({
            where: {
                id: session.user.institution
            },
            include: {
                user: true,
                post: {
                    include: {
                        institution: true,
                        file: true,
                        reaction: true,
                        comment: true,
                        userSave : true
                    },
                    orderBy :{
                        date : 'desc'
                    }

                },
                department: true,
            }
        });
        if (!institution) return NextResponse.json({ error: "Institution not found" }, { status: 404 });
        return NextResponse.json({ ...institution }, { status: 201 })

    }
    catch (e) {
        return NextResponse.json({ message: "can't get institution" }, { status: 404 })
    }}


}