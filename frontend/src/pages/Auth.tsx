import { useState, useEffect } from 'react';
import { SearchIcon , GoogleIcon ,GitHubIcon } from '../components/svgs/AuthIcons';
import { supabase } from '../utils/supabase';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router';
import { useToast } from '../lib/ToastContext';

export default function Auth() {
    const navigate = useNavigate()
    const { addToast } = useToast();
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [loading, setLoading] = useState(false);
    const isSignUp = mode === 'signup';

    useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        addToast('Successfully signed in!', 'success');
        navigate('/ask');
      }
    });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }, [navigate, addToast]);

    async function login(provider: "github" | "google" ) {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
              redirectTo: window.location.origin + '/ask'
          }
      })
      if(error){
          addToast(`Failed to sign in with ${provider}: ${error.message}`, 'error');
      }
      setLoading(false);
    }

  return (
    <div className="min-h-screen bg-cyber-950 flex items-center justify-center px-4 font-mono">
      <div className="w-full max-w-sm flex flex-col items-center">

        {/* Logo */}
        <div className="w-12 h-12 rounded-lg bg-cyber-900 border border-cyber-800 flex items-center justify-center mb-8 shadow-elevated">
          <span className="text-cyber-primary font-bold text-xl">{'>_'}</span>
        </div>

        {/* Heading */}
        <h1 className="text-cyber-50 text-2xl font-bold tracking-tight text-center mb-1">
          {isSignUp ? 'Create an account' : 'Welcome back'}
        </h1>
        <p className="text-cyber-400 text-sm tracking-wider uppercase text-center mb-10">
          {isSignUp ? 'Start searching smarter' : 'Sign in to continue'}
        </p>

        {/* OAuth Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Button onClick={()=>login("google")} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-md bg-cyber-primary hover:bg-cyber-primary-hover border border-cyber-primary text-white font-bold tracking-widest uppercase transition-colors duration-200 shadow-elevated" isLoading={loading} disabled={loading}>
            <GoogleIcon />
            {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
          </Button>

          <Button variant='secondary' onClick={()=>login("github")} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-md bg-cyber-900 hover:bg-cyber-800 border border-cyber-700 text-cyber-50 font-bold tracking-widest uppercase transition-colors duration-200" isLoading={loading} disabled={loading}>
            <GitHubIcon />
            {isSignUp ? 'Sign up with GitHub' : 'Sign in with GitHub'}
          </Button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-cyber-800" />
          <span className="text-xs text-cyber-500 tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-cyber-800" />
        </div>

        {/* Toggle mode */}
        <p className="text-sm text-cyber-400 tracking-wide text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Button variant='ghost'
            onClick={() => setMode(isSignUp ? 'signin' : 'signup')}
            className="text-cyber-primary hover:text-cyber-primary-light font-semibold underline underline-offset-2 transition-colors duration-150"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Button>
        </p>

        {/* Legal */}
        <p className="text-xs text-cyber-500 leading-relaxed tracking-wide text-center mt-8">
          By continuing, you agree to our{' '}
          <span className="text-cyber-400 hover:text-cyber-200 cursor-pointer transition-colors duration-150">Terms of Service</span>
          {' '}and{' '}
          <span className="text-cyber-400 hover:text-cyber-200 cursor-pointer transition-colors duration-150">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}