import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    const departments = await req.json();
    if (!Array.isArray(departments)) return NextResponse.json({message: "Expected an array of departments"}, {status: 400});
    for (const department of departments) {
        const { name , hours } = department;
        try{
            await prisma.institution.update({
                where: { id },
                data: {
                    department: {
                        create: {
                            name,
                            hours
                        }
                    }
                }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Creating Departments"}, {status: 400});
        }
    }
    return NextResponse.json({message: "Departments Created Successfully"} , {status: 201});
    
}



export const GET = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    try{
        const department = await prisma.department.findMany({
            where: {
                institutionId: id
            }
        });
        return NextResponse.json(department, {status: 200});
    }   
    catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error Fetching Department"}, {status: 400});
    }
}


export const DELETE = async (req, {params}) => {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
        where: {id}
    })
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404})
    const departments = await req.json();
    if (!Array.isArray(departments)) return NextResponse.json({message: "Expected an array of departments"}, {status: 400});
    if(departments.join(',') === ['a', 'l', 'l'].join(',')){
        await prisma.department.deleteMany({
            where: {
                institutionId: id
            }
        })
    }
    departments.forEach(async (department) => {
        
        try{
            await prisma.department.delete({
                where: {id: department }
            })
        }catch (error) {
            console.log(error);
            return NextResponse.json({message: "Error Deleting Departments"}, {status: 400});
        }
    });
    return NextResponse.json({message: "Departments Delete Successfully"} , {status: 201});
    
}