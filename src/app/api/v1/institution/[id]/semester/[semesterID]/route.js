import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (req, {params}) => {
    const { id , semesterID} = params;
    const body = await req.json()
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const semester = await prisma.semester.findUnique({
        where: {id: semesterID}
    });
    if(!semester) return NextResponse.json({message: "semester Not Found"}, {status: 404});

    try{
        await prisma.semester.update({
            where: {id: semesterID},
            data :{
                ...body
            }
        })
        return NextResponse.json({message: "success update semester"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't update semester"}, {status: 404})
    }
}


export const GET = async (req, {params})=>{

    const { id , semesterID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const semester = await prisma.semester.findUnique({
        where: {id: semesterID}
    });
    if(!semester) return NextResponse.json({message: "semester Not Found"}, {status: 404});

    try{
        const semester = await prisma.semester.findUnique({
            where: {id: semesterID}
        })
        return NextResponse.json({message: "success Find semester", data:semester}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Find semester"}, {status: 404})
    }
}

export const DELETE = async (req, {params})=>{

    const { id , semesterID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const semester = await prisma.semester.findUnique({
        where: {id: semesterID}
    });
    if(!semester) return NextResponse.json({message: "semester Not Found"}, {status: 404});

    try{
        await prisma.semester.delete({
            where: {id: semesterID}
        })
        return NextResponse.json({message: "success Delete semester"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Delete semester"}, {status: 404})
    }
}