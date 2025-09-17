import LandingPage from "@/components/landing-page";
import { getAuthUser } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Schedule your meetings with LIT Cal",
};

export default async function Home() {
  const user = await getAuthUser();

  if (!user) {
    return <LandingPage />;
  } else {
    redirect("/dashboard");
  }
}
