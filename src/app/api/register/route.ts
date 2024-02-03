import bcrypt from 'bcrypt';
import executeQuery from '../auth/[...nextauth]/sqldb';
import { NextResponse } from 'next/server';




export async function POST(request: Request) {

    try {

        console.log('Raw request body:', request.body);


        
        if (!request.body) {
            return new NextResponse(JSON.stringify({ error: "No request body" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await request.json();
        const { username, password, email } = data;

        if (!username || !password || !email) {
            return NextResponse.json({ error: "Missing username, password, or email" });
        }


        const [nameExist]: any = await executeQuery("SELECT username FROM users WHERE EXISTS (SELECT username FROM users WHERE username = ?)", [username])
        const [emailExist]: any = await executeQuery("SELECT email FROM users WHERE EXISTS (SELECT email FROM users WHERE email = ?)", [email])

        if(nameExist) {
            console.log("This username is already registered")
            return NextResponse.json({ error: "This username is already registered" })
        } 
        
        if(emailExist) {
            console.log("This email is already registered")
            return NextResponse.json({ error: "This email is already registered" })
        }







        const hashed = await bcrypt.hash(password, 10)

        const query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
        const newUser = await executeQuery(query, [username, hashed, email]);




        return new NextResponse(JSON.stringify(newUser), {
            headers: {
                "Content-Type": "application/json"
            },
            status: 201
        })
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(error)
    }
}