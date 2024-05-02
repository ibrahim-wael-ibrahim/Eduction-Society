import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
    const id = "clv05tzy2000813albemht4xz"
    try{
        const studentTake = await prisma.studentTake.create({
            data:{
                student:{
                    connect:{
                        id
                    }
                },
                take:{
                    connect:{
                        id:"cluv5p0wk000bjhx2w8x6zje9"
                    }}
            }
        })
        return NextResponse.json(studentTake)
    }
    catch(err){
        console.log(err)
        return NextResponse.json(err)
    }
}