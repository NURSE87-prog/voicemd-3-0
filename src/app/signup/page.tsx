"use client";

import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      }
    });
    if (error) setError(error.message);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          specialty: specialty,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session) {
      // If email confirmation is OFF, we get a session immediately
      router.push("/dashboard");
    } else {
      // If email confirmation is ON, we show the success message
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-card)', borderRadius: '24px', padding: '2.5rem', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decorative Top Accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2.25rem' }}>
          <div style={{ background: 'var(--accent-soft)', padding: '1.25rem', borderRadius: '50%', color: 'var(--accent)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease', display: 'inline-flex' }}>
            <Stethoscope size={36} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '0.6rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Join VoiceMD
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto' }}>
            The new standard in ambient clinical documentation.
          </p>
        </div>

        {success ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: '18px', textAlign: 'center', marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
            <h3 style={{ color: '#059669', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.4rem' }}>Verify your identity</h3>
            <p style={{ color: '#047857', fontSize: '0.9rem', lineHeight: 1.5 }}>A secure activation link has been dispatched to <strong>{email}</strong>.</p>
          </div>
        ) : (
          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {error && (
              <div style={{ background: 'var(--toast-error-bg)', color: 'white', padding: '0.9rem', borderRadius: '14px', fontSize: '0.875rem', textAlign: 'center', fontWeight: 500, animation: 'shake 0.4s ease' }}>
                {error}
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <label htmlFor="firstName" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>First name</label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  placeholder="John"
                  className="focus-ring"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <label htmlFor="lastName" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Last name</label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  placeholder="Doe"
                  className="focus-ring"
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label htmlFor="specialty" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Medical Specialty</label>
              <input
                id="specialty"
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                placeholder="e.g. Pediatrics"
                className="focus-ring"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label htmlFor="email" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Work Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                placeholder="doctor@hospital.org"
                className="focus-ring"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label htmlFor="password" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                placeholder="••••••••"
                className="focus-ring"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="premium-btn"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.625rem', background: 'var(--text-primary)', color: 'var(--bg-color)', padding: '1.1rem', borderRadius: '14px', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '0.75rem', boxShadow: 'var(--shadow-md)', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
            >
              {loading ? "Initializing..." : "Create Account"} <ArrowRight size={20} />
            </button>
          </form>
        )}

        <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.75rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '1.1rem' }}>RELIABLE ALTERNATIVE</p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={handleGoogleLogin}
              style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', background: 'transparent', border: '1px solid var(--border)', padding: '0.85rem', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: 'var(--bg-color)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Google Authentication</span>
            </button>
          </div>
        </div>
      </div>

      
      <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>
    </main>
  );
}
