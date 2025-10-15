import { z } from "zod";

export const intakeFormSchema = z.object({
  // Contact Information
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").regex(/^[\d\s\-\(\)\+]+$/, "Invalid phone format"),
  
  // Incident Details
  incidentType: z.enum(["auto", "trucking", "catastrophic", "workplace", "other"], {
    errorMap: () => ({ message: "Please select an incident type" }),
  }),
  incidentDate: z.string().min(1, "Incident date is required"),
  incidentLocation: z.string().min(3, "Please provide the incident location"),
  
  // Case Description
  description: z.string()
    .min(20, "Please provide at least 20 characters describing your case")
    .max(2000, "Description too long (max 2000 characters)"),
  
  // Injury Information
  injurySeverity: z.enum(["minor", "moderate", "severe", "catastrophic"], {
    errorMap: () => ({ message: "Please select injury severity" }),
  }),
  medicalTreatment: z.boolean(),
  hospitalized: z.boolean(),
  
  // Insurance (optional)
  hasInsurance: z.boolean(),
  insuranceProvider: z.string().optional(),
  
  // Legal Representation
  hasAttorney: z.boolean(),
  
  // Consent
  consentToContact: z.boolean().refine((val) => val === true, {
    message: "You must consent to be contacted",
  }),
  consentToReferral: z.boolean().refine((val) => val === true, {
    message: "You must consent to the referral terms under Texas Rule 1.04(f)",
  }),
  acknowledgeDisclaimer: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge the disclaimer",
  }),
});

export type IntakeFormData = z.infer<typeof intakeFormSchema>;

