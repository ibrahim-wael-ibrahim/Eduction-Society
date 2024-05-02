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
      const { email, password } = generateEmailAndPassword(user.name, user.type, user.birthDay, institution.name);
      const hashedPassword = await bcrypt.hash(password, 10);

      // Base user data
      let userData = {
        name: user.name,
        email,
        password: hashedPassword,
        birth: user.birthDay,
        type: user.type,
        gender: user.gender,
        institution: {
          connect: {
            id
          }
        }
      };

      // Extend user data based on type
      if (user.type === "PROFESSOR" || user.type === "TEACHER") {
        userData.teacher = { create: {} };
      } else if (user.type === "STUDENT") {
        userData.student = {
          create: {
            department: {
              connect: {
                id: user.departmentId
              }
            }
          }
        };
      }

      try {
        await prisma.user.create({ data: userData });
        console.log(`User ${user.name} created successfully`);
      } catch (e) {
        console.error(`Error creating user ${user.name}:`, e);
        return NextResponse.json({ error: `Error creating user ${user.name}` }, { status: 500 });
      }
    }
  } catch (e) {
    console.error('Unexpected error:', e);
  }
  return NextResponse.json({ message: "Users created successfully" }, { status: 200 });
}



export const GET = async (req) => {

  // check if user have access or session
  const session = await getServerSession(authOptions)
  
  const searchParams = req.nextUrl.searchParams
  const institution = searchParams.get('institution')
  try{
    if(institution){
      const users = await prisma.user.findMany({
        where: {
          institutionId: institution
        }
      })
      return NextResponse.json(users, { status: 200 }); 
  }
    else{
      
    const users = await prisma.user.findMany({
      where: {
        institutionId: session.user.institution
      },
      include: {
        student: true,
        teacher: true
      }
    });
    return NextResponse.json(users, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error fetching users" }, { status: 400 });
  }
}

// DELETE Method
export const DELETE = async (req, { params }) => {
  // check if user have access or session
  const session = await getServerSession(authOptions)

  const users = await req.json();

  if (!Array.isArray(users)) return NextResponse.json({ message: "Expected an array of users" }, { status: 400 });
  if (session.user.type !== "ADMIN_REGISTER" && session.user.type !== "ADMIN_INSTITUTION") return NextResponse.json({ error: "You don't have permission to create users" }, { status: 401 });
  
  users.forEach(async (user) => {
    try {
      await prisma.user.delete({
        where: { id: user }
      })
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Error Deleting users" }, { status: 400 });
    }
  })
  return NextResponse.json({ message: "users Deleted Successfully" }, { status: 201 });
}