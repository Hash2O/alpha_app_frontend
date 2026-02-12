import { z } from "zod";

export const loginSchema = z.object({
    email: z.email({ message: 'Cet email est invalide.' }),
    password: z.string().min(8, { message: 'Votre mot de passe ne contient pas assez de caractères.' }),
})

export const registerSchema = z.object({
    name: z.string().min(3, { message: 'Le nom choisi est trop court (3 caractères min).' }).max(25, { message: 'Le nom choisi est trop long (25 caractères max).' }),
    email: z.email({ message: 'Cet email est invalide.' }),
    password: z.string().min(8, { message: 'Le mot de passe choisi est trop court (8 caractères min).' }).max(50, { message: 'Le mot de passe choisi est trop long.' }),
})

export const updateUserSchema = z.object({
    name: z.string().min(3, { message: 'Le nom choisi est trop court (3 caractères min).' }).max(25, { message: 'Le nom choisi est trop long (25 caractères max).' }).optional(),
    email: z.email({ message: 'Cet email est invalide.' }).optional(),
})

// Initialisation des schémas de validation
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
