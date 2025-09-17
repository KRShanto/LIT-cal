import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

// Type for the returned user object
export type AuthUser = NonNullable<Awaited<ReturnType<typeof getAuthUser>>>;
// Type for the returned user object from the database
export type DbUser = NonNullable<Awaited<ReturnType<typeof getDbUser>>>;

export async function getAuthUser() {
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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

// Helper to use in Server Components to require authentication
export async function requireAuth() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}

// Get user from the database
// This is used in Server Components to get the user from the database
// This expects the user to be authenticated, otherwise it will redirect to the login page
export async function getDbUser() {
  const dbUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: dbUser.id },
    select: {
      id: true,
      email: true,
      name: true,
      publicEmail: true,
      imageUrl: true,
      username: true,
      timezone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}
