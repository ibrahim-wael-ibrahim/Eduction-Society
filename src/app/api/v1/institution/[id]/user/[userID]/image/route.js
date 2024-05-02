// Import necessary modules
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import generateFileName from "@/utils/function/generateFileName";
import generatePath from "@/utils/function/generatePath";
import prisma from "@/lib/prisma";


export const PATCH = async (req, { params }) => {
  const { userID } = params;

  const admin = await prisma.admin.findUnique({ where: { id: userID } });
  if (!admin) {
    const user = await prisma.user.findUnique({ where: { id: userID } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  }
  if (admin && admin.virify === false) {
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
    const path = generatePath(objFileNameAndType.name, `user/image/${userID}`);
    if (objFileNameAndType.type !== "Photo") {

      return NextResponse.json({ error: "Only photo is allowed." }, { status: 400 });
    }
    try {
      await writeFile(path.uploadPath, buffer);
      arrayObjectResponse.push({ name: objFileNameAndType.name, type: objFileNameAndType.type, path: process.env.NEXTAUTH_URL + path.savePath });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }));
  try{
    if (admin) {
      await prisma.admin.update({
        where: { id: userID },
        data: {
          image: arrayObjectResponse[0].path,
        },
      });
      await prisma.institution.update({
        where: { adminId: userID},
        data: {
          image: arrayObjectResponse[0].path,
        },
      });
    }
    if (!admin) {
      await prisma.user.update({
        where: { id: userID },
        data: {
          image: arrayObjectResponse[0].path,
        },
      });
    }
    return NextResponse.json({ Message: "Success", path: arrayObjectResponse[0].path},{ status: 201 });
  }  catch(err){
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};





export const DELETE = async (req, { params }) => {
  const { userID } = params;

  const admin = await prisma.admin.findUnique({ where: { id: userID } });
  if (!admin) {
    const user = await prisma.user.findUnique({ where: { id: userID } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  }
  if (admin && admin.virify === false) {
    return NextResponse.json({ error: "Email not virified" }, { status: 401 });
  }

  try{
    if (admin) {
      await prisma.admin.update({
        where: { id: userID },
        data: {
          image: null,
        },
      });
      await prisma.institution.update({
        where: { adminId: userID},
        data: {
          image: null,
        },
      });

    }
    if (!admin) {
      await prisma.user.update({
        where: { id: userID },
        data: {
          image: null,
        },
      });
    }
    return NextResponse.json({ Message: "Success" }, {status : 200});
  }
  catch(err){
    return NextResponse.json({ error: err.message }, {status : 400});
  }
};
