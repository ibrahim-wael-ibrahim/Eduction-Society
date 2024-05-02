import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    const subjects = await req.json();
    if (!Array.isArray(subjects)) return NextResponse.json({message: "Expected an array of subjects"}, {status: 400});
    for (const subject of subjects) {
        const { name , code } = subject;
        try{
            await prisma.institution.update({
                where: { id },
                data: {
                    subject: {
                        create: {
                            name,
                            code
                        }
                    }
                }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Creating Subjects"}, {status: 400});
        }
    }
    return NextResponse.json({message: "Subjects Created Successfully"} , {status: 201});
}

// GET Method
export const GET = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    try{
        const subjects = await prisma.subject.findMany({
            where: {
                institutionId: id
            }
        })
        return NextResponse.json(subjects, {status: 200});
    }catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error Fetching Subjects"}, {status: 400});
    }
}

// DELETE Method
export const DELETE = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    const subjects = await req.json();
    if (!Array.isArray(subjects)) return NextResponse.json({message: "Expected an array of subjects"}, {status: 400});
    
    if(subjects.join(',') === ['a', 'l', 'l'].join(',')){
        await prisma.subject.deleteMany({
            where: {
                institutionId: id
            }
        })
    }

    subjects.forEach(async (subject) => {
        try{
            await prisma.subject.delete({
                where: {id : subject }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Deleting Subjects"}, {status: 400});
        }
    });
    return NextResponse.json({message: "Subjects Deleted Successfully"} , {status: 201});
}
