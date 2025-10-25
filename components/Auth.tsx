import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import LogoIcon from './icons/LogoIcon';

interface AuthProps {
    configurationError?: string | null;
    onBackToHome?: () => void;
}

const Auth: React.FC<AuthProps> = ({ configurationError, onBackToHome }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (!supabase) throw new Error("Supabase client is not available.");
            let authResponse;
            if (isSignUp) {
                authResponse = await supabase.auth.signUp({ email, password });
            } else {
                authResponse = await supabase.auth.signInWithPassword({ email, password });
            }
            if (authResponse.error) throw authResponse.error;
        } catch (error: any) {
            setError(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
                <LogoIcon className="h-10 w-10 text-white" />
                <h1 className="text-3xl font-bold text-white">Reflect</h1>
            </div>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
                 {configurationError 
                    ? 'The backend is not configured.' 
                    : 'Sign in to create and manage your portfolio. Your work will be saved to your account.'
                }
            </p>

            <div className="w-full max-w-sm p-8 space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                {configurationError ? (
                    <div>
                        <h2 className="text-2xl font-bold text-red-400">Configuration Error</h2>
                        <p className="mt-4 text-sm text-gray-300">The application is not connected to a backend. Please follow the setup instructions in the `README.md` file and update `lib/supabaseClient.ts`.</p>
                        <div className="mt-4 p-3 bg-black/30 rounded-md text-left text-xs text-red-300 overflow-x-auto">
                            <code>{configurationError}</code>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-white">{isSignUp ? 'Create an Account' : 'Sign In'}</h2>
                        <form className="space-y-4" onSubmit={handleAuth}>
                            <div>
                                <input
                                    id="email"
                                    className="w-full px-4 py-2 text-white bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    id="password"
                                    className="w-full px-4 py-2 text-white bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    type="password"
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-accent text-white hover:bg-accent/90 font-bold py-2.5 px-4 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/50 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? <span>Loading...</span> : <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>}
                                </button>
                            </div>
                        </form>
                        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
                        
                        <p className="text-sm text-gray-400">
                            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                            <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-accent hover:underline">
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </>
                )}
            </div>
            {onBackToHome && (
                <button onClick={onBackToHome} className="mt-6 text-sm text-gray-400 hover:text-white transition-colors">
                    &larr; Back to Home
                </button>
            )}
             <footer className="absolute bottom-4 text-gray-500 text-sm">
                Powered by Gemini & Supabase
            </footer>
        </div>
    );
};

export default Auth;