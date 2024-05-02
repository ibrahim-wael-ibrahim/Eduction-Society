import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { writeFile } from "fs/promises";
import generateFileName from "@/utils/function/generateFileName";
import generatePath from "@/utils/function/generatePath";


export const POST = async (req) => {

    // check if user have access or session
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    // check if user is ADMIN_SOCIAL or PROFESSOR or TEACHER 

    if (session.user.type !== "ADMIN_SOCIAL" && session.user.type !== "PROFESSOR" && session.user.type !== "TEACHER") return NextResponse.json({ error: "don't have access " }, { status: 400 })
    
    // check if user is in database
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: "don't found user " }, { status: 400 })

    // Parse the incoming form data
    const formData = await req.formData();
    // Get the files from the form data
    const files = formData.getAll('file');
    const content = formData.get('content');
    const publicChoose = formData.get('publicChoose');

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

      let dataPost = {}



      if(session.user.type === "ADMIN_SOCIAL"){
        dataPost ={
          content: content,
          publicChoose : publicChoose ==="true" ? true : false,
          file : {
              createMany: {
                  data: arrayObjectResponse
                }},
          institution: {
            connect: {
              id: session.user.institution
            }
          }
        }
      }
      if (session.user.type === "PROFESSOR" || session.user.type === "TEACHER"){
        dataPost ={
          content: content,
          publicChoose : publicChoose ==="true" ? true : false,
          file : {
              createMany: {
                  data: arrayObjectResponse
                }},
          teacher: {
            connect: {
              id: session.user.teacher
            }
          }
        }
      }

      try{
        await prisma.post.create({data: dataPost})
        return NextResponse.json({ Message: "Success" , status: 201 });
      }
        catch(err){
            console.log(err)
            return NextResponse.json({ error: err }, { status: 500 });
        }
}


export const GET = async (req) => {
    try{
        const posts = await prisma.post.findMany({
            where : {
                publicChoose : true
            },
            include: {
                file: true,
                teacher: {
                    include:{
                        user: {
                        include : {
                            institution: true,
                            followedBy : true ,
                            following : true
                        }
                      }
                    }
                },
                reaction: true,
                comment: true, 
                userSave: true,
                institution: true
            },
            orderBy: {
                date: 'desc'
            }
        })
        return NextResponse.json({ data: posts, status: 200 });
    }
    catch(err){
        console.log(err)
        return NextResponse.json({ error: err }, { status: 500 });
    }
}