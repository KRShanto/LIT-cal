import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function getUser() {
  try {
    // Get token from cookies
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return null;
    }

    // Verify token and get payload
    const payload = await verifyJWT(token);
    if (!payload) {
      return null;
    }

    // Get user from database with organizations
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        publicEmail: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      // Do not modify cookies here; just return null
      return null;
    }

    // Transform the data to a more convenient structure
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
      publicEmail: user.publicEmail,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

// Type for the returned user object
export type AuthUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;

// Helper to use in Server Components to require authentication
export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}
