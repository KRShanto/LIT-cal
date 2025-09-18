import Image from "next/image";
import { type User } from "./types";

type Props = {
  user: User;
};

/**
 * UserHeader
 * Displays the user's profile information including avatar, name, email, and availability status.
 */
export default function UserHeader({ user }: Props) {
  return (
    <div className="text-center">
      <div className="mb-6">
        {user.imageUrl ? (
          <div className="relative mx-auto inline-block">
            <Image
              src={user.imageUrl}
              alt={user.name}
              className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-primary/20 shadow-2xl"
              width={96}
              height={96}
            />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 ring-4 ring-neutral-950"></div>
          </div>
        ) : (
          <div className="relative mx-auto inline-block">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-3xl font-bold text-primary-foreground shadow-2xl ring-4 ring-primary/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 ring-4 ring-neutral-950"></div>
          </div>
        )}
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
      {user.publicEmail && (
        <p className="text-lg text-slate-400 mb-4">{user.publicEmail}</p>
      )}
      <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
        Available for meetings
      </div>
    </div>
  );
}
