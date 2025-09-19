"use client";

import React, { useState } from "react";
import { User, Mail, Phone } from "lucide-react";

type UserInfo = {
  name: string;
  email: string;
  phone?: string;
  timezone: string;
};

type Props = {
  userInfo: UserInfo;
  onCompleted: (info: UserInfo) => void;
  onBack: () => void;
};

/**
 * UserInfoForm
 * Component for collecting user information (name, email, phone, timezone).
 * Matches the styling of other forms in the application.
 */
export default function UserInfoForm({ userInfo, onCompleted, onBack }: Props) {
  const [formData, setFormData] = useState<UserInfo>(userInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Handles input changes and updates form data.
   */
  function handleInputChange(field: keyof UserInfo, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  /**
   * Validates the form data.
   * @returns true if valid, false otherwise
   */
  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Handles form submission.
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validateForm()) {
      onCompleted(formData);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-neutral-900/60 p-8 backdrop-blur-sm">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Your Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-base font-medium text-slate-200"
            >
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full rounded-lg border bg-neutral-900 px-3 py-3 pl-12 text-base text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.name ? "border-red-500" : "border-white/10"
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-base font-medium text-slate-200"
            >
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full rounded-lg border bg-neutral-900 px-3 py-3 pl-12 text-base text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? "border-red-500" : "border-white/10"
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone Field (Optional) */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-base font-medium text-slate-200"
            >
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-3 pl-12 text-base text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your phone number (optional)"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-base font-medium text-slate-300 hover:bg-white/10 transition-colors"
        >
          Back to Calendar
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
