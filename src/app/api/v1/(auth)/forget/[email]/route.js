import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export const GET = async (reg, {params}) => {
    const { email } = params;
    try {
        const admin = await prisma.admin.findUnique({ where: { email } });
       if(!admin){
        const user = await prisma.user.findUnique({ where: { email } });
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        console.log(`${process.env.NEXTAUTH_URL}/forget/${user.id}`);
        return NextResponse.json({ link : `${process.env.NEXTAUTH_URL}/forget/${user.id}` }, { status: 201 });
    }
    console.log(`${process.env.NEXTAUTH_URL}/forget/${admin.id}`);
    return NextResponse.json({ link : `${process.env.NEXTAUTH_URL}/forget/${admin.id}` }, { status: 201 });
    }catch(e) {
        
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}