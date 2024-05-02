import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (req, {params}) => {
    const { id , hourID} = params;
    const body = await req.json()
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const hour = await prisma.hour.findUnique({
        where: {id: hourID}
    });
    if(!hour) return NextResponse.json({message: "hour Not Found"}, {status: 404});

    try{
        await prisma.hour.update({
            where: {id: hourID},
            data :{
                ...body
            }
        })
        return NextResponse.json({message: "success update hour"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't update hour"}, {status: 404})
    }
}


export const GET = async (req, {params})=>{

    const { id , hourID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const hour = await prisma.hour.findUnique({
        where: {id: hourID}
    });
    if(!hour) return NextResponse.json({message: "hour Not Found"}, {status: 404});

    try{
        const hour = await prisma.hour.findUnique({
            where: {id: hourID}
        })
        return NextResponse.json({message: "success Find hour", data:hour}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Find hour"}, {status: 404})
    }
}

export const DELETE = async (req, {params})=>{

    const { id , hourID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const hour = await prisma.hour.findUnique({
        where: {id: hourID}
    });
    if(!hour) return NextResponse.json({message: "hour Not Found"}, {status: 404});

    try{
        await prisma.hour.delete({
            where: {id: hourID}
        })
        return NextResponse.json({message: "success Delete hour"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Delete hour"}, {status: 404})
    }
}