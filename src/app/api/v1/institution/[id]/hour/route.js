import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req, {params}) => {
    const { id } = params;
    if(!id) return NextResponse.json({message: "id is required"}, {status: 400})
    
    const hours = await req.json();
    if (!Array.isArray(hours)) return NextResponse.json({message: "Expected an array of hour"}, {status: 400});
    
    
    for (const hour of hours) {
        try{
            await prisma.institution.update({
                where: { id },
                data: {
                    hour: {
                        create: {
                            price : hour.price,
                            year: {
                                connect: { id: hour.year }
                            },
                            department: {
                                connect: { id: hour.department }
                            },
                            semester: {
                                connect: { id: hour.semester }
                            },
                        }
                    }
                }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Creating hours"}, {status: 400});
        }
    }
    return NextResponse.json({message: "hours Created Successfully"} , {status: 201});
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
    if(year && department && semester){
        try{
            const hours = await prisma.hour.findMany({
                where: {
                    AND :{
                        yearId : year ,
                        departmentId : department ,
                        semesterId : semester
                    }
                }
                ,
            include :{
                year : true,
                department : true,
                semester: true
            }
            })
            return NextResponse.json(hours, {status: 200});
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Fetching hours"}, {status: 400});
        }
    }



    try{
        const hours = await prisma.hour.findMany({
            where: {
                institutionId: id
            }
            ,
            include :{
                year : true,
                department : true,
                semester: true
            }
        })
        return NextResponse.json(hours, {status: 200});
    }catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error Fetching hours"}, {status: 400});
    }
}

// DELETE Method
export const DELETE = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    const hours = await req.json();
    if (!Array.isArray(hours)) return NextResponse.json({message: "Expected an array of hours"}, {status: 400});
    
    if(hours.join(',') === ['a', 'l', 'l'].join(',')){
        await prisma.hour.deleteMany({
            where: {
                institutionId: id
            }
        })
    }
    
    hours.forEach(async (hour) => {
        try{
            await prisma.hour.delete({
                where: {id : hour }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Deleting hours"}, {status: 400});
        }
    });
    return NextResponse.json({message: "hours Deleted Successfully"} , {status: 201});
}


