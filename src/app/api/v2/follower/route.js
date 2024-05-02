import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const POST = async (req) => {

    // check if user have access or session
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })

    if(session.user.type !== "STUDENT" && session.user.type !== "PROFESSOR" && session.user.type !== "TEACHER") return NextResponse.json({ error: "You don't have permission to create users" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams
    const follower = searchParams.get('id')

    if (!follower) return NextResponse.json({ error: "Follower not found" }, { status: 404 });

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        include: {
            following: true
        }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userFollower = await prisma.user.findUnique({
        where: {
            id: follower
        }
    });

    if (!userFollower) return NextResponse.json({ error: "Follower not found" }, { status: 404 });

    if (user.id === userFollower.id) return NextResponse.json({ error: "You can't follow yourself" }, { status: 400 });
    if (user.following.find(f => f.id === userFollower.id)) return NextResponse.json({ error: "You already follow this user" }, { status: 400 });

    try{
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                following : {
                    connect: {
                        id: userFollower.id
                    }
                }
            }
        });
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Follower created" }, { status: 201 });
}


export const DELETE = async (req) => {
    
        // check if user have access or session
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "don't have access or session " }, { status: 400 })
    
        if(session.user.type !== "STUDENT" && session.user.type !== "PROFESSOR" && session.user.type !== "TEACHER") return NextResponse.json({ error: "You don't have permission to create users" }, { status: 401 });
    
        const searchParams = req.nextUrl.searchParams
        const follower = searchParams.get('id')
    
        if (!follower) return NextResponse.json({ error: "Follower not found" }, { status: 404 });

        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            include: {
                following: true
            }
        });
    
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        if (user.id === follower) return NextResponse.json({ error: "You can't unfollow yourself" }, { status: 400 });

        const userFollower = await prisma.user.findUnique({
            where: {
                id: follower
            }
        });

        if (!userFollower) return NextResponse.json({ error: "Follower not found" }, { status: 404 });
            
        if (!user.following.find(f => f.id === userFollower.id)) return NextResponse.json({ error: "You don't follow this user" }, { status: 400 });
    
        try{
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    following : {
                        disconnect: {
                            id: userFollower.id
                        }
                    }
                }
            });
        }
        catch (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        
        return NextResponse.json({ message: "Follower deleted" }, { status: 200 });

}