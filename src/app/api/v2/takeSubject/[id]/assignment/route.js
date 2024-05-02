import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { writeFile } from "fs/promises";
import generateFileName from "@/utils/function/generateFileName";
import generatePath from "@/utils/function/generatePath";


export const POST = async (req , {params : {id}}) => {

    // check if user have access or session
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    // check if user is ADMIN_SOCIAL or PROFESSOR or TEACHER 

    if (session.user.type !== "PROFESSOR" ) return NextResponse.json({ error: "don't have access " }, { status: 400 })
    
    // check if user is in database
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: "don't found user " }, { status: 400 })

    // Parse the incoming form data
    const formData = await req.formData();
    // Get the files from the form data
    const files = formData.getAll('file');
    const name = formData.get('name');
    const description = formData.get('description');
    const link = formData.get('link');
    const date = formData.get('date');

    const arrayObjectResponse = [];

    await Promise.all(files.map(async (file) => {
        // Check if a file is received
        if (!file) {
          // If no file is received, return a JSON response with an error and a 400 status code
          return NextResponse.json({ error: "No files received." }, { status: 400 });
        }
        // Convert the file data to a Buffer
        const buffer = Buffer.from(await file.arrayBuffer());
    
        // Replace spaces in the file name with underscores
        let objFileNameAndType = generateFileName(file);
        const path = generatePath( objFileNameAndType.name );
        try{
          await writeFile(path.uploadPath, buffer);
          arrayObjectResponse.push({name: objFileNameAndType.name, type: objFileNameAndType.type, path: process.env.NEXTAUTH_URL + path.savePath});
        }catch(err){
          return NextResponse.json({ error: err.message }, { status: 500 });
        }
      }))

      try{
        await prisma.assignment.create({data: 
        {
            name: name,
            description: description,
            link: link ,
            lastDate: date,
            file : {
                createMany: {
                    data: arrayObjectResponse
                  }
                },
            Take: {
                connect: {
                    id
                }}
        }
        })
        return NextResponse.json({ Message: "Success" , status: 201 });
      }
        catch(err){
            console.log(err)
            return NextResponse.json({ error: err }, { status: 500 });
        }
}



export const GET = async (req , {params : {id}}) => {
  // check if user have access or session
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

  // check if user is in database
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "don't found user " }, { status: 400 })

  try{
      const assignment = await prisma.assignment.findMany({
          where: {
              TakeId: id
          },
          include: {
              file: true,
              submit:{
                include:{
                  file: true,
                  student:{
                    include:{
                      user: true
                    }
                  }
                }
              }
              
          },
          orderBy: {
              date: 'desc'
          }
      })
      return NextResponse.json(assignment, { status: 200 });
  }
  catch(err){
      console.log(err)
      return NextResponse.json({ error: err }, { status: 500 });
  }
}