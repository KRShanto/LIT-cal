"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { type QuestionType } from "../types";

type Question = {
  idx: number;
  question: string;
  type: QuestionType;
  required: boolean;
  options: string[] | null;
};

type Props = {
  questions: Question[];
  onCompleted: (answers: Record<string, string>) => void;
  onBack: () => void;
};

/**
 * QuestionsForm
 * Component for collecting answers to event type questions.
 * Supports different question types: text, radio, checkbox, dropdown, phone.
 */
export default function QuestionsForm({
  questions,
  onCompleted,
  onBack,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Handles input changes for different question types.
   * @param questionId - The question identifier
   * @param value - The input value
   */
  function handleAnswerChange(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: "" }));
    }
  }

  /**
   * Validates all required questions are answered.
   * @returns True if all required questions are answered
   */
  function validateAnswers(): boolean {
    const newErrors: Record<string, string> = {};

    questions.forEach((question) => {
      if (question.required && !answers[question.idx.toString()]?.trim()) {
        newErrors[question.idx.toString()] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Handles form submission.
   * Validates answers and calls the completion callback.
   */
  function handleSubmit() {
    if (validateAnswers()) {
      onCompleted(answers);
    }
  }

  /**
   * Renders different input types based on question type.
   * @param question - The question object
   * @returns JSX element for the input
   */
  function renderQuestionInput(question: Question) {
    const questionId = question.idx.toString();
    const value = answers[questionId] || "";
    const error = errors[questionId];

    switch (question.type) {
      case "SHORT_TEXT":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            className={`mt-1 h-14 w-full rounded-lg border px-4 text-lg text-slate-100 outline-none focus:ring-2 focus:ring-primary ${
              error
                ? "border-red-400 bg-neutral-950"
                : "border-white/10 bg-neutral-950"
            }`}
            placeholder="Enter your answer"
          />
        );

      case "LONG_TEXT":
        return (
          <textarea
            value={value}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            rows={4}
            className={`mt-1 min-h-32 w-full rounded-lg border px-4 py-3 text-lg text-slate-100 outline-none focus:ring-2 focus:ring-primary ${
              error
                ? "border-red-400 bg-neutral-950"
                : "border-white/10 bg-neutral-950"
            }`}
            placeholder="Enter your answer"
          />
        );

      case "RADIO":
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={questionId}
                  value={option}
                  checked={value === option}
                  onChange={(e) =>
                    handleAnswerChange(questionId, e.target.value)
                  }
                  className="mr-2 text-primary focus:ring-primary"
                />
                <span className="text-base text-slate-300">{option}</span>
              </label>
            ))}
          </div>
        );

      case "CHECKBOX":
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => {
              const isChecked = value.split(",").includes(option);
              return (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const currentValues = value ? value.split(",") : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v) => v !== option);
                      handleAnswerChange(questionId, newValues.join(","));
                    }}
                    className="mr-2 text-primary focus:ring-primary"
                  />
                  <span className="text-base text-slate-300">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case "DROPDOWN":
        return (
          <select
            value={value}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            className={`mt-1 h-14 w-full rounded-lg border px-4 text-lg text-slate-100 outline-none focus:ring-2 focus:ring-primary ${
              error
                ? "border-red-400 bg-neutral-950"
                : "border-white/10 bg-neutral-950"
            }`}
          >
            <option value="">Select an option</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "PHONE":
        return (
          <input
            type="tel"
            value={value}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            className={`mt-1 h-14 w-full rounded-lg border px-4 text-lg text-slate-100 outline-none focus:ring-2 focus:ring-primary ${
              error
                ? "border-red-400 bg-neutral-950"
                : "border-white/10 bg-neutral-950"
            }`}
            placeholder="Enter your phone number"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            className={`mt-1 h-14 w-full rounded-lg border px-4 text-lg text-slate-100 outline-none focus:ring-2 focus:ring-primary ${
              error
                ? "border-red-400 bg-neutral-950"
                : "border-white/10 bg-neutral-950"
            }`}
            placeholder="Enter your answer"
          />
        );
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-white/10 p-6">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="p-3 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold text-white">
              Additional Information
            </h3>
          </div>

          <div className="space-y-8">
            {questions.map((question) => (
              <div key={question.idx} className="space-y-4">
                <label className="text-lg font-medium text-slate-200">
                  {question.question}
                  {question.required && (
                    <span className="text-red-400 ml-2">*</span>
                  )}
                </label>

                {renderQuestionInput(question)}

                {errors[question.idx.toString()] && (
                  <p className="text-base text-red-400 mt-2">
                    {errors[question.idx.toString()]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-base font-medium text-slate-300 hover:bg-white/10 transition-colors"
            >
              Back
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
      </div>
    </div>
  );
}
