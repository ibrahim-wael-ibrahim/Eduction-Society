import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// PATCH Method
export const PATCH = async (req, {params}) => {
    const { id , subjectID} = params;
    const body = await req.json()
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const subject = await prisma.subject.findUnique({
        where: {id: subjectID}
    });
    if(!subject) return NextResponse.json({message: "subject Not Found"}, {status: 404});

    try{
        await prisma.subject.update({
            where: {id: subjectID},
            data :{
                ...body
            }
        })
        return NextResponse.json({message: "success update subject"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't update subject"}, {status: 404})
    }
}

// GET Method
export const GET = async (req, {params})=>{
    const { id , subjectID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const subject = await prisma.subject.findUnique({
        where: {id: subjectID}
    });
    if(!subject) return NextResponse.json({message: "subject Not Found"}, {status: 404});

    try{
        const subject = await prisma.subject.findUnique({
            where: {id: subjectID}
        })
        return NextResponse.json({message: "success Find subject", data:subject}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Find subject"}, {status: 404})
    }
}

// DELETE Method
export const DELETE = async (req, {params})=>{
    const { id , subjectID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const subject = await prisma.subject.findUnique({
        where: {id: subjectID}
    });
    if(!subject) return NextResponse.json({message: "subject Not Found"}, {status: 404});

    try{
        await prisma.subject.delete({
            where: {id: subjectID}
        })
        return NextResponse.json({message: "success Delete subject"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Delete subject"}, {status: 404})
    }
}
