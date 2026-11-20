// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'client' | 'restaurant' | 'delivery' | null>(null);

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (data) {
      setRole(data.role as any);
    }
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    try {
      // Generar redirect URI compatible con Expo Go
      const redirectUri = makeRedirectUri({
        scheme: 'toma-delivery',
        path: 'auth/callback',
      });

      // LOG para que veas qué redirect URI se está usando
      console.log('🔑 Redirect URI:', redirectUri);
      console.log('👆 Agregá esa URL en Supabase → Authentication → URL Configuration → Redirect URLs');

      // Obtener la URL de OAuth de Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) return { data: null, error };
      if (!data.url) return { data: null, error: new Error('No se obtuvo URL de OAuth') };

      console.log('🌐 OAuth URL:', data.url);

      // Abrir navegador del celular con la URL de Google
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri,
      );

      console.log('📲 Auth result type:', result.type);

      if (result.type === 'success' && result.url) {
        console.log('✅ Callback URL:', result.url);

        // Extraer tokens del URL de callback
        const url = new URL(result.url);

        // Los tokens pueden venir como fragment (#) o query params (?)
        const params = new URLSearchParams(
          url.hash ? url.hash.substring(1) : url.search.substring(1)
        );

        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken) {
          // Setear la sesión en Supabase con los tokens
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken ?? '',
          });
          return { data: sessionData, error: sessionError };
        } else {
          console.log('⚠️ No se encontró access_token en la URL');
        }
      }

      return { data: null, error: null }; // Usuario canceló
    } catch (err: any) {
      console.error('❌ Google sign in error:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    role,
    loading,
    signIn,
    signInWithGoogle,
    signOut,
  };
};
