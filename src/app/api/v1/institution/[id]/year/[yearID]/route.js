import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (req, {params}) => {
    const { id , yearID} = params;
    const body = await req.json()
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const year = await prisma.year.findUnique({
        where: {id: yearID}
    });
    if(!year) return NextResponse.json({message: "year Not Found"}, {status: 404});

    try{
        await prisma.year.update({
            where: {id: yearID},
            data :{
                ...body
            }
        })
        return NextResponse.json({message: "success update year"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't update year"}, {status: 404})
    }
}


export const GET = async (req, {params})=>{

    const { id , yearID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const year = await prisma.year.findUnique({
        where: {id: yearID}
    });
    if(!year) return NextResponse.json({message: "year Not Found"}, {status: 404});

    try{
        const year = await prisma.year.findUnique({
            where: {id: yearID}
        })
        return NextResponse.json({message: "success Find year", data:year}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Find year"}, {status: 404})
    }
}

export const DELETE = async (req, {params})=>{

    const { id , yearID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const year = await prisma.year.findUnique({
        where: {id: yearID}
    });
    if(!year) return NextResponse.json({message: "year Not Found"}, {status: 404});

    try{
        await prisma.year.delete({
            where: {id: yearID}
        })
        return NextResponse.json({message: "success Delete year"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Delete year"}, {status: 404})
    }
}