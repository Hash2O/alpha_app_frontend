import { AuthResponse, LoginFormData, RegisterFormData, UpdateUserFormData, User } from "@/types/authTypes"

const API_URL= process.env.NEXT_PUBLIC_API_URL

// Création d'un hook pour regrouper toutes les fonctions (login, register, logout, etc...)
export const authServices = {
    async login(data: LoginFormData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;
    },
    async register(data: RegisterFormData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;
    },
    async updateUser(userId: number, data: UpdateUserFormData): Promise<User> {
        // Récupération du token de l'utilisateur en cours, avec localstorage
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // ici, on autorise la modif par l'utilisateur de ses données
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;
    },
    async getProfile(): Promise<User> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;
    }
}