import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from 'next/server'


export const GET = async (req, res) => {
  const session = await getServerSession(authOptions)
  if (session) {
    return NextResponse.json({ session : session.user }, { status: 200 })
  }
}