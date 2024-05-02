import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req, {params}) => {
    const { id } = params;
    if(!id) return NextResponse.json({message: "id is required"}, {status: 400})
    
    const takes = await req.json();
    if (!Array.isArray(takes)) return NextResponse.json({message: "Expected an array of take"}, {status: 400});
    
    
    for (const take of takes) {
        try{
            await prisma.institution.update({
                where: { id },
                data: {
                    take: {
                        create: {
                            optional : take.optional, 
                            hourCount :take.hourCount ,
                            year: {
                                connect: { id: take.year }
                            },
                            department: {
                                connect: { id: take.department }
                            },
                            semester: {
                                connect: { id: take.semester }
                            },
                            hour : {
                                connect: { id: take.hour }
                            },
                            subject : {
                                connect: { id: take.subject }
                            }
                        }
                    }
                }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Creating takes"}, {status: 400});
        }
    }
    return NextResponse.json({message: "takes Created Successfully"} , {status: 201});
}


// GET Method
export const GET = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    const searchParams = req.nextUrl.searchParams
    const year = searchParams.get('year')
    const department = searchParams.get('department')
    const semester = searchParams.get('semester')
    const subject = searchParams.get('subject')
    if(year && department && semester && subject){
        try{
            const takes = await prisma.take.findMany({
                where: {
                    AND :{
                        yearId : year ,
                        departmentId : department ,
                        semesterId : semester,
                        subjectId : subject
                    }
                }
                ,
            include :{
                year : true,
                department : true,
                semester: true,
                subject : true,
            }
            })
            return NextResponse.json(takes, {status: 200});
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Fetching Takes"}, {status: 400});
        }
    }
    
    
    try{
        const takes = await prisma.take.findMany({
            where: {
                institutionId: id
            },
            include:{
                department:true ,
                subject : true ,
                year : true  ,
                semester : true ,
                hour : true 
            }
        })
        return NextResponse.json(takes, {status: 200});
    }catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error Fetching takes"}, {status: 400});
    }
}

// DELETE Method
export const DELETE = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    const takes = await req.json();
    if (!Array.isArray(takes)) return NextResponse.json({message: "Expected an array of takes"}, {status: 400});
    
    if(takes.join(',') === ['a', 'l', 'l'].join(',')){
        await prisma.take.deleteMany({
            where: {
                institutionId: id
            }
        })
    }
    
    
    takes.forEach(async (take) => {
        try{
            await prisma.take.delete({
                where: {id : take }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Deleting takes"}, {status: 400});
        }
    });
    return NextResponse.json({message: "takes Deleted Successfully"} , {status: 201});
}


