import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const SALT_ROUNDS = 10;
const PAYMENT_AMOUNT = 200;

export const POST = async (req) => {
    try {
        const {
            name,
            email,
            password,
            insName,
            insCountry,
            insState,
            insCity,
            insAddress,
            cardNumber,
            cardCvv,
            cardExpiration
        } = await req.json();

        const userExists = await prisma.admin.findUnique({ where: { email } });
        if (userExists) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await prisma.admin.create({
            data: {
                name,
                email,
                password: hashedPassword,
                institution: {
                    create: {
                        name: insName,
                        country: insCountry,
                        state: insState,
                        city: insCity,
                        address: insAddress,
                        payment: {
                            create: {
                                cardNumber: cardNumber,
                                cvv: cardCvv,
                                expireDate: cardExpiration,
                                amount: PAYMENT_AMOUNT
                            }
                        }
                    }
                }
            }
        });

        const verificationLink = `${process.env.NEXTAUTH_URL}/verify/${user.id}`;
        console.log(verificationLink);
        return NextResponse.json({ link: verificationLink }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
};
