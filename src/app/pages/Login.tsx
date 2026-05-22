import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, UserPlus } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError(language === 'el' ? 'Το όνομα είναι υποχρεωτικό' : 'Name is required');
          setLoading(false);
          return;
        }
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      
      // Navigate to home or admin if successful
      navigate('/');
    } catch (err: any) {
      setError(err.message || (language === 'el' ? 'Σφάλμα σύνδεσης' : 'Login error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-40 px-5">
      <div className="max-w-md mx-auto">
        <div className="bg-[#56514f] rounded-lg p-8 shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-8">
            {isSignUp ? (
              <UserPlus className="w-8 h-8 text-white" />
            ) : (
              <LogIn className="w-8 h-8 text-white" />
            )}
            <h1 className="text-white text-2xl">
              {isSignUp 
                ? (language === 'el' ? 'Εγγραφή' : 'Sign Up')
                : (language === 'el' ? 'Σύνδεση' : 'Sign In')
              }
            </h1>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="text-white mb-2 block">
                  {language === 'el' ? 'Όνομα' : 'Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="text-white mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-white mb-2 block">
                {language === 'el' ? 'Κωδικός' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-[#444] text-white px-8 py-4 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (language === 'el' ? 'Φόρτωση...' : 'Loading...') 
                : isSignUp
                  ? (language === 'el' ? 'Εγγραφή' : 'Sign Up')
                  : (language === 'el' ? 'Σύνδεση' : 'Sign In')
              }
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {isSignUp 
                ? (language === 'el' ? 'Έχετε ήδη λογαριασμό; Σύνδεση' : 'Already have an account? Sign In')
                : (language === 'el' ? 'Δεν έχετε λογαριασμό; Εγγραφή' : 'Don\'t have an account? Sign Up')
              }
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
