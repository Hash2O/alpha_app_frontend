'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUserSchema, UpdateUserFormData } from '@/schemas/authSchemas';
import { useAuthStore } from '../stores/authStores';

export default function UpdateuserForm() {
  const { user, updateUser, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { name: '', email: '' },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UpdateUserFormData) => {
    if (!user) return;

    setError(null);
    setSuccess(null);

    const updateData: UpdateUserFormData = {};
    if (data.name && data.name !== user.name) updateData.name = data.name;
    if (data.email && data.email !== user.email) updateData.email = data.email;

    if (Object.keys(updateData).length === 0) {
      setError('Aucune modification détectée');
      return;
    }

    try {
      await updateUser(updateData);
      setSuccess('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  if (!user) {
    return (
      <div className="text-slate-400 text-center p-4">
        Chargement des données utilisateur...
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="update-name" className="text-slate-300">Nom</Label>
          <Input
            id="update-name"
            type="text"
            {...form.register('name')}
            className="bg-slate-700/50 border-slate-600 text-white"
          />
          {form.formState.errors.name && (
            <p className="text-red-400 text-sm">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="update-email" className="text-slate-300">Email</Label>
          <Input
            id="update-email"
            type="email"
            {...form.register('email')}
            className="bg-slate-700/50 border-slate-600 text-white"
          />
          {form.formState.errors.email && (
            <p className="text-red-400 text-sm">{form.formState.errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-500 hover:bg-emerald-800 cursor-pointer"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mise à jour...</>
          ) : (
            'Enregistrer les modifications'
          )}
        </Button>
      </form>
    </div>
  );
}