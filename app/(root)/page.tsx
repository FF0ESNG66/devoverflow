import { auth } from "@/auth";



export default async function Home() {
  const session = await auth()
  console.log(session)
  return (
    <>
      <h1>Welcome to next</h1>
      

    </>
  );
}
