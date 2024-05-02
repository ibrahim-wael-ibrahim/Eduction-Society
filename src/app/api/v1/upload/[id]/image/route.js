// Import necessary modules
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import generateFileName from "@/utils/function/generateFileName";
import generatePath from "@/utils/function/generatePath";
import prisma from "@/lib/prisma";


// Define the POST handler for the file upload
export const POST = async (req, {params}) => {
    const { id } = params;

    const admin = await prisma.admin.findUnique({ where: { id } });
                if(!admin){
                    const user = await prisma.user.findUnique({ where: { id } });
                    if(!user){
                        return NextResponse.json({ error: "User not found" }, { status: 404 });
                    }
                }
                if(admin.virify === false){
                    return NextResponse.json({ error: "Email not virified" }, { status: 401 });
                }

  // Parse the incoming form data
  const formData = await req.formData();
  // Get the files from the form data
  const files = formData.getAll('file');
    if (files.length === 0) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  if (files.length > 1) {
    return NextResponse.json({ error: "Only one file is allowed." }, { status: 400 });
}
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
    const path = generatePath( objFileNameAndType.name ,`user/image/${id}` );
    if(objFileNameAndType.type !== "Photo"){
      
      return NextResponse.json({ error: "Only photo is allowed." }, { status: 400 });
    }
    try{
      await writeFile(path.uploadPath, buffer);
      arrayObjectResponse.push({name: objFileNameAndType.name, type: objFileNameAndType.type, path: process.env.NEXTAUTH_URL + path.savePath});
    }catch(err){
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }));
  if (admin){
    await prisma.admin.update({
      where: { id },
      data: {
        image: arrayObjectResponse[0].path,
      },
    });
  }
  if (!admin){
    await prisma.user.update({
      where: { id },
      data: {
        image: arrayObjectResponse[0].path,
      },
    });
  }
  return NextResponse.json({ Message: "Success" ,path :arrayObjectResponse[0].path , status: 201 });
};


export const DELETE = async (req, {params}) => {
  const { id } = params;

  const admin = await prisma.admin.findUnique({ where: { id } });
              if(!admin){
                  const user = await prisma.user.findUnique({ where: { id } });
                  if(!user){
                      return NextResponse.json({ error: "User not found" }, { status: 404 });
                  }
              }
              if(admin.virify === false){
                  return NextResponse.json({ error: "Email not virified" }, { status: 401 });
              }

if (admin){
  await prisma.admin.update({
    where: { id },
    data: {
      image: null,
    },
  });
}
if (!admin){
  await prisma.user.update({
    where: { id },
    data: {
      image: null,
    },
  });
}
return NextResponse.json({ Message: "Success" , status: 201 });
};
