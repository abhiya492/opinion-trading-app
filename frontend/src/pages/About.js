import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative py-16 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">About Opinion Trading</h1>
            <p className="max-w-3xl mt-5 mx-auto text-xl text-gray-600">
              Revolutionizing how people express and profit from their views on the world.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Story
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-600">
                Opinion Trading was born from a simple idea: what if people could put their money where their mouth is on any topic they feel strongly about?
              </p>
              <p className="mt-3 max-w-3xl text-lg text-gray-600">
                Founded in 2025 by Abhishek, we set out to create a platform that allows individuals to trade on their convictions about future events, from political outcomes to technological developments, sports results to entertainment predictions.
              </p>
              <p className="mt-3 max-w-3xl text-lg text-gray-600">
                Our mission is to create the most accurate prediction markets in the world by harnessing the wisdom of crowds and putting real stakes behind opinions.
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-primary-50 rounded-xl overflow-hidden shadow-xl p-4">
                <img
                  className="w-full"
                  src="/images/team.svg"
                  alt="Our innovative team"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              How Opinion Trading Works
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto">
              Our platform is designed to be intuitive and accessible to everyone, whether you're an experienced trader or just starting out.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Event Creation</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Our team curates events based on current affairs, trends, and user suggestions. Each event has a clear resolution criteria and timeline.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Market Mechanics</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Each event has a market with options to trade on. The price of each option reflects the market's estimate of the probability of that outcome.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Trading & Payouts</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Users can buy and sell positions using our platform currency. When an event is resolved, users with correct predictions receive payouts.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Real-time Updates</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Our platform provides real-time updates on market movements, allowing you to make informed decisions based on the latest information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto">
              Have questions? We've got answers.
            </p>
          </div>

          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div>
                <dt className="text-lg font-medium text-gray-900">Is Opinion Trading gambling?</dt>
                <dd className="mt-2 text-base text-gray-600">
                  No, Opinion Trading is a prediction market platform. Unlike gambling, success on our platform depends on your knowledge, research, and insight—not luck. You're making informed predictions based on real-world information.
                </dd>
              </div>

              <div>
                <dt className="text-lg font-medium text-gray-900">How do I get started?</dt>
                <dd className="mt-2 text-base text-gray-600">
                  Simply sign up for an account, verify your email, and you'll receive starter credits to begin trading. Browse our available events, research the options, and place your first trade!
                </dd>
              </div>

              <div>
                <dt className="text-lg font-medium text-gray-900">How are events resolved?</dt>
                <dd className="mt-2 text-base text-gray-600">
                  Each event has clear resolution criteria defined at the time of creation. When the outcome is determined based on these criteria, the market is resolved and winners receive their payouts.
                </dd>
              </div>

              <div>
                <dt className="text-lg font-medium text-gray-900">Can I suggest events?</dt>
                <dd className="mt-2 text-base text-gray-600">
                  Yes! We encourage user input. You can suggest events through your account dashboard, and our team reviews all suggestions for potential inclusion on the platform.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to test your predictions?</span>
            <span className="block text-indigo-200">Join our community of opinion traders today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/register">
                <Button variant="light" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/login">
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary" size="lg">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 