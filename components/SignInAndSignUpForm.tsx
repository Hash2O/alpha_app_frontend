"use client"

import { loginSchema, registerSchema } from '@/schemas/authSchemas';
import { useAuthStore } from '@/stores/authStores';
import { LoginFormData, RegisterFormData } from '@/types/authTypes'
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Loader2, Lock, Mail, User } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

type FormData = LoginFormData | RegisterFormData

export default function SignInAndSignUpForm() {
  
  // Génération d'un state pour savoir quel formulaire afficher [state, fonction qui va changer le state]
  const [isLogin, setIsLogin] = useState(false);
  //Récupération des données depuis le hook
  const { login, register: registerUser, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  // Gestion des datas : si login, on affiche LoginForm, sinon RegisterForm
  const form = useForm<FormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    // Si register, on affiche les trois champs, sinon on est dans login et on affiche seulement email et pwd
    defaultValues: {email: '', password: '', ...(isLogin ? {} : {name: ''})}
  })

  // Valider le formulaire
  const onSubmit = async (data: FormData) => {
    try {
        if(isLogin) {
            await login(data as LoginFormData)
        }
        else {
            await registerUser(data as RegisterFormData)
        }
        router.push('/dashboard');
    }
    catch {
        // Erreur silencieuse
    }
  }
  
  // Phrase sur page d'accueil pour Créer un compte directement
  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearError();
    form.reset({email: '', password: '', ...(isLogin ? {} : {name: ''})});
  }
  
    return (
    <div className='min-h-screen flex items-center justify-center bg-slate-900 px-4'>
        <div className='w-full max-w-md'>
            <Card className='bg-slate-800/50 border-slate-700/50'>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-white'>  
                        {isLogin ? 'Connexion' : 'Inscription'}                        
                    </CardTitle>
                    <CardDescription className='text-slate-500'>
                        {isLogin ? 'Insérez vos identifiants pour vous connecter' : 'Créez un compte pour commencer'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className='mb-4 p-3 rounded-lg bg-red-500/10 border-red-500/20 text-red-400 text-sm'>
                            { error }
                        </div>
                    )}

                    <form onSubmit={form.handleSubmit(onSubmit)}  className='space-y-4'>
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="name" className='text-slate-300'>Nom</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input 
                                        id="name" 
                                        type="text" 
                                        placeholder="Nom" 
                                        { ...form.register('name' as keyof FormData)} 
                                        className='pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400' />
                                </div>
                                {(form.formState.errors as Record<string, {message?: string}>).name && (
                                    <p className="text-red-400 text-sm">
                                        {(form.formState.errors as Record<string, {message?: string}>).name?.message}
                                    </p>
                                )}               
                            </div>
                        )}

                        <div className="space-y-2">
                                <Label htmlFor="email" className='text-slate-300'>Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="Email" 
                                        { ...form.register('email')} 
                                        className='pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400' />
                                </div>
                                {form.formState.errors.email && (
                                    <p className="text-red-400 text-sm">
                                        {form.formState.errors.email?.message}
                                    </p>
                                )}               
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className='text-slate-300'>Mot de Passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input 
                                        id="password" 
                                        type="password" 
                                        placeholder="Mot de Passe" 
                                        { ...form.register('password')} 
                                        className='pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400' />
                                </div>
                                {form.formState.errors.password && (
                                    <p className="text-red-400 text-sm">
                                        {form.formState.errors.password?.message}
                                    </p>
                                )}               
                            </div>

                            <Button type="submit" disabled={isLoading} className='w-full bg-emerald-500 hover:bg-emerald-600 text-white'>
                                {isLogin ? (
                                    <>
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                    {isLogin ? 'Connexion...' : 'Inscription...'}
                                    </>
                                ) : (
                                    isLogin ? 'Connexion' : 'Inscription'
                                )}
                            </Button>

                    </form>

                  <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
                    <p className="text-slate-400">
                        {isLogin ? "Vous n'avez pas de compte ? " : "Vous avez déjà un compte ? "}
                        <button type="button" onClick={toggleMode} className="text-emerald-500">
                            {isLogin ? 'Inscription' : 'Connexion'}
                        </button>
                    </p>
                  </div>

                </CardContent>
            </Card>
        </div>
    </div>
  )
}
