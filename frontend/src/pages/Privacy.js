import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Privacy = () => {
  return (
    <div className="bg-white pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-4 text-gray-500">Last Updated: December 1, 2023</p>
        </div>
        
        <div className="mt-12 prose prose-lg prose-primary mx-auto">
          <h2>1. Introduction</h2>
          <p>
            At Opinion Trading, we respect your privacy and are committed to protecting it through our compliance with this policy.
          </p>
          <p>
            This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit our website and use our services (collectively, the "Service") and our practices for collecting, using, maintaining, protecting, and disclosing that information.
          </p>
          
          <h2>2. Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our Service, including:
          </p>
          <ul>
            <li>
              <strong>Personal Information:</strong> This includes information that identifies you personally, such as your name, email address, and any other information you provide during registration or when using our Service.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use our Service, including your browsing actions, trading activities, and patterns.
            </li>
            <li>
              <strong>Device Information:</strong> Information about the device and internet connection you use to access our Service, including your IP address, browser type, operating system, and device identifiers.
            </li>
          </ul>
          
          <h2>3. How We Collect Your Information</h2>
          <p>
            We collect information:
          </p>
          <ul>
            <li>Directly from you when you register an account, use our Service, or communicate with us.</li>
            <li>Automatically as you navigate through our Service, using cookies, web beacons, and other tracking technologies.</li>
            <li>From third-party services that may provide authentication or analytics services.</li>
          </ul>
          
          <h2>4. How We Use Your Information</h2>
          <p>
            We use the information we collect about you or that you provide to us:
          </p>
          <ul>
            <li>To provide you with the Service and its contents, and any other information, products or services that you request from us.</li>
            <li>To fulfill any other purpose for which you provide it.</li>
            <li>To provide you with notices about your account.</li>
            <li>To improve our Service and user experience.</li>
            <li>To monitor and analyze trends, usage, and activities in connection with our Service.</li>
            <li>To detect, prevent, and address technical issues.</li>
          </ul>
          
          <h2>5. Disclosure of Your Information</h2>
          <p>
            We may disclose aggregated information about our users, and information that does not identify any individual, without restriction. We may disclose personal information that we collect or you provide as described in this privacy policy:
          </p>
          <ul>
            <li>To our subsidiaries and affiliates.</li>
            <li>To contractors, service providers, and other third parties we use to support our business.</li>
            <li>To comply with any court order, law, or legal process, including to respond to any government or regulatory request.</li>
            <li>To enforce or apply our Terms of Service and other agreements.</li>
            <li>If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of Opinion Trading, our users, or others.</li>
          </ul>
          
          <h2>6. Data Security</h2>
          <p>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, we cannot guarantee that unauthorized third parties will never be able to defeat those measures or use your personal information for improper purposes.
          </p>
          
          <h2>7. Your Choices About Our Collection, Use, and Disclosure of Your Information</h2>
          <p>
            You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. If you disable or refuse cookies, please note that some parts of the Service may then be inaccessible or not function properly.
          </p>
          <p>
            You can review and change your personal information by logging into the Service and visiting your account profile page.
          </p>
          
          <h2>8. Do Not Track Signals</h2>
          <p>
            We do not track our users over time and across third-party websites to provide targeted advertising. Accordingly, we do not currently respond to Do Not Track (DNT) signals.
          </p>
          
          <h2>9. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under 18 years of age, and we do not knowingly collect personal information from children under 18. If we learn we have collected or received personal information from a child under 18 without verification of parental consent, we will delete that information.
          </p>
          
          <h2>10. Changes to Our Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the Service. The date the privacy policy was last revised is identified at the top of the page.
          </p>
          
          <h2>11. Contact Information</h2>
          <p>
            To ask questions or comment about this Privacy Policy and our privacy practices, contact us at: <a href="mailto:privacy@opiniontrading.com" className="text-primary hover:underline">privacy@opiniontrading.com</a>.
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

export default Privacy; 