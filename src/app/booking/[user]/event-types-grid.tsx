import { Calendar } from "lucide-react";
import { type EventType } from "./types";
import EventTypeCard from "./event-type-card";

type Props = {
  eventTypes: EventType[];
  username: string;
};

/**
 * EventTypesGrid
 * Displays a grid of event type cards with empty state handling.
 */
export default function EventTypesGrid({ eventTypes, username }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose a Meeting</h2>
        <p className="text-slate-400">
          Select the type of meeting you&apos;d like to schedule
        </p>
      </div>

      {eventTypes.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/40 to-neutral-800/40 p-12 text-center backdrop-blur-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
            <Calendar className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Available Meetings
          </h3>
          <p className="text-slate-400">
            This user doesn&apos;t have any active meeting types at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((eventType, index) => (
            <EventTypeCard
              key={eventType.id}
              eventType={eventType}
              index={index}
              username={username}
            />
          ))}
        </div>
      )}
    </div>
  );
}
