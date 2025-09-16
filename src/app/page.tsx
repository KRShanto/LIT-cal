import LandingPage from "@/components/landing-page";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    return <LandingPage />;
  } else {
    redirect("/dashboard");
  }
}
