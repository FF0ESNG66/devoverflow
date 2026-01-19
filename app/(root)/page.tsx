import { auth, signOut } from "@/auth";
import {Button} from "@/components/ui/button"
import ROUTES from "@/./constants/routes";


export default async function Home() {
  const session = await auth()
  console.log(session)
  return (
    <>
      <h1>Welcome to next</h1>
      
      <form className="px-10 pt-25"
      action={async () => {
        "use server";

        await signOut({ redirectTo: ROUTES.SIGN_IN })
      }}>
        <Button type="submit">Log out</Button>
      </form>
    </>
  );
}
