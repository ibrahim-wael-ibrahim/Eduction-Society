import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma' 



export const POST = async (req) => {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    if (session.user.type !== "STUDENT") return NextResponse.json({ error: "You don't have permission " }, { status: 401 });

    const payment = await req.json();

    try{
        await prisma.paymentSemester.create({
                data : {
                    student : {
                        connect : {
                            id : session.user.student
                        }
                    },
                    semester : {
                        connect : {
                            id : session.user.semester
                        }
                    }
                    , 
                    amount : `${payment.amount}` , 
                    cardNumber : payment.cardNumber ,
                    cvv : payment.cardCvv ,
                    expireDate : payment.cardExpiration
                }
        })
        return NextResponse.json({message: "Payment added successfully"}, {status: 200});
    }
    catch(err){
        console.log(err)
        return NextResponse.json({ error: "Unexpected error" }, { status: 500})
    }
}


export const GET = async (req) => {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    if (session.user.type !== "STUDENT") return NextResponse.json({ error: "You don't have permission " }, { status: 401 });

    try{
        const payment = await prisma.paymentSemester.findMany({
            where:{
                AND :{
                    studentId: session.user.student,
                    semesterId: session.user.semester
                }
            }
        })
        if(payment.length === 0) {
            const amount = await prisma.studentTake.findMany({
                where:{
                    AND : {
                            studentId: session.user.student,
                    }
                },
                include:{
                    take:{
                        include:{
                            hour : true
                        }
                    }
                }
            })
            let total = 0;

            for(const take of amount){
                total += take.take.hour.price * take.take.hourCount
            }
            return NextResponse.json({amount: total}, { status: 200 });
        }
        return NextResponse.json(payment, { status: 200 });
    }
    catch(err){
        console.log(err)
        return NextResponse.json({ error: "Unexpected error" }, { status: 500})
    }
}