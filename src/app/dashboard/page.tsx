import { Metadata } from "next";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  Calendar,
  Clock,
  Users,
  CalendarPlus,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import {
  format,
  startOfToday,
  endOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import QuickActions from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * Fetches dashboard statistics and recent data for the user
 * @returns Object containing dashboard statistics and recent bookings
 */
async function getDashboardData(userId: string) {
  const now = new Date();
  const today = {
    start: startOfToday(),
    end: endOfToday(),
  };
  const thisWeek = {
    start: startOfWeek(now, { weekStartsOn: 1 }), // Monday start
    end: endOfWeek(now, { weekStartsOn: 1 }),
  };
  const thisMonth = {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };

  try {
    const [
      todayBookings,
      weekBookings,
      monthBookings,
      totalEventTypes,
      activeEventTypes,
      totalContacts,
      recentBookings,
      upcomingBookings,
    ] = await Promise.all([
      // Today's bookings count
      prisma.booking.count({
        where: {
          userId,
          startAt: { gte: today.start, lte: today.end },
        },
      }),
      // This week's bookings count
      prisma.booking.count({
        where: {
          userId,
          startAt: { gte: thisWeek.start, lte: thisWeek.end },
        },
      }),
      // This month's bookings count
      prisma.booking.count({
        where: {
          userId,
          startAt: { gte: thisMonth.start, lte: thisMonth.end },
        },
      }),
      // Total event types
      prisma.eventType.count({
        where: { userId },
      }),
      // Active event types
      prisma.eventType.count({
        where: { userId, isActive: true },
      }),
      // Total contacts
      prisma.contact.count({
        where: { userId },
      }),
      // Recent bookings (last 5)
      prisma.booking.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          inviteeName: true,
          startAt: true,
          eventType: {
            select: { title: true },
          },
        },
      }),
      // Upcoming bookings (next 5)
      prisma.booking.findMany({
        where: {
          userId,
          startAt: { gte: now },
        },
        take: 5,
        orderBy: { startAt: "asc" },
        select: {
          id: true,
          inviteeName: true,
          inviteeEmail: true,
          startAt: true,
          endAt: true,
          eventType: {
            select: { title: true, durationMinutes: true },
          },
        },
      }),
    ]);

    return {
      stats: {
        today: todayBookings,
        week: weekBookings,
        month: monthBookings,
        eventTypes: { total: totalEventTypes, active: activeEventTypes },
        contacts: totalContacts,
      },
      recentBookings,
      upcomingBookings,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      stats: {
        today: 0,
        week: 0,
        month: 0,
        eventTypes: { total: 0, active: 0 },
        contacts: 0,
      },
      recentBookings: [],
      upcomingBookings: [],
    };
  }
}

/**
 * Main dashboard page with modern UI and comprehensive overview
 */
export default async function DashboardPage() {
  const user = await getDbUser();
  const dashboardData = await getDashboardData(user.id);

  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/booking/${user.username}`;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here&apos;s what&apos;s happening with your calendar today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/scheduling"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Event Type
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Meetings */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-300">Today</p>
              <p className="text-2xl font-bold text-white">
                {dashboardData.stats.today}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {dashboardData.stats.today === 1 ? "Meeting" : "Meetings"}
              </p>
            </div>
            <div className="rounded-lg bg-blue-500/20 p-3">
              <Calendar className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-green-500/10 to-green-600/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-300">This Week</p>
              <p className="text-2xl font-bold text-white">
                {dashboardData.stats.week}
              </p>
              <p className="text-xs text-slate-400 mt-1">Total Bookings</p>
            </div>
            <div className="rounded-lg bg-green-500/20 p-3">
              <BarChart3 className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* Event Types */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-300">Event Types</p>
              <p className="text-2xl font-bold text-white">
                {dashboardData.stats.eventTypes.active}
                <span className="text-sm text-slate-400">
                  /{dashboardData.stats.eventTypes.total}
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Active</p>
            </div>
            <div className="rounded-lg bg-purple-500/20 p-3">
              <CalendarPlus className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Total Contacts */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-300">Contacts</p>
              <p className="text-2xl font-bold text-white">
                {dashboardData.stats.contacts}
              </p>
              <p className="text-xs text-slate-400 mt-1">Total Saved</p>
            </div>
            <div className="rounded-lg bg-orange-500/20 p-3">
              <Users className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Meetings */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">
                Upcoming Meetings
              </h2>
            </div>
            <Link
              href="/dashboard/meetings"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all →
            </Link>
          </div>

          {dashboardData.upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-slate-400 mb-3" />
              <p className="text-slate-400 text-sm">No upcoming meetings</p>
              <p className="text-slate-500 text-xs mt-1">
                Your next meetings will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.upcomingBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-blue-500/20 p-2">
                      <Calendar className="h-4 w-4 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {booking.eventType.title}
                    </h3>
                    <p className="text-sm text-slate-400 truncate">
                      with {booking.inviteeName}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span>
                        {format(new Date(booking.startAt), "MMM d, h:mm a")}
                      </span>
                      <span>•</span>
                      <span>{booking.eventType.durationMinutes} min</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center rounded-full bg-green-500/20 border border-green-500/30 px-2 py-1 text-xs font-medium text-green-400">
                      Upcoming
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions bookingUrl={bookingUrl} />

          {/* Recent Activity */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Recent Activity
            </h2>

            {dashboardData.recentBookings.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                <p className="text-slate-400 text-sm">No recent bookings</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.recentBookings.map((booking, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="rounded-full bg-green-500/20 p-1">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white truncate">
                        <span className="font-medium">
                          {booking.inviteeName}
                        </span>{" "}
                        booked
                      </p>
                      <p className="text-slate-400 truncate">
                        {booking.eventType.title}
                      </p>
                    </div>
                    <div className="text-xs text-slate-500">
                      {format(new Date(booking.startAt), "MMM d")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
