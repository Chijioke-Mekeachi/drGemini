import { Link } from 'react-router-dom';
import { Stethoscope, BrainCircuit, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center text-center transition-colors duration-300">
    <div className="bg-brand-blue-light dark:bg-brand-blue-dark p-4 rounded-full mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-brand-blue-dark dark:text-white mb-2">{title}</h3>
    <p className="text-brand-gray-dark dark:text-gray-300">{description}</p>
  </div>
);

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or saved theme
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                  (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun size={20} className="text-yellow-500" />
        ) : (
          <Moon size={20} className="text-gray-700" />
        )}
      </button>

      <header className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-bold text-brand-blue-dark dark:text-white mb-4 transition-colors duration-300">
          Welcome to Dr. Gemini
        </h1>
        <p className="text-lg sm:text-xl text-brand-gray-dark dark:text-gray-300 mb-8 transition-colors duration-300">
          Your intelligent AI-powered health companion. Get instant, empathetic, and informative answers to your health questions.
        </p>
        <Link 
          to="/chat" 
          className="bg-brand-blue hover:bg-brand-blue-dark dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
        >
          Start Consultation
        </Link>
        <p className="text-sm text-brand-gray dark:text-gray-400 mt-4 transition-colors duration-300">
          New users get $5.00 in free credits!
        </p>
      </header>

      <section className="mt-16 sm:mt-24 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-10 text-brand-blue-dark dark:text-white transition-colors duration-300">
          Why Choose Dr. Gemini?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Stethoscope size={32} className="text-brand-blue-dark dark:text-white" />} 
            title="Instant Health Chat"
            description="Engage in general health conversations or get a detailed analysis of your symptoms instantly."
          />
          <FeatureCard 
            icon={<BrainCircuit size={32} className="text-brand-blue-dark dark:text-white" />} 
            title="Powered by Gemini-Pro"
            description="Leveraging Google's advanced AI to provide you with clear, responsible, and helpful information."
          />
          <FeatureCard 
            icon={<ShieldCheck size={32} className="text-brand-blue-dark dark:text-white" />} 
            title="Secure & Private"
            description="Your conversations are confidential. We prioritize your privacy and data security."
          />
        </div>
      </section>

      {/* Testimony Section */}
      <section className="mt-16 sm:mt-24 w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-brand-blue-dark dark:text-white mb-6 transition-colors duration-300">
            User Testimony
          </h2>
          <div className="text-left">
            <p className="text-lg text-brand-gray-dark dark:text-gray-300 italic mb-4 transition-colors duration-300">
              "Dr. Gemini has been an incredible resource for my family's health concerns. The AI provides thoughtful, 
              well-researched responses that have helped us make better healthcare decisions. It's like having a 
              medical professional available 24/7. The symptom analysis feature is particularly impressive - it helped 
              me identify when my son's cough needed immediate medical attention versus when it was just a common cold."
            </p>
            <p className="text-brand-blue-dark dark:text-blue-400 font-semibold transition-colors duration-300">
              - Juex, satisfied user since 2024
            </p>
          </div>
        </div>
      </section>

      {/* Made By Section */}
      <footer className="mt-12 py-6 w-full border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <p className="text-brand-gray dark:text-gray-400 text-sm transition-colors duration-300">
          made by juex
        </p>
      </footer>
    </div>
  );
}