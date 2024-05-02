// Import necessary modules
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import generateFileName from "@/utils/function/generateFileName";
import generatePath from "@/utils/function/generatePath";



// Define the POST handler for the file upload
export const POST = async (req, res) => {
  // Parse the incoming form data
  const formData = await req.formData();
  // Get the files from the form data
  const files = formData.getAll('file');

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
  }));

  return NextResponse.json({ Message: "Success" ,files : arrayObjectResponse, status: 201 });
};
