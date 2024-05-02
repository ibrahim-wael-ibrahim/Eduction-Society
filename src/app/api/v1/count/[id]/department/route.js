import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (req , {params}) => {
    const { id } = params
    const count = await prisma.department.count({where: {
        institutionId : id,
    }})
    return NextResponse.json(count)
};