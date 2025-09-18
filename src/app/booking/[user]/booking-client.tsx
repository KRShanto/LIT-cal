"use client";

import React from "react";
import { type User, type EventType } from "./types";
import BookingBackground from "./booking-background";
import BookingNavbar from "./booking-navbar";
import UserHeader from "./user-header";
import EventTypesGrid from "./event-types-grid";

type Props = {
  user: User;
  eventTypes: EventType[];
};

/**
 * BookingClient
 * Main component for the booking page that orchestrates all sub-components.
 */
export default function BookingClient({ user, eventTypes }: Props) {
  return (
    <>
      <BookingBackground />
      <BookingNavbar />
      <div className="relative mx-auto max-w-6xl px-4 py-8 space-y-12">
        <UserHeader user={user} />
        <EventTypesGrid eventTypes={eventTypes} username={user.username} />
      </div>
    </>
  );
}
