import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


export const POST = async (req) => {

    // check if user have access or session
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    const institution = await prisma.institution.findUnique({
        where: {
            id: session.user.institution
        }
    });

    if (!institution) return NextResponse.json({ error: "Institution not found" }, { status: 404 });

    if (session.user.type !== "ADMIN_REGISTER" && session.user.type !== "ADMIN_INSTITUTION") return NextResponse.json({ error: "You don't have permission to create users" }, { status: 401 });

    const {teacher , take} = await req.json();
    try {
        console.log('TeacherTake:', teacher, take);
        const teacherTake = await prisma.take.update({
            where :{ id :take },
            data :{
                hirring : {
                    create :{
                        teacher : {
                            connect : {
                                id : teacher
                            }
                        }
                    }
                }
            }
        })
        console.log('TeacherTake created successfully:', teacherTake);
        return NextResponse.json({ message: "TeacherTake created successfully" }, { status: 201 });
      } catch (error) {
          console.error('Other error:', error);
          return NextResponse.json({ message: "Error Creating TeacherTake" }, { status: 400 });
      }
}



