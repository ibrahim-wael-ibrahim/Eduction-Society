import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (req, {params}) => {
    const { id , departmentID} = params;
    const body = await req.json()
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const department = await prisma.department.findUnique({
        where: {id: departmentID}
    });
    if(!department) return NextResponse.json({message: "department Not Found"}, {status: 404});

    try{
        await prisma.department.update({
            where: {id: departmentID},
            data :{
                ...body
            }
        })
        return NextResponse.json({message: "success update department"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't update department"}, {status: 404})
    }
}


export const GET = async (req, {params})=>{

    const { id , departmentID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const department = await prisma.department.findUnique({
        where: {id: departmentID}
    });
    if(!department) return NextResponse.json({message: "department Not Found"}, {status: 404});

    try{
        const department = await prisma.department.findUnique({
            where: {id: departmentID}
        })
        return NextResponse.json({message: "success Find department", data:department}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Find department"}, {status: 404})
    }
}

export const DELETE = async (req, {params})=>{

    const { id , departmentID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const department = await prisma.department.findUnique({
        where: {id: departmentID}
    });
    if(!department) return NextResponse.json({message: "department Not Found"}, {status: 404});

    try{
        await prisma.department.delete({
            where: {id: departmentID}
        })
        return NextResponse.json({message: "success Delete department"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Delete department"}, {status: 404})
    }
}