"use client";

import React, { useState, useMemo } from "react";
import { Calendar, Clock, User, Phone, Search } from "lucide-react";
import { toZonedTime } from "date-fns-tz";
import MeetingDetailsDrawer from "./meeting-details-drawer";

type Booking = {
  id: string;
  inviteeName: string;
  inviteeEmail: string;
  inviteePhone: string | null;
  startAt: Date;
  endAt: Date;
  timezone: string;
  eventType: {
    id: string;
    title: string;
    slug: string;
    durationMinutes: number;
  };
  contact: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
  } | null;
  answers: {
    id: string;
    question: {
      idx: number;
      question: string;
      type: string;
    };
    value: string | string[] | number | boolean;
  }[];
};

type Props = {
  bookings: Booking[];
  userTimezone: string;
};

type TabType = "upcoming" | "past";

/**
 * MeetingsClient
 * Client component for displaying and managing user bookings.
 * Features tabbed interface, search, and card-style layout.
 */
export default function MeetingsClient({ bookings, userTimezone }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter and search bookings
  const filteredBookings = useMemo(() => {
    const now = new Date();
    let filtered = bookings;

    // Apply time filter based on active tab
    if (activeTab === "upcoming") {
      filtered = filtered.filter((booking) => new Date(booking.startAt) > now);
    } else if (activeTab === "past") {
      filtered = filtered.filter((booking) => new Date(booking.startAt) <= now);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.inviteeName.toLowerCase().includes(term) ||
          booking.inviteeEmail.toLowerCase().includes(term) ||
          booking.eventType.title.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [bookings, searchTerm, activeTab]);

  /**
   * Formats a date for display in the user's timezone.
   * @param utcDate - The UTC date from database
   * @returns Formatted date string in user's timezone
   */
  function formatDate(utcDate: Date): string {
    // Convert UTC to user's timezone first
    const userDate = toZonedTime(utcDate, userTimezone);

    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(userDate);
  }

  /**
   * Formats time for display in the user's timezone.
   * @param utcDate - The UTC date from database
   * @returns Formatted time string in user's timezone
   */
  function formatTime(utcDate: Date): string {
    // Convert UTC to user's timezone first
    const userDate = toZonedTime(utcDate, userTimezone);

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(userDate);
  }

  /**
   * Handles opening the meeting details drawer.
   * @param booking - The booking to show details for
   */
  function handleBookingClick(booking: Booking) {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  }

  /**
   * Handles closing the meeting details drawer.
   */
  function handleCloseDrawer() {
    setIsDrawerOpen(false);
    setSelectedBooking(null);
  }

  /**
   * Gets the status of a booking based on current time.
   * @param startAt - Booking start time
   * @param endAt - Booking end time
   * @returns Status string
   */
  function getBookingStatus(startAt: Date, endAt: Date): string {
    const now = new Date();
    const start = new Date(startAt);
    const end = new Date(endAt);

    if (now < start) {
      return "upcoming";
    } else if (now >= start && now <= end) {
      return "ongoing";
    } else {
      return "completed";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Meetings</h1>
          <p className="mt-1 text-slate-400">
            Manage and view all your scheduled meetings
          </p>
        </div>
        <div className="text-sm text-slate-400">
          {filteredBookings.length} {activeTab} meetings
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-neutral-800/50 p-1 rounded-xl border border-neutral-700/50">
        {[
          {
            value: "upcoming",
            label: "Upcoming",
            count: bookings.filter((b) => new Date(b.startAt) > new Date())
              .length,
          },
          {
            value: "past",
            label: "Past",
            count: bookings.filter((b) => new Date(b.startAt) <= new Date())
              .length,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as TabType)}
            className={`relative flex-1 px-6 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
              activeTab === tab.value
                ? "text-white bg-neutral-700/80"
                : "text-slate-400 hover:text-white hover:bg-neutral-700/40"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{tab.label}</span>
              <span
                className={`px-2 py-1 text-sm font-bold rounded-full ${
                  activeTab === tab.value
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-neutral-600/50 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search meetings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neutral-500/50 focus:border-neutral-500/50"
        />
      </div>

      {/* Bookings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookings.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">
              {searchTerm ? "No meetings found" : `No ${activeTab} meetings`}
            </h3>
            <p className="text-slate-400">
              {searchTerm
                ? "Try adjusting your search criteria"
                : `Your ${activeTab} meetings will appear here`}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const status = getBookingStatus(booking.startAt, booking.endAt);

            return (
              <button
                key={booking.id}
                onClick={() => handleBookingClick(booking)}
                className="group w-full text-left rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2 truncate">
                      {booking.eventType.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate(booking.startAt)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${
                      status === "upcoming"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : status === "ongoing"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
                    }`}
                  >
                    {status}
                  </div>
                </div>

                {/* Time and Duration */}
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTime(booking.startAt)} -{" "}
                      {formatTime(booking.endAt)}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    {booking.eventType.durationMinutes} min
                  </div>
                </div>

                {/* Invitee Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300 truncate">
                      {booking.inviteeName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300 truncate">
                      {booking.inviteeEmail}
                    </span>
                  </div>
                  {booking.inviteePhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300 truncate">
                        {booking.inviteePhone}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Meeting Details Drawer */}
      <MeetingDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        booking={selectedBooking}
        userTimezone={userTimezone}
      />
    </div>
  );
}
