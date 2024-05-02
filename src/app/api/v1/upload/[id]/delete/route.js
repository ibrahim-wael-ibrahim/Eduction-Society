// Import necessary modules
import { NextResponse } from "next/server";
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
