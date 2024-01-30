import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'
import prisma from '../../libs/prismadb'


export async function POST({request}: any) {
    const body = await request.json();
    const {name, password, email} = body;

    if(!name || !password || !email) {
        return new NextResponse("Missing Fields", { status: 400 });
    }

    const exist = await prisma.user.findUnique({
        where: {
            email
        }
    });


    if(exist) {
        return new NextResponse(JSON.stringify({ error: "User already registered with this email" }), { status: 409 });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            hashedPassword,
            email
        }
    });


    return NextResponse.json(user);
}