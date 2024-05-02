import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma' 
import { FaLessThanEqual } from 'react-icons/fa6'



export const POST = async (req) => {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    if (session.user.type !== "STUDENT") return NextResponse.json({ error: "You don't have permission " }, { status: 401 });

    const takes = await req.json();
    if (!Array.isArray(takes)) return NextResponse.json({message: "Expected an array of Takes"}, {status: 400});
    try{
        const takeNoneOptional = await prisma.take.findMany({
            where:{
                AND : {
                        yearId: session.user.year,
                        departmentId: session.user.department,
                        semesterId: session.user.semester,
                        optional : false
                }
            }
            ,
            
        })
        for (const take of takeNoneOptional){
            try{
                await prisma.studentTake.create({
                    data:{
                        student:{
                            connect:{
                                id:session.user.student
                            }
                        },
                        take:{
                            connect:{
                                id:take.id
                            }}
                    }
                })
            }
            catch(err){
                console.log(err)
                return NextResponse.json({ error: "Unexpected error" }, { status: 500})
            }
        }
    }
    catch(err){
        console.log(err)
        return NextResponse.json({ error: "Unexpected error" }, { status: 500})
    }
    for (const take of takes) {
        try{
            await prisma.studentTake.create({
                data:{
                    student:{
                        connect:{
                            id:session.user.student
                        }
                    },
                    take:{
                        connect:{
                            id:take
                        }}
                }
            })
        }
        catch(err){
            console.log(err)
            return NextResponse.json({ error: "Unexpected error" }, { status: 500})
        }
    }
    return NextResponse.json({message: "Takes added successfully"}, {status: 200});
}