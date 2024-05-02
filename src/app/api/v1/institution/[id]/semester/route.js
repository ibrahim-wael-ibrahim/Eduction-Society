import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    const semesters = await req.json();
    if (!Array.isArray(semesters)) return NextResponse.json({message: "Expected an array of semester"}, {status: 400});


    for (const semester of semesters) {
        try{
            await prisma.institution.update({
                where: { id },
                data: {
                    semester: {
                        create: {
                            name : semester.name,
                            year: {
                                connect: { id: semester.year }
                            },
                        }
                    }
                }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Creating semesters"}, {status: 400});
        }
    }
    return NextResponse.json({message: "semesters Created Successfully"} , {status: 201});
}

// GET Method
export const GET = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})

    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('year')
    if(query){
        try{
            const semesters = await prisma.semester.findMany({
                where: {
                    yearId: query
                },
                include :{
                    year : true
                }
            })
            return NextResponse.json(semesters, {status: 200});
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Fetching semesters"}, {status: 400});
        }
    }


    try{
        const semesters = await prisma.semester.findMany({
            where: {
                institutionId: id
            },
            include :{
                year : true
            }
        })
        return NextResponse.json(semesters, {status: 200});
    }catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error Fetching semesters"}, {status: 400});
    }
}

// DELETE Method
export const DELETE = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    const semesters = await req.json();
    if (!Array.isArray(semesters)) return NextResponse.json({message: "Expected an array of semesters"}, {status: 400});
    
    if(semesters.join(',') === ['a', 'l', 'l'].join(',')){
        await prisma.semester.deleteMany({
            where: {
                institutionId: id
            }
        })
    }
    
    semesters.forEach(async (semester) => {
        try{
            await prisma.semester.delete({
                where: {id : semester }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Deleting semesters"}, {status: 400});
        }
    });
    return NextResponse.json({message: "semesters Deleted Successfully"} , {status: 201});
}
