import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma' 



export const GET = async (req) => {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    if (session.user.type !== "STUDENT") return NextResponse.json({ error: "You don't have permission " }, { status: 401 });

    try{
        const take = await prisma.take.findMany({
            where:{
                AND : {
                        yearId: session.user.year,
                        departmentId: session.user.department,
                        semesterId: session.user.semester,
                }
            }
            ,
            include :{
                subject : true
            }
        })
        return NextResponse.json(take, { status: 200 });
    }
    catch(err){
        console.log(err)
        return NextResponse.json({ error: "Unexpected error" }, { status: 500})
    }
} 