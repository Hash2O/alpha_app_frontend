export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (data: LoginFormData) => Promise<void>
    register: (data: RegisterFormData) => Promise<void>
    logout: () => void;
    clearError: () => void;
    updateUser: (data: UpdateUserFormData) => Promise<void>
    setUser: (user: User) => void;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
    createdAt: string;
    updatedAt: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserFormData {
    name?: string;  // Champs optionnel
    email?: string; // Idem
}

export interface AuthResponse {
    user: Omit<User, 'password'>;   // Récupère l'utilisateur sans le mot de passe
    access_token: string;   // Token JWT mis en place dans le backend
}