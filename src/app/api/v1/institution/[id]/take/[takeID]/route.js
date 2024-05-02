import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (req, {params}) => {
    const { id , takeID} = params;
    const body = await req.json()
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const take = await prisma.take.findUnique({
        where: {id: takeID}
    });
    if(!take) return NextResponse.json({message: "take Not Found"}, {status: 404});

    try{
        await prisma.take.update({
            where: {id: takeID},
            data :{
                ...body
            }
        })
        return NextResponse.json({message: "success update take"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't update take"}, {status: 404})
    }
}


export const GET = async (req, {params})=>{

    const { id , takeID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const take = await prisma.take.findUnique({
        where: {id: takeID}
    });
    if(!take) return NextResponse.json({message: "take Not Found"}, {status: 404});

    try{
        const take = await prisma.take.findUnique({
            where: {id: takeID},
            include:{
                department:true ,
                subject : true ,
                year : true  ,
                semester : true ,
                hour : true 
            }
        })
        return NextResponse.json({message: "success Find take", data:take}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Find take"}, {status: 404})
    }
}

export const DELETE = async (req, {params})=>{

    const { id , takeID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const take = await prisma.take.findUnique({
        where: {id: takeID}
    });
    if(!take) return NextResponse.json({message: "take Not Found"}, {status: 404});

    try{
        await prisma.take.delete({
            where: {id: takeID}
        })
        return NextResponse.json({message: "success Delete take"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Delete take"}, {status: 404})
    }
}