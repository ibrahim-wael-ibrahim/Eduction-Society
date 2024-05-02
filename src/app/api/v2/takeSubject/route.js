import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


export const GET = async (req) => {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    const institution = await prisma.institution.findUnique({
        where: {
            id: session.user.institution
        }
    });

    if (!institution) return NextResponse.json({ error: "Institution not found" }, { status: 404 });

    if (session.user.type !== "PROFESSOR" && session.user.type !== "TEACHER" && session.user.type !== "STUDENT"  ) return NextResponse.json({ error: "You don't have permission to create users" }, { status: 401 });

    try{
        if (session.user.type === "STUDENT") {
            const studentTake = await prisma.studentTake.findMany({
                where: {
                    AND:{
                        studentId: session.user.student,
                    take: {
                        yearId: session.user.year,
                        departmentId: session.user.department,
                        semesterId: session.user.semester,
                    }
                    }
                },
                include: {
                    take: {
                        include: {
                            subject: true,
                            department: true,
                            semester: true,
                            year: true,
                        }
                    }
                }
                
            })
            return NextResponse.json(studentTake, { status: 200 });
        }
        if(session.user.type === "PROFESSOR" || session.user.type === "TEACHER"){
            const hirring = await prisma.hirring.findMany({
                where: {
                    teacherId: session.user.teacher
                },
                include: {
                    take: {
                        include: {
                            subject: true,
                            department: true,
                            year: true,
                        }
                    }
                }
            })
            return NextResponse.json(hirring, { status: 200 });
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error Fetching Takes" }, { status: 400 });
    }
}