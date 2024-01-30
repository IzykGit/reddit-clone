import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import executeQuery from "./sqldb";
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
                const { username, password } = credentials || {};

                const query = `SELECT * FROM users WHERE username = ? AND password = ?`
                const [user]: any = await executeQuery(query, [username, password])

                if(user) {
                    return {
                        id: user.userId,
                        name: username
                    }
                } else {
                    return null
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