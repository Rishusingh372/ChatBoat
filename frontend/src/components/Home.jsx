import React from 'react';

const Home = ({ navigateTo, isLoggedIn }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="text-white">
            <h1 className="text-4xl font-bold">BotSpoof</h1>
            <p className="text-indigo-200 mt-2">Your AI Chat Assistant</p>
          </div>
          <div className="flex space-x-4">
            {isLoggedIn ? (
              <button 
                onClick={() => navigateTo('bot')}
                className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                Go to Chat
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigateTo('login')}
                  className="px-6 py-2 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigateTo('register')}
                  className="px-6 py-2 bg-white text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-5xl font-bold text-white mb-6">
              Intelligent Conversations with AI
            </h2>
            <p className="text-indigo-200 text-lg mb-8">
              BotSpoof is an advanced AI chatbot that can help you with programming concepts, 
              interview preparation, general knowledge, and much more.
            </p>
            <div className="flex flex-wrap gap-4">
              {isLoggedIn ? (
                <button 
                  onClick={() => navigateTo('bot')}
                  className="px-8 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                >
                  Start Chatting
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => navigateTo('register')}
                    className="px-8 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Get Started Free
                  </button>
                  <button 
                    onClick={() => navigateTo('login')}
                    className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-indigo-700 transition-colors"
                  >
                    Try Demo
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center p-6 border border-white/20">
                <div className="w-full h-full bg-gray-900 rounded-2xl p-4 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-3">
                    <div className="bg-indigo-600 text-white p-3 rounded-xl self-start max-w-[75%]">
                      Hi, how can I help you today?
                    </div>
                    <div className="bg-gray-800 text-white p-3 rounded-xl self-end max-w-[75%]">
                      What is recursion in programming?
                    </div>
                    <div className="bg-indigo-600 text-white p-3 rounded-xl self-start max-w-[75%]">
                      Recursion is when a function calls itself to solve smaller parts of a problem...
                    </div>
                  </div>
                  <div className="mt-4 flex">
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      className="flex-1 bg-gray-800 text-white rounded-l-lg px-4 py-2 outline-none"
                    />
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg">
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center">
                <div className="w-20 h-20 bg-green-500/30 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-robot text-white text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-code text-white text-2xl"></i>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Programming Help</h3>
            <p className="text-indigo-200">Get explanations for programming concepts and code examples.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-graduation-cap text-white text-2xl"></i>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Interview Prep</h3>
            <p className="text-indigo-200">Practice common interview questions and improve your answers.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-comments text-white text-2xl"></i>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Smart Conversations</h3>
            <p className="text-indigo-200">Engage in natural conversations with our advanced AI.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;