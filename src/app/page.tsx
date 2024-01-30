import SessionServer from "./api/auth/[...nextauth]/SessionServer";
import Navbar from "./components/navbar";
import User from "./components/user";

export default function Home() {
  

  return (
    <div>
      <Navbar />
      <h1>Home</h1>


      <h1>Server Side</h1>
      <SessionServer />


      <h1>Client Side</h1>
      <User />
    </div>
  );
}
