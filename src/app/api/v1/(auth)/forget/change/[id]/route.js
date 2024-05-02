import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export const PATCH = async (reg, {params}) => {
    const { id } = params;
    const body = await reg.json();
    const { password } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const admin = await prisma.admin.findUnique({ where: { id } });
       if(!admin){
        const user = await prisma.user.findUnique({ where: { id } });
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              password: hashedPassword,
            },
          });
        return NextResponse.json({ 
            message: "Password Updated"
         }, { status: 201 });    
    }
    await prisma.admin.update({
        where: {
          id: admin.id,
        },
        data: {
          password: hashedPassword,
        },
      });
    return NextResponse.json(
        { 
            message: "Password Updated"
         }, { status: 201 }
    );
    }catch(e) {
        
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}