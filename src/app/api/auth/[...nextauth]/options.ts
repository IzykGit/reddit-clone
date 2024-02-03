import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import executeQuery from "./sqldb";
import bcrypt from 'bcrypt'
import { stringify } from "querystring";
import { redirect } from "next/dist/server/api-utils";
import { RedirectType } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";


export const options: NextAuthOptions = {
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
                    placeholder: "Your Password"
                }
            },
            async authorize(credentials, req) {
                const { username, password } = credentials || {};


                const query = "SELECT * FROM users WHERE username = ?"
                const [user]: any = await executeQuery(query, [username])

                if(user && await bcrypt.compare(password!, user.password)) {
                    return {
                        id: user.userId,
                        name: user.username,
                        email: user.email,
                    }
                }

            }
        })
    ],
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
    }
};