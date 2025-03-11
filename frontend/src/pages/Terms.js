import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Terms = () => {
  return (
    <div className="bg-white pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Terms of Service</h1>
          <p className="mt-4 text-gray-500">Last Updated: December 1, 2023</p>
        </div>
        
        <div className="mt-12 prose prose-lg prose-primary mx-auto">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Opinion Trading platform and services (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
          </p>
          
          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you have the legal capacity to enter into a binding agreement with us and are not prohibited from using the Service under the laws of your jurisdiction.
          </p>
          
          <h2>3. Account Registration</h2>
          <p>
            To access certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p>
            You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
          
          <h2>4. Platform Credits and Trading</h2>
          <p>
            The Service uses platform credits for virtual trading purposes. These credits:
          </p>
          <ul>
            <li>Hold no real-world monetary value</li>
            <li>Cannot be exchanged for real currency</li>
            <li>Are solely for use within the Opinion Trading platform</li>
            <li>May be granted as part of account creation, through periodic bonuses, or through other platform activities</li>
          </ul>
          <p>
            Opinion Trading is not a gambling platform. No real money is wagered or can be won. All trading activities are for entertainment and educational purposes only.
          </p>
          
          <h2>5. Prohibited Conduct</h2>
          <p>
            You agree not to:
          </p>
          <ul>
            <li>Use the Service for any illegal purpose or in violation of any local, state, national, or international law</li>
            <li>Violate or encourage others to violate the rights of third parties, including intellectual property rights</li>
            <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
            <li>Attempt to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Service</li>
            <li>Use any robot, spider, crawler, scraper, or other automated means to access the Service</li>
            <li>Create multiple accounts or engage in activities designed to manipulate the trading markets</li>
          </ul>
          
          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Opinion Trading and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>
          
          <h2>7. User Content</h2>
          <p>
            You retain ownership of any content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future media.
          </p>
          
          <h2>8. Event Resolution</h2>
          <p>
            For each event on the platform, Opinion Trading will:
          </p>
          <ul>
            <li>Define clear resolution criteria at the time of event creation</li>
            <li>Resolve events based solely on the stated criteria</li>
            <li>Publish the resolution outcome and distribute platform credits accordingly</li>
          </ul>
          <p>
            In cases of ambiguity or dispute, Opinion Trading's determination of event outcomes will be final.
          </p>
          
          <h2>9. Limitation of Liability</h2>
          <p>
            In no event shall Opinion Trading, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
          
          <h2>10. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Opinion Trading, its officers, directors, employees and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses arising from your use of and access to the Service.
          </p>
          
          <h2>11. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.
          </p>
          
          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of the United States, without respect to its conflict of laws principles.
          </p>
          
          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          
          <h2>14. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:support@opiniontrading.com" className="text-primary hover:underline">support@opiniontrading.com</a>.
          </p>
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms; 