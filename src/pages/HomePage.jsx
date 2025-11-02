import { Link } from 'react-router-dom';
import { Stethoscope, BrainCircuit, ShieldCheck } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
    <div className="bg-brand-blue-light p-4 rounded-full mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-brand-blue-dark mb-2">{title}</h3>
    <p className="text-brand-gray-dark">{description}</p>
  </div>
);

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center p-4 sm:p-8">
      <header className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-bold text-brand-blue-dark mb-4">
          Welcome to Dr. Gemini
        </h1>
        <p className="text-lg sm:text-xl text-brand-gray-dark mb-8">
          Your intelligent AI-powered health companion. Get instant, empathetic, and informative answers to your health questions.
        </p>
        <Link 
          to="/chat" 
          className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          Start Consultation
        </Link>
        <p className="text-sm text-brand-gray mt-4">New users get $5.00 in free credits!</p>
      </header>

      <section className="mt-16 sm:mt-24 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Dr. Gemini?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Stethoscope size={32} className="text-brand-blue-dark" />} 
            title="Instant Health Chat"
            description="Engage in general health conversations or get a detailed analysis of your symptoms instantly."
          />
          <FeatureCard 
            icon={<BrainCircuit size={32} className="text-brand-blue-dark" />} 
            title="Powered by Gemini-Pro"
            description="Leveraging Google's advanced AI to provide you with clear, responsible, and helpful information."
          />
          <FeatureCard 
            icon={<ShieldCheck size={32} className="text-brand-blue-dark" />} 
            title="Secure & Private"
            description="Your conversations are confidential. We prioritize your privacy and data security."
          />
        </div>
      </section>
    </div>
  );
}
