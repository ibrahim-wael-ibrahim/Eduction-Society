import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'



export const GET = async (req , {params : {id}}) => {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    const institution = await prisma.institution.findUnique({
        where: {
            id: session.user.institution
        }
    });

    if (!institution) return NextResponse.json({ error: "Institution not found" }, { status: 404 });

    if (session.user.type !== "PROFESSOR"  ) return NextResponse.json({ error: "You don't have permission to This knowledge" }, { status: 401 });
    try{
        
            const take = await prisma.take.findUnique({
                where:{
                    id
                },
                include: {
                    subject: true,
                    department: true,
                    semester: true,
                    year: true,
                }
            })
            return NextResponse.json(take, { status: 200 });
    }catch(e){
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}