import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';

const Landing = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-50 to-primary-50">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-y-0 right-1/2 w-screen bg-white" aria-hidden="true"></div>
          <svg
            className="absolute -ml-3 top-8 left-1/2 transform -translate-x-1/2 lg:top-auto lg:bottom-1/2 lg:translate-y-1/2"
            width="404"
            height="392"
            fill="none"
            viewBox="0 0 404 392"
          >
            <defs>
              <pattern
                id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" className="text-primary-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="392" fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12 md:pt-16 lg:px-8 lg:pt-20 xl:pt-28">
              <div className="text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block animate__animated animate__fadeInUp">Trade on</span>
                  <span className="block text-primary-600 xl:inline animate__animated animate__fadeInUp animate__delay-1s">Opinions, Not Just Markets</span>
              </h1>
                <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0 animate__animated animate__fadeIn animate__delay-2s">
                The first platform that lets you trade on the outcome of events, trends, and predictions. Turn your insights into profits.
              </p>
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:gap-4 animate__animated animate__fadeInUp animate__delay-3s">
                {user ? (
                  <Link to="/dashboard">
                      <Button size="lg" className="shadow-md w-full sm:w-auto">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                    <>
                      <Link to="/register" className="w-full sm:w-auto">
                        <Button size="lg" className="shadow-md w-full sm:w-auto">
                        Get Started
                      </Button>
                    </Link>
                      <div className="mt-3 sm:mt-0">
                        <Link to="/login" className="w-full sm:w-auto">
                          <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Log In
                      </Button>
                    </Link>
                  </div>
                    </>
                )}
              </div>
            </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 transform transition-all duration-700 hover:scale-105">
          <img
            className="h-56 w-full object-contain sm:h-72 md:h-96 lg:h-full lg:w-full lg:object-cover animate__animated animate__fadeIn animate__delay-2s"
            src="/images/hero-illustration.svg"
            alt="Trading illustration"
          />
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Trade on Opinion Trading?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              A new way to participate in the marketplace of ideas.
            </p>
            <div className="mt-6 w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 hover-lift hover:border-primary-500 hover:border transition-all">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-4">Diverse Events</h3>
              <p className="text-gray-600 text-center">
                Trade on politics, sports, entertainment, technology, and more. If people have opinions about it, you can trade on it.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 hover-lift hover:border-primary-500 hover:border transition-all">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-4">Real-Time Odds</h3>
              <p className="text-gray-600 text-center">
                See odds change in real-time as more traders place their bets, giving you immediate feedback on market sentiment.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 hover-lift hover:border-primary-500 hover:border transition-all">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-4">Secure Trading</h3>
              <p className="text-gray-600 text-center">
                Our platform uses advanced security measures to ensure your trades and personal information are protected.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Trading on opinions has never been easier.
            </p>
            <div className="mt-6 w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative text-center transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-2 -left-2 md:left-auto md:right-0 md:-top-2 lg:left-1/2 lg:-top-6 lg:transform lg:-translate-x-1/2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white shadow-lg">1</span>
              </div>
              <div className="pt-8 pb-6 px-6 bg-white rounded-lg shadow-md h-full group hover:shadow-card-hover">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
            </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Sign Up</h3>
                <p className="text-gray-600">
                  Create your account in under a minute and get started with opinion trading
                </p>
              </div>
            </div>
            
            <div className="relative text-center transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-2 -left-2 md:left-auto md:right-0 md:-top-2 lg:left-1/2 lg:-top-6 lg:transform lg:-translate-x-1/2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white shadow-lg">2</span>
              </div>
              <div className="pt-8 pb-6 px-6 bg-white rounded-lg shadow-md h-full group hover:shadow-card-hover">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Browse Events</h3>
                <p className="text-gray-600">
                  Find events and topics that interest you and where you have valuable insights
                </p>
              </div>
            </div>
            
            <div className="relative text-center transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-2 -left-2 md:left-auto md:right-0 md:-top-2 lg:left-1/2 lg:-top-6 lg:transform lg:-translate-x-1/2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white shadow-lg">3</span>
              </div>
              <div className="pt-8 pb-6 px-6 bg-white rounded-lg shadow-md h-full group hover:shadow-card-hover">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Place Trades</h3>
                <p className="text-gray-600">
                  Take positions based on your predictions and watch the market respond in real-time
                </p>
              </div>
            </div>
            
            <div className="relative text-center transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-2 -left-2 md:left-auto md:right-0 md:-top-2 lg:left-1/2 lg:-top-6 lg:transform lg:-translate-x-1/2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white shadow-lg">4</span>
              </div>
              <div className="pt-8 pb-6 px-6 bg-white rounded-lg shadow-md h-full group hover:shadow-card-hover">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Collect Winnings</h3>
                <p className="text-gray-600">
                  When events resolve, your correct predictions turn into rewards you can withdraw
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link to="/register">
              <Button size="lg" className="px-8 py-4 text-lg shadow-lg">Start Trading Now</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Trending Events Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trending Events
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Here are some of the hottest predictions being traded right now.
            </p>
            <div className="mt-6 w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover-lift border border-gray-100">
              <div className="h-3 bg-primary-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-gray-500">POLITICS</span>
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">Hot</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Democrats Win 2024 US Election</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Current Odds</span>
                    <span className="font-bold text-primary-700">53% Yes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '53%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">24,156 traders</span>
                  <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Trade Now →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover-lift border border-gray-100">
              <div className="h-3 bg-success-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-gray-500">CRYPTO</span>
                  <span className="text-xs px-2 py-1 bg-success-100 text-success-800 rounded-full">Trending</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Bitcoin Reaches $100k by 2025</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Current Odds</span>
                    <span className="font-bold text-success-700">76% Yes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-success-600 h-2.5 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">18,923 traders</span>
                  <Link to="/dashboard" className="text-success-600 hover:text-success-700 text-sm font-medium">
                    Trade Now →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover-lift border border-gray-100">
              <div className="h-3 bg-warning-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-gray-500">TECH</span>
                  <span className="text-xs px-2 py-1 bg-warning-100 text-warning-800 rounded-full">Active</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Apple Releases AR Glasses in 2024</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Current Odds</span>
                    <span className="font-bold text-warning-700">42% Yes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-warning-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">15,742 traders</span>
                  <Link to="/dashboard" className="text-warning-600 hover:text-warning-700 text-sm font-medium">
                    Trade Now →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover-lift border border-gray-100">
              <div className="h-3 bg-secondary-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-gray-500">ENTERTAINMENT</span>
                  <span className="text-xs px-2 py-1 bg-secondary-100 text-secondary-800 rounded-full">New</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Taylor Swift Announces Retirement</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Current Odds</span>
                    <span className="font-bold text-secondary-700">8% Yes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-secondary-600 h-2.5 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">9,312 traders</span>
                  <Link to="/dashboard" className="text-secondary-600 hover:text-secondary-700 text-sm font-medium">
                    Trade Now →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover-lift border border-gray-100">
              <div className="h-3 bg-purple-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-gray-500">SCIENCE</span>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">Speculative</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">First Human Landing on Mars by 2030</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Current Odds</span>
                    <span className="font-bold text-purple-700">34% Yes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '34%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">21,087 traders</span>
                  <Link to="/dashboard" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Trade Now →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover-lift border border-gray-100">
              <div className="h-3 bg-blue-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-gray-500">ENVIRONMENT</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Important</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Global Emissions Peak by 2025</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Current Odds</span>
                    <span className="font-bold text-blue-700">22% Yes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">13,572 traders</span>
                  <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Trade Now →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover-lift border border-gray-100">
              <div className="h-3 bg-pink-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-gray-500">SPORTS</span>
                  <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full">Exciting</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">USA Wins Most Gold Medals at Olympics</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Current Odds</span>
                    <span className="font-bold text-pink-700">67% Yes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">17,246 traders</span>
                  <Link to="/dashboard" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                    Trade Now →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover-lift border border-gray-100">
              <div className="h-3 bg-indigo-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-gray-500">ECONOMICS</span>
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">Crucial</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Recession in 2024</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Current Odds</span>
                    <span className="font-bold text-indigo-700">48% Yes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '48%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">27,839 traders</span>
                  <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Trade Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/dashboard">
              <Button variant="primary" size="lg" className="shadow-lg">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute left-0 top-0 h-full" width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.5">
              <circle cx="300" cy="300" r="300" fill="white" />
              <circle cx="300" cy="300" r="250" fill="url(#paint0_linear)" />
              <circle cx="300" cy="300" r="200" fill="url(#paint1_linear)" />
              <circle cx="300" cy="300" r="150" fill="url(#paint2_linear)" />
              <circle cx="300" cy="300" r="100" fill="url(#paint3_linear)" />
              <circle cx="300" cy="300" r="50" fill="white" />
            </g>
            <defs>
              <linearGradient id="paint0_linear" x1="300" y1="50" x2="300" y2="550" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint1_linear" x1="300" y1="100" x2="300" y2="500" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint2_linear" x1="300" y1="150" x2="300" y2="450" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint3_linear" x1="300" y1="200" x2="300" y2="400" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
                <span className="block text-primary-200">Join thousands of traders today.</span>
          </h2>
              <p className="mt-4 text-lg leading-6 text-primary-100">
                Start trading on opinions, events, and predictions that matter to you. Our platform lets you turn your insights into profits with a simple, intuitive interface.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                  <Button variant="light" size="lg" className="shadow-lg w-full sm:w-auto">
                    Get Started Free
                </Button>
              </Link>
              <Link to="/about">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-transparent text-white border-white hover:bg-white hover:text-primary-700 shadow-lg w-full sm:w-auto"
                  >
                  Learn More
                </Button>
              </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 transform transition-all duration-500 hover:scale-105">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-2xl p-6 sm:p-10">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Latest Trading Events</h3>
                  <div className="space-y-4">
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex justify-between">
                        <span className="text-white font-medium">US Election 2024</span>
                        <span className="text-primary-200">64% Yes</span>
                      </div>
                      <div className="mt-2 w-full h-2 bg-primary-200/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-200 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex justify-between">
                        <span className="text-white font-medium">Bitcoin {'>'}$100k</span>
                        <span className="text-primary-200">38% Yes</span>
                      </div>
                      <div className="mt-2 w-full h-2 bg-primary-200/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-200 rounded-full" style={{ width: '38%' }}></div>
                      </div>
                    </div>
                  </div>
                  <Link to="/dashboard" className="mt-6 inline-block text-primary-100 hover:text-white">
                    See all events →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 