export default function Disclaimer() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Attorney Advertising & Important Disclaimers
          </h3>
          <div className="mt-2 text-sm text-yellow-700 space-y-2">
            <p>
              <strong>No Attorney-Client Relationship:</strong> Submission of information through this 
              website does not create an attorney-client relationship with Crosley Referral Law Group, PLLC 
              or any partner law firm. An attorney-client relationship is only formed through a signed 
              engagement agreement with the attorney who agrees to represent you.
            </p>
            <p>
              <strong>Not Legal Advice:</strong> The information provided on this website is for general 
              informational purposes only and does not constitute legal advice. Do not rely on this 
              information as a substitute for consultation with a qualified attorney about your specific situation.
            </p>
            <p>
              <strong>Referral Disclosure:</strong> Crosley Referral Law Group, PLLC is a licensed attorney 
              referral service operating under Texas Disciplinary Rules of Professional Conduct Rule 1.04(f). 
              We refer cases to qualified partner law firms and may receive a referral fee from the attorney's 
              professional fees. All referrals require informed client consent and comply with applicable bar rules.
            </p>
            <p>
              <strong>Case Results:</strong> Past results do not guarantee or predict future outcomes. 
              Every case is unique and must be evaluated on its own merits.
            </p>
            <p>
              <strong>Confidentiality Notice:</strong> While we take measures to protect your information, 
              please be aware that information transmitted via the internet may not be completely secure. 
              Do not include sensitive or confidential information in your initial submission.
            </p>
            <p className="text-xs mt-3 text-yellow-600">
              By submitting your information, you acknowledge that you have read and understood these 
              disclaimers and consent to being contacted by Crosley Referral Law Group, PLLC or a partner 
              attorney regarding your potential case.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

