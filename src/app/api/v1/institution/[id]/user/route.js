import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import generateEmailAndPassword from "@/utils/function/generateEmailAndPassword";

export const POST = async (req ,{params}) => {
    const {id} = params;
    
    const institution = await prisma.institution.findUnique({
        where: {
            id
        },
    });
    if (!institution) return NextResponse.json({error: "Institution not found"}, {status: 404});
    const users = await req.json();
    // check is body array and body array length is 0
    if (!Array.isArray(users)) return NextResponse.json({message: "Expected an array of users"}, {status: 400});

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
            userData.student = { create: {
                department:{
                    connect:{
                        id: user.departmentId
                    }
                }
            } };
          }
      
          try {
            await prisma.user.create({ data: userData });
            console.log(`User ${user.name} created successfully`);
          } catch (e) {
            console.error(`Error creating user ${user.name}:`, e);
            return NextResponse.json({error: `Error creating user ${user.name}`}, {status: 500});
          }
        }
      } catch (e) {
        console.error('Unexpected error:', e);
      }
    return NextResponse.json({message: "Users created successfully"}, {status: 200});      
        }
    
        

export const GET = async (req, {params}) => {
    const {id} = params;
    const institution = await prisma.institution.findUnique({
        where: {
            id
        },
    });
    if (!institution) return NextResponse.json({error: "Institution not found"}, {status: 404});
    
    const users = await prisma.user.findMany({
        where: {
            institutionId: id
        },
        include: {
            student: true,
            teacher: true
        }
    });
    return NextResponse.json(users, {status: 200});
}


// DELETE Method
export const DELETE = async (req, {params}) => {
  const { id } = params;
  const institution = await prisma.institution.findUnique({
      where: {id}
  })
  if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
  const users = await req.json();
  if (!Array.isArray(users)) return NextResponse.json({message: "Expected an array of users"}, {status: 400});
  users.forEach(async (user) => {
      try{
          await prisma.user.delete({
              where: {id : user }
          })
      }catch (error) {
          console.log(error);
          return NextResponse.json({message: "Error Deleting users"}, {status: 400});
      }
  });
  return NextResponse.json({message: "users Deleted Successfully"} , {status: 201});
}