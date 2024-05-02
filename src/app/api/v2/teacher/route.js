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
            if ( user.type !== "TEACHER" && user.type !== "PROFESSOR") return NextResponse.json({ error: "User type not found" }, { status: 404 });
            const { email, password } = generateEmailAndPassword(user.name, user.type, user.birth, institution.name);
            const hashedPassword = await bcrypt.hash(password, 10);
            // Base user data
            let userData = {
                name: user.name,
                email,
                password: hashedPassword,
                birth: user.birth,
                gender: user.gender,
                address: user.address,
                phone: user.phone,
                type: user.type,
                institution: {
                    connect: {
                        id: institution.id
                    }
                },
                teacher: {
                    create: {
                        degree: user.degree,
                        about : user.about
                    }
                }
            };
            
            try {
                await prisma.user.create({ data: userData });
                console.log(`teacher ${user.name} created successfully`);
                return NextResponse.json({
                    message: `teacher ${user.name} created successfully`
                },
                    { status: 200 }
                )
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
}


export const GET = async (req) => {

    // check if user have access or session
    const session = await getServerSession(authOptions)

    const searchParams = req.nextUrl.searchParams
    const institution = searchParams.get('institution')
    try {
        if (institution) {
            const users = await prisma.user.findMany({
                where: {
                    institutionId: institution,
                    type: {
                        in: ["TEACHER", "PROFESSOR"]
                    }
                },
                include: {
                    teacher: true
                }
            })
            return NextResponse.json(users, { status: 200 });
        }
        else {

            const users = await prisma.user.findMany({
                where: {
                    institutionId: session.user.institution,
                    type: {
                        in: ["TEACHER", "PROFESSOR"]
                    }
                },
                include: {
                    teacher: true,
                }
            });
            return NextResponse.json(users, { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
}


