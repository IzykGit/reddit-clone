'use server';
import { getServerSession } from "next-auth"
import { options } from "./options";

const SessionServer = async () => {
  const session = await getServerSession(options);

  return (
    <div>
      <h3>Server Component for NextAuthh Session</h3>
      {JSON.stringify(session)}
    </div>
  )
}

export default SessionServer