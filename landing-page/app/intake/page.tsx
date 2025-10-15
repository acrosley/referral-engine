import IntakeForm from "@/components/IntakeForm";
import Disclaimer from "@/components/Disclaimer";

export const metadata = {
  title: "Case Intake Form | Crosley Referral Law Group",
  description: "Submit your personal injury case information for review and connection to qualified legal representation.",
};

export default function IntakePage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Case Intake Form
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Please provide detailed information about your case. All fields marked with * are required.
            This information will be kept confidential and used solely for case evaluation and referral purposes.
          </p>
        </div>

        <div className="mb-8">
          <Disclaimer />
        </div>

        <IntakeForm />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            What Happens Next?
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Your submission will be reviewed by our team within 1 business day</li>
            <li>We&apos;ll evaluate your case using our AI-assisted screening system</li>
            <li>If your case qualifies, we&apos;ll match you with an appropriate partner attorney</li>
            <li>The partner attorney will contact you directly to discuss representation</li>
            <li>You&apos;ll receive regular updates on your case status through our tracking system</li>
          </ol>
          <p className="mt-4 text-sm text-blue-700">
            <strong>Questions?</strong> If you need immediate assistance or have questions about the 
            intake process, please call us at (555) 123-4567.
          </p>
        </div>
      </div>
    </div>
  );
}

