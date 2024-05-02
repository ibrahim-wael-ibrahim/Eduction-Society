import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    const years = await req.json();
    if (!Array.isArray(years)) return NextResponse.json({message: "Expected an array of year"}, {status: 400});
    for (const year of years) {
        try{
            await prisma.institution.update({
                where: { id },
                data: {
                    year: {
                        create: year
                    }
                }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Creating years"}, {status: 400});
        }
    }
    return NextResponse.json({message: "years Created Successfully"} , {status: 201});
}

// GET Method
export const GET = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    try{
        const years = await prisma.year.findMany({
            where: {
                institutionId: id
            }
        })
        return NextResponse.json(years, {status: 200});
    }catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error Fetching years"}, {status: 400});
    }
}

// DELETE Method
export const DELETE = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    const years = await req.json();
    if (!Array.isArray(years)) return NextResponse.json({message: "Expected an array of years"}, {status: 400});
    
    if(years.join(',') === ['a', 'l', 'l'].join(',')){
        await prisma.year.deleteMany({
            where: {
                institutionId: id
            }
        })
    }
    
    years.forEach(async (year) => {
        try{
            await prisma.year.delete({
                where: {id : year }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Deleting years"}, {status: 400});
        }
    });
    return NextResponse.json({message: "years Deleted Successfully"} , {status: 201});
}
