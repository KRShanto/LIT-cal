import ProfileClient from "./profile-client";
import { getDbUser } from "@/lib/auth";

export const metadata = {
  title: "Profile Settings",
};

export default async function ProfileSettingsPage() {
  const user = await getDbUser();
  return <ProfileClient user={user} />;
}
