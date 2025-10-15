"use client";

import { useState } from "react";

export default function Disclaimer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gray-600">
            Legal Disclaimers & Important Information
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center transition-colors"
        >
          {isExpanded ? "Hide Details" : "Show Details"}
          <svg 
            className={`ml-1 h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 space-y-3">
            <div>
              <strong className="text-gray-700">No Attorney-Client Relationship:</strong> Submission of information through this 
              website does not create an attorney-client relationship with Crosley Referral Law Group, PLLC 
              or any partner law firm. An attorney-client relationship is only formed through a signed 
              engagement agreement with the attorney who agrees to represent you.
            </div>
            <div>
              <strong className="text-gray-700">Not Legal Advice:</strong> The information provided on this website is for general 
              informational purposes only and does not constitute legal advice. Do not rely on this 
              information as a substitute for consultation with a qualified attorney about your specific situation.
            </div>
            <div>
              <strong className="text-gray-700">Referral Disclosure:</strong> Crosley Referral Law Group, PLLC is a licensed attorney 
              referral service operating under Texas Disciplinary Rules of Professional Conduct Rule 1.04(f). 
              We refer cases to qualified partner law firms and may receive a referral fee from the attorney&apos;s 
              professional fees. All referrals require informed client consent and comply with applicable bar rules.
            </div>
            <div>
              <strong className="text-gray-700">Case Results:</strong> Past results do not guarantee or predict future outcomes. 
              Every case is unique and must be evaluated on its own merits.
            </div>
            <div>
              <strong className="text-gray-700">Confidentiality Notice:</strong> While we take measures to protect your information, 
              please be aware that information transmitted via the internet may not be completely secure. 
              Do not include sensitive or confidential information in your initial submission.
            </div>
            <div className="pt-2 text-gray-500">
              By submitting your information, you acknowledge that you have read and understood these 
              disclaimers and consent to being contacted by Crosley Referral Law Group, PLLC or a partner 
              attorney regarding your potential case.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

