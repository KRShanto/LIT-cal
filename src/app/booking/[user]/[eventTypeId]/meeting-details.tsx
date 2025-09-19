import Image from "next/image";
import { Clock, User } from "lucide-react";
import {
  type EventType,
  type User as UserType,
  formatDuration,
} from "../types";

type Props = {
  eventType: EventType;
  user: UserType;
};

/**
 * MeetingDetails
 * Displays the meeting information including organizer details, event title, duration, and description.
 */
export default function MeetingDetails({ eventType, user }: Props) {
  return (
    <div className="space-y-6">
      {/* Organizer Info */}
      <div className="flex items-center gap-3">
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-white">{user.name}</h2>
          {user.publicEmail && (
            <p className="text-base text-slate-400">{user.publicEmail}</p>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">{eventType.title}</h1>

        <div className="flex items-center gap-3 text-slate-400">
          <Clock className="h-5 w-5" />
          <span className="text-lg">
            {formatDuration(eventType.durationMinutes)}
          </span>
        </div>

        {eventType.description && (
          <p className="text-lg text-slate-300 leading-relaxed">
            {eventType.description}
          </p>
        )}

        {eventType.questions.length > 0 && (
          <div className="flex items-center gap-3 text-slate-400">
            <User className="h-5 w-5" />
            <span className="text-lg">
              {eventType.questions.length} question
              {eventType.questions.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Footer Links */}
      <div className="pt-6 border-t border-white/10">
        <div className="flex gap-6 text-base text-slate-500">
          <button className="hover:text-slate-300 transition-colors">
            Cookie settings
          </button>
          <button className="hover:text-slate-300 transition-colors">
            Report abuse
          </button>
        </div>
      </div>
    </div>
  );
}
