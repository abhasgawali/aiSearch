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
    <div className="min-h-screen bg-warm-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center">

        {/* Logo */}
        <div className="w-11 h-11 rounded-sm bg-warm-800 border border-warm-700 flex items-center justify-center mb-8">
          <SearchIcon />
        </div>

        {/* Heading */}
        <h1 className="text-warm-50 text-2xl font-bold tracking-tight text-center mb-1">
          {isSignUp ? 'Create an account' : 'Welcome back'}
        </h1>
        <p className="text-warm-400 text-lg tracking-widest uppercase text-center mb-10">
          {isSignUp ? 'Start searching smarter' : 'Sign in to continue'}
        </p>

        {/* OAuth Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Button onClick={()=>login("google")} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-sm bg-cream hover:bg-warm-100 border border-sand text-warm-950 font-bold tracking-widest-plus uppercase transition-colors duration-200" isLoading={loading} disabled={loading}>
            <GoogleIcon />
            {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
          </Button>

          <Button variant='secondary' onClick={()=>login("github")} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-sm bg-warm-800 hover:bg-warm-750 border border-warm-700 text-warm-50 font-bold tracking-widest-plus uppercase transition-colors duration-200" isLoading={loading} disabled={loading}>
            <GitHubIcon />
            {isSignUp ? 'Sign up with GitHub' : 'Sign in with GitHub'}
          </Button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-warm-800" />
          <span className="text-xs text-warm-500 tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-warm-800" />
        </div>

        {/* Toggle mode */}
        <p className="text-lg text-warm-400 tracking-wide text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Button variant='ghost'
            onClick={() => setMode(isSignUp ? 'signin' : 'signup')}
            className="text-warm-200 hover:text-warm-50 font-semibold underline underline-offset-2 transition-colors duration-150"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Button>
        </p>

        {/* Legal */}
        <p className="text-xs text-warm-500 leading-relaxed tracking-wide text-center mt-8">
          By continuing, you agree to our{' '}
          <span className="text-warm-400 hover:text-warm-200 cursor-pointer transition-colors duration-150">Terms of Service</span>
          {' '}and{' '}
          <span className="text-warm-400 hover:text-warm-200 cursor-pointer transition-colors duration-150">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}