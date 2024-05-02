import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from "bcrypt";
import generateEmailAndPassword from "@/utils/function/generateEmailAndPassword";

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

    const users = await req.json();
    if (!Array.isArray(users)) return NextResponse.json({ message: "Expected an array of users" }, { status: 400 });

    try {
        for (const user of users) {
            const { email, password } = generateEmailAndPassword(user.name, "STUDENT", user.birth, institution.name);
            const hashedPassword = await bcrypt.hash(password, 10);
            // Base user data
            let userData = {
                name: user.name,
                email,
                password: hashedPassword,
                birth: user.birth,
                type: "STUDENT",
                gender: user.gender,
                address: user.address,
                phone: user.phone,
                institution: {
                    connect: {
                        id: institution.id
                    }
                },
                student: {
                    create: {
                        code: (typeof user.code === "string") ? user.code : `${user.code }`,
                        startYear: user.startYear,
                        grade: user.grade ? user.grade : "",
                    }
                }
            };
            if (!user.department) return NextResponse.json({ error: "Department not found" }, { status: 404 });
            const department = await prisma.department.findFirst({
                where: {
                    name: user.department,
                    institutionId: institution.id
                }
            })
            userData.student.create.department = {
                connect: {
                    id: department.id
                }
            }

            if (!user.year) return NextResponse.json({ error: "Year not found" }, { status: 404 });
            const year = await prisma.year.findFirst({
                where: {
                    name: user.year,
                    institutionId: institution.id
                }
            })
            userData.student.create.year = {
                connect: {
                    id: year.id
                }
            }
            
            if (!user.semester) return NextResponse.json({ error: "Semester not found" }, { status: 404 });
            const semester = await prisma.semester.findFirst({
                where: {
                    name: user.semester,
                    institutionId: institution.id
                }
            })
            userData.student.create.semester = {
                connect: {
                    id: semester.id
                }
            }
            try {
                await prisma.user.create({ data: userData });
                console.log(`Student ${user.name} created successfully`);
            } catch (e) {
                console.error(`Error creating user ${user.name}:`, e);
                return NextResponse.json({ error: `Error creating user ${user.name}` }, { status: 500 });
            }



        }

    }
    catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
    return NextResponse.json({ message: "Students created successfully" }, { status: 201 });
}


// export const GET = async (req) => {

//     // check if user have access or session
//     const session = await getServerSession(authOptions)

//     const searchParams = req.nextUrl.searchParams
//     const institution = searchParams.get('institution')
//     try {
//         if (institution) {
//             const users = await prisma.user.findMany({
//                 where: {
//                     institutionId: institution,
//                     type: "STUDENT"
//                 },
//                 include: {
//                     student: true
//                 }
//             })
//             return NextResponse.json(users, { status: 200 });
//         }
//         else {

//             const users = await prisma.user.findMany({
//                 where: {
//                     institutionId: session.user.institution,
//                     type: "STUDENT"
//                 },
//                 include: {
//                     student: true,
//                 }
//             });
//             return NextResponse.json(users, { status: 200 });
//         }
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
//     }
// }


