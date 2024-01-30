import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import prisma from '../../../libs/prismadb';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';


export const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session:  {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    providers: [
        Credentials({
            name: "Credentails",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "Your Username"
                },
                password: {
                    label: "Password",
                    type: "password",
                }
            },
            async authorize(credentials, req) {
                const user = { id: "1", username: "izyk", email: "example@gmail.com", password: "1234"}


                return {
                    id: user.id,
                    name: user.username,
                    email: user.email
                }
            }
        })
    ],
    secret: process.env.SECRET,
    debug: process.env.NODE_ENV === "development"
};


/* 
    callbacks: {
        jwt: async ({ token, user }) => {
            if(user) {
                token.uid = user.id;
                token.name = user.name
            }

            return token
        },
        session: async ({session, token}) => {
            if(token) {
                session.user.id = token.uid;
                session.name = token.username;
            }

            return session;
        }
    },
*/