
import { NextResponse } from "next/server"


const middleware = async (request) => {

        return NextResponse.redirect(new URL("/login", request.url))

}

export const config ={
    matcher: ["/profile:path*"]
}


export { middleware }