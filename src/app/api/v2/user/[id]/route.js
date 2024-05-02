import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const PATCH = async (req,{params}) => {
    const { id } = params;
      // check if user have access or session
  const session = await getServerSession(authOptions)

    const body = await req.json()
    const institution  = await prisma.institution.findUnique({
        where: {id : session.user.institution}
    });
    if(!institution) return NextResponse.json({message: "institution Not Found"}, {status: 404});
    const user = await prisma.user.findUnique({
        where: {id }
    });

    try{
        if(user){
            await prisma.user.update({
                where: {id },
                data :{
                    ...body
                }
            })
        }else if(!user){
            await prisma.admin.update({
                where: {id },
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

export const GET = async (req, {params}) => {
    const { id } = params;
    const session = await getServerSession(authOptions)
  
    try {
      let user = await prisma.user.findUnique({
        where: {id},
        include: {
          student: {
            include: {
              department: true,
              year: true,
              semester: true,
            }
          },
          teacher: {
            include: {
              post: {
                include: {
                  file: true,
                  teacher: {
                    include: {
                      user: {
                        include: {
                          institution: true,
                          followedBy: true,
                          following: true
                        }
                      }
                    }
                  },
                  reaction: true,
                  comment: true,
                  userSave: true,
                  institution: true
                },
                orderBy: {
                    date: 'desc'
                }
              }
            }
          },
          institution: true,
          followedBy: true,
          following: true,
          postSave: {
            include: {
              post: {
                include: {
                  file: true,
                  teacher: {
                    include: {
                      user: {
                        include: {
                          institution: true,
                          followedBy: true,
                          following: true
                        }
                      }
                    }
                  },
                  reaction: true,
                  comment: true,
                  userSave: true,
                  institution: true,
                  
                }
              }
            }
          },
        }
      });
  
      if (!user) {
        user = await prisma.admin.findUnique({
          where: {id},
          include: {
            institution: true
          }
        });
      }
  
      if (!user) {
        return NextResponse.json({message: "User Not Found"}, {status: 404});
      }
  
      return NextResponse.json({message: "Success Find User", data: user}, {status: 200});
    } catch(e) {
      return NextResponse.json({message: "Can't Find User"}, {status: 404});
    }
  }
  

export const DELETE = async (req, {params})=>{

    const { id } = params;
              // check if user have access or session
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({message: "not session"}, {status: 404});

    const user = await prisma.user.findUnique({
        where: {id }
    });
    if(!user) return NextResponse.json({message: "user Not Found"}, {status: 404});

    try{
        await prisma.user.delete({
            where: {id }
        })
        return NextResponse.json({message: "success Delete user"}, {status: 201})
    }catch(e){
        return NextResponse.json({message: "can't Delete user"}, {status: 404})
    }
}