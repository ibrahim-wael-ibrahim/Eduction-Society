import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (req , {params}) => {
    const { id } = params
    const count = await prisma.user.count({where: {
        institutionId : id,
        type : "STUDENT"
    }})
    return NextResponse.json(count)
};