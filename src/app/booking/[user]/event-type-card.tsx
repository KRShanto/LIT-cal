import Link from "next/link";
import { Clock, Calendar, User } from "lucide-react";
import { type EventType, formatDuration } from "./types";

type Props = {
  eventType: EventType;
  index: number;
  username: string;
};

/**
 * EventTypeCard
 * Individual event type card component with hover effects and booking functionality.
 */
export default function EventTypeCard({ eventType, index, username }: Props) {
  return (
    <Link
      href={`/booking/${username}/${eventType.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/60 to-neutral-800/40 p-6 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 block"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative space-y-4">
        {/* Event Type Title */}
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
            {eventType.title}
          </h3>
          <div className="rounded-full bg-primary/10 p-2 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Description */}
        {eventType.description && (
          <p className="line-clamp-2 text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
            {eventType.description}
          </p>
        )}

        {/* Duration and Questions */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-slate-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/50">
              <Clock className="h-4 w-4" />
            </div>
            <span className="font-medium">
              {formatDuration(eventType.durationMinutes)}
            </span>
          </div>

          {eventType.questions.length > 0 && (
            <div className="flex items-center gap-3 text-slate-300">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/50">
                <User className="h-4 w-4" />
              </div>
              <span className="font-medium">
                {eventType.questions.length} question
                {eventType.questions.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Book Now Button */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
            <span>Book Now</span>
            <div className="h-1 w-1 rounded-full bg-current animate-pulse" />
          </div>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </Link>
  );
}
