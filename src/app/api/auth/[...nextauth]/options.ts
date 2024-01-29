import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import executeQuery from "./sqldb";


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
                }
            },
            async authorize(credentials, req) {
                const { username, password } = credentials || {};

                const query = `SELECT * FROM users WHERE username="${username}" AND password="${password}"`
                const [user] = await executeQuery(query, [])

                if(username === user.username && password === user.password) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
};