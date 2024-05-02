import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (req, {params}) => {
    const { id , userID} = params;
    const body = await req.json()
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const user = await prisma.user.findUnique({
        where: {id: userID}
    });

    try{
        if(user){
            await prisma.user.update({
                where: {id: userID},
                data :{
                    ...body
                }
            })
        }else if(!user){
            await prisma.admin.update({
                where: {id: userID},
                data :{
                    ...body
                }
            }) 
        }
        else{
            if(!user) return NextResponse.json({message: "user Not Found"}, {status: 404});
                    }
        return NextResponse.json({message: "success update user"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't update user"}, {status: 404})
    }
}


export const GET = async (req, {params})=>{

    const { id , userID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    let user = null;
    user = await prisma.user.findUnique({
        where: {id: userID}
    });
    try{
    if(user){
            user = await prisma.user.findUnique({
                where: {id: userID},
                include:{
                    student : true ,
                    teacher : true ,
                    institution : true
                }
            })
        }else if(!user){
            user = await prisma.admin.findUnique({
                where: {id: userID},
                include:{
                    institution : true 
                }
            })
        }else {
    if(!user) return NextResponse.json({message: "user Not Found"}, {status: 404});

        }
            return NextResponse.json({message: "success Find user", data:user}, {status: 201})
        }catch(e){
            return NextResponse.json({message: "can't Find user"}, {status: 404})
        }

}

export const DELETE = async (req, {params})=>{

    const { id , userID} = params;
    const institution  = await prisma.institution.findUnique({
        where: {id}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const user = await prisma.user.findUnique({
        where: {id: userID}
    });
    if(!user) return NextResponse.json({message: "user Not Found"}, {status: 404});

    try{
        await prisma.user.delete({
            where: {id: userID}
        })
        return NextResponse.json({message: "success Delete user"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Delete user"}, {status: 404})
    }
}