import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const GET = async(req , { params }) => {
    const { id } = params;
    try {
        const user = await prisma.admin.findUnique({ where: { id } });
        if(user.virify === true) {
            return NextResponse.json({ error: "Email is Verified " }, { status: 404 });
        }
        await prisma.admin.update({ where: { id }, data: { virify: true } });
        return NextResponse.json({ virify:"Virify true" }, { status: 200 });
    }catch(e) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
}