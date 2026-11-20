import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Session, User as SupaUser } from '@supabase/supabase-js';
import { UserRole } from '../types/index';

// ═══════════════════════════════════════
// AUTH STORE — Zustand + Supabase
// ═══════════════════════════════════════

interface AuthState {
  session: Session | null;
  user: SupaUser | null;
  role: UserRole | null;
  profile: Record<string, any> | null;
  loading: boolean;
  initialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  role: null,
  profile: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      // Obtener sesión actual
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({ session, user: session.user });
        await get().fetchProfile();
      }

      // Escuchar cambios de auth
      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ session, user: session?.user ?? null });

        if (event === 'SIGNED_IN' && session?.user) {
          await get().fetchProfile();
        }

        if (event === 'SIGNED_OUT') {
          set({ role: null, profile: null });
        }
      });
    } catch (error) {
      console.error('Auth init error:', error);
    } finally {
      set({ initialized: true });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'toma-delivery://auth/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null, user: null, role: null, profile: null });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    const user = get().user;
    if (!user) return;

    try {
      // Buscar perfil en tabla profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found (perfil nuevo)
        console.error('Fetch profile error:', error);
        return;
      }

      if (data) {
        set({ profile: data, role: data.role as UserRole });
      } else {
        // Usuario nuevo — crear perfil con rol por defecto
        const newProfile = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          role: 'client' as UserRole,
          created_at: new Date().toISOString(),
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);

        if (!insertError) {
          set({ profile: newProfile, role: 'client' });
        }
      }
    } catch (error) {
      console.error('Profile error:', error);
    }
  },
}));
