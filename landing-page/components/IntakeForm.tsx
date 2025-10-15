"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IntakeFormData, intakeFormSchema } from "@/lib/validation";

export default function IntakeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
  });

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred while submitting the form"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <svg
          className="mx-auto h-16 w-16 text-green-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-green-900 mb-2">
          Thank You for Your Submission
        </h2>
        <p className="text-green-700 mb-6">
          We have received your case information and will review it promptly. A qualified 
          attorney from our network will contact you within 1-2 business days to discuss 
          your case further.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Submit Another Case
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              {...register("fullName")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Incident Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Details</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 mb-1">
              Type of Incident *
            </label>
            <select
              id="incidentType"
              {...register("incidentType")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select incident type...</option>
              <option value="auto">Auto Accident</option>
              <option value="trucking">Trucking Accident</option>
              <option value="catastrophic">Catastrophic Injury</option>
              <option value="workplace">Workplace Injury</option>
              <option value="other">Other Personal Injury</option>
            </select>
            {errors.incidentType && (
              <p className="mt-1 text-sm text-red-600">{errors.incidentType.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Incident *
              </label>
              <input
                type="date"
                id="incidentDate"
                {...register("incidentDate")}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.incidentDate && (
                <p className="mt-1 text-sm text-red-600">{errors.incidentDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="incidentLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Location (City, State) *
              </label>
              <input
                type="text"
                id="incidentLocation"
                {...register("incidentLocation")}
                placeholder="Dallas, TX"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.incidentLocation && (
                <p className="mt-1 text-sm text-red-600">{errors.incidentLocation.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Brief Description of What Happened *
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={5}
              placeholder="Please describe the incident, how it occurred, and any relevant details..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Injury Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Injury Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="injurySeverity" className="block text-sm font-medium text-gray-700 mb-1">
              Injury Severity *
            </label>
            <select
              id="injurySeverity"
              {...register("injurySeverity")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select severity...</option>
              <option value="minor">Minor (Full recovery expected)</option>
              <option value="moderate">Moderate (Some lasting effects)</option>
              <option value="severe">Severe (Significant impairment)</option>
              <option value="catastrophic">Catastrophic (Life-altering)</option>
            </select>
            {errors.injurySeverity && (
              <p className="mt-1 text-sm text-red-600">{errors.injurySeverity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("medicalTreatment")}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                I have received or am receiving medical treatment
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("hospitalized")}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                I was hospitalized due to this incident
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Insurance Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
        
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("hasInsurance")}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              The at-fault party has insurance (if known)
            </span>
          </label>

          <div>
            <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Provider (if known)
            </label>
            <input
              type="text"
              id="insuranceProvider"
              {...register("insuranceProvider")}
              placeholder="e.g., State Farm, Allstate, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("hasAttorney")}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              I currently have an attorney representing me
            </span>
          </label>
        </div>
      </div>

      {/* Consent & Disclaimers */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Consent & Acknowledgments</h3>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                {...register("consentToContact")}
                className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                I consent to being contacted by Crosley Referral Law Group, PLLC or a partner 
                attorney regarding my case via phone, email, or text message. *
              </span>
            </label>
            {errors.consentToContact && (
              <p className="mt-1 text-sm text-red-600">{errors.consentToContact.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                {...register("consentToReferral")}
                className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                I understand and consent to my case being referred to a qualified partner attorney 
                under Texas Disciplinary Rules of Professional Conduct Rule 1.04(f), and that a 
                referral fee may be paid to Crosley Referral Law Group, PLLC from the attorney&apos;s fees. *
              </span>
            </label>
            {errors.consentToReferral && (
              <p className="mt-1 text-sm text-red-600">{errors.consentToReferral.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                {...register("acknowledgeDisclaimer")}
                className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                I acknowledge that submission of this form does not create an attorney-client 
                relationship and that the information provided is not legal advice. I have read 
                and understood the disclaimers on this website. *
              </span>
            </label>
            {errors.acknowledgeDisclaimer && (
              <p className="mt-1 text-sm text-red-600">{errors.acknowledgeDisclaimer.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Case Information"}
        </button>
      </div>
    </form>
  );
}

