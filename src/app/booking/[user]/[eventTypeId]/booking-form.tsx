"use client";

import React, { useState } from "react";
import { type EventType, type User } from "../types";
import { createBooking } from "@/actions/bookings/create-booking";
import BookingBackground from "../booking-background";
import BookingNavbar from "../booking-navbar";
import MeetingDetails from "./meeting-details";
import DateTimePicker from "./date-time-picker";
import UserInfoForm from "./user-info-form";
import QuestionsForm from "./questions-form";
import BookingSuccessModal from "./booking-success-modal";

type AvailabilityData = {
  date: string; // YYYY-MM-DD format
  timeSlots: string[]; // Array of available time slots
};

type Props = {
  eventType: EventType;
  user: User;
  initialAvailability?: AvailabilityData[];
  hostTimezone?: string;
};

type BookingStep = "datetime" | "userinfo" | "questions" | "confirm";

type UserInfo = {
  name: string;
  email: string;
  phone?: string;
  timezone: string;
};

/**
 * BookingForm
 * Main component for the individual event type booking page.
 * Handles the multi-step booking process: date/time selection → questions → confirmation.
 */
export default function BookingForm({
  eventType,
  user,
  initialAvailability = [],
  hostTimezone = "UTC",
}: Props) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("datetime");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /**
   * Handles date and time selection completion.
   * Moves to the questions step if there are questions, otherwise to confirmation.
   */
  function handleDateTimeSelected(date: Date, time: string, timezone: string) {
    setSelectedDate(date);
    setSelectedTime(time);
    setUserInfo((prev) => ({ ...prev, timezone }));
    setCurrentStep("userinfo");
  }

  /**
   * Handles user information completion.
   * Moves to questions step if there are questions, otherwise to confirmation.
   */
  function handleUserInfoCompleted(info: UserInfo) {
    setUserInfo(info);
    if (eventType.questions.length > 0) {
      setCurrentStep("questions");
    } else {
      setCurrentStep("confirm");
    }
  }

  /**
   * Handles questions completion.
   * Moves to the confirmation step.
   */
  function handleQuestionsCompleted(questionAnswers: Record<string, string>) {
    setAnswers(questionAnswers);
    setCurrentStep("confirm");
  }

  /**
   * Handles the final booking submission.
   * Creates the booking and shows success/error message.
   */
  async function handleBookingSubmit() {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      // Parse the selected time
      const [time, period] = selectedTime.replace(/\s/g, "").split(/(am|pm)/i);
      const [hours, minutes] = time.split(":").map(Number);

      let hour24 = hours;
      if (period.toLowerCase() === "pm" && hours !== 12) {
        hour24 += 12;
      } else if (period.toLowerCase() === "am" && hours === 12) {
        hour24 = 0;
      }

      // Create start and end times
      const startAt = new Date(selectedDate);
      startAt.setHours(hour24, minutes, 0, 0);

      const endAt = new Date(startAt);
      endAt.setMinutes(endAt.getMinutes() + eventType.durationMinutes);

      const result = await createBooking({
        eventTypeId: eventType.id,
        inviteeName: userInfo.name,
        inviteeEmail: userInfo.email,
        startAt,
        endAt,
        timezone: userInfo.timezone,
        answers,
      });

      if (result.ok) {
        setShowSuccessModal(true);
      } else {
        alert(`Failed to create booking: ${result.error}`);
      }
    } catch (error) {
      console.error("Booking creation failed:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show success screen directly instead of modal
  if (showSuccessModal) {
    return (
      <>
        <BookingBackground />
        <BookingNavbar />
        <div className="relative mx-auto max-w-6xl px-4 py-8 space-y-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <BookingSuccessModal
              isOpen={true}
              eventType={eventType}
              user={user}
              selectedDate={selectedDate!}
              selectedTime={selectedTime!}
              timezone={userInfo.timezone}
              durationMinutes={eventType.durationMinutes}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BookingBackground />
      <BookingNavbar />
      <div className="relative mx-auto max-w-6xl px-4 py-8 space-y-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Side - Meeting Details */}
          <div className="space-y-6">
            <MeetingDetails eventType={eventType} user={user} />
          </div>

          {/* Right Side - Booking Form */}
          <div className="space-y-6">
            {currentStep === "datetime" && (
              <DateTimePicker
                eventType={eventType}
                onDateTimeSelected={handleDateTimeSelected}
                initialAvailability={initialAvailability}
                hostTimezone={hostTimezone}
              />
            )}

            {currentStep === "userinfo" && (
              <UserInfoForm
                userInfo={userInfo}
                onCompleted={handleUserInfoCompleted}
                onBack={() => setCurrentStep("datetime")}
              />
            )}

            {currentStep === "questions" && (
              <QuestionsForm
                questions={eventType.questions}
                onCompleted={handleQuestionsCompleted}
                onBack={() => setCurrentStep("userinfo")}
              />
            )}

            {currentStep === "confirm" && (
              <div className="space-y-8">
                <div className="rounded-lg border border-white/10 bg-neutral-900/60 p-8 backdrop-blur-sm">
                  <h3 className="text-2xl font-semibold text-white mb-6">
                    Confirm Your Booking
                  </h3>

                  <div className="space-y-4">
                    {/* Meeting Details */}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-lg text-slate-400">Date:</span>
                      <span className="text-lg font-medium text-white">
                        {selectedDate?.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-lg text-slate-400">Time:</span>
                      <span className="text-lg font-medium text-white">
                        {selectedTime}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-lg text-slate-400">Duration:</span>
                      <span className="text-lg font-medium text-white">
                        {eventType.durationMinutes} minutes
                      </span>
                    </div>

                    {/* User Information */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-lg font-medium text-white mb-4">
                        Your Information:
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-base text-slate-400">
                            Name:
                          </span>
                          <span className="text-base font-medium text-white">
                            {userInfo.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-base text-slate-400">
                            Email:
                          </span>
                          <span className="text-base font-medium text-white">
                            {userInfo.email}
                          </span>
                        </div>
                        {userInfo.phone && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-base text-slate-400">
                              Phone:
                            </span>
                            <span className="text-base font-medium text-white">
                              {userInfo.phone}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center py-2">
                          <span className="text-base text-slate-400">
                            Timezone:
                          </span>
                          <span className="text-base font-medium text-white">
                            {userInfo.timezone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {eventType.questions.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-lg font-medium text-white mb-4">
                        Your Answers:
                      </h4>
                      <div className="space-y-3">
                        {eventType.questions.map((q) => {
                          const key = String(q.idx);
                          const value = answers[key];
                          if (!value) return null;
                          return (
                            <div
                              key={key}
                              className="flex items-start justify-between gap-6 rounded-md border border-white/10 bg-white/5 p-4"
                            >
                              <span className="text-base text-slate-300">
                                {q.question}
                              </span>
                              <span className="text-base font-medium text-white">
                                {value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentStep(
                        eventType.questions.length > 0
                          ? "questions"
                          : "userinfo"
                      )
                    }
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-base font-medium text-slate-300 hover:bg-white/10 transition-colors"
                  >
                    {eventType.questions.length > 0
                      ? "Back to Questions"
                      : "Back to Information"}
                  </button>

                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {isSubmitting ? "Creating Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
