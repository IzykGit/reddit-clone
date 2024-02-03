import SessionServer from "./api/auth/[...nextauth]/SessionServer";
import Navbar from "./components/navbar";
import User from "./components/user";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";

export default async function  Home() {
  
  const session = await getServerSession(options)


  return (
    <div>
      <Navbar />
      <h1>Home</h1>

    {session && (
      <div>
        <p>Name: {session.user!.name}</p>
      </div>
    )}


      <h1>Server Side</h1>
      <SessionServer />


      <h1>Client Side</h1>
      <User />
    </div>
  );
}
