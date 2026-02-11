/* eslint-disable @typescript-eslint/no-unused-vars */
import { authServices } from "@/services/authServices";
import { AuthState, LoginFormData, RegisterFormData, UpdateUserFormData, User } from "@/types/authTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";   // persister les données dans le localstorage

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,
            login: async(data: LoginFormData) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await authServices.login(data);
                    localStorage.setItem('token', result.access_token); // ici on récupère le token et on le place dans le localstorage
                    set({
                        user: result.user as User,
                        token: result.access_token,
                        isLoading: false,
                    })
                } 
                catch(err) {
                    set({                    
                        error: err instanceof Error ? err.message : 'Une erreur est survenue',
                        isLoading: false,
                    })
                }
            },
            register: async(data: RegisterFormData) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await authServices.register(data);
                    localStorage.setItem('token', result.access_token);
                    set({
                        user: result.user as User,
                        token: result.access_token,
                        isLoading: false,
                    })
                }
                catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Une erreur est survenue',
                        isLoading: false,
                    });
                    throw err;
                }
            },
            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isLoading: false, error: null });
            },
            updateUser: async(data: UpdateUserFormData) => {
                const { user } = get();
                if (!user) {
                    return;
                }
                set({ isLoading: true, error: null });
                try {
                    const result = await authServices.updateUser(user.id, data);
                    set({
                        user: result as User,
                        isLoading: false,
                    });
                }
                catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Une erreur est survenue',
                        isLoading: false,
                    });
                    throw err;
                }
            },
            clearError: () => set({ error: null }),
            setUser: (user: User) => set({ user }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, token: state.token }),  // On ne stocke dans le store que les données qui vont changer
        } 
    )
)