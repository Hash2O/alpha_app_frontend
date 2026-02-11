// Préciser à NextJS qu'il s'agit d'une page front
"use client"

import SignInAndSignUpForm from '@/components/SignInAndSignUpForm';
import { useAuthStore } from '@/stores/authStores'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function Home() {

  const { token } = useAuthStore();
  const router = useRouter();

  // Hook qui gère les effets de bord (fonction, tableau de dépendances)
  useEffect(() => {if(token){ router.push('/dashboard'); }},[token, router]);
  if(token){ return; }

  return (
    <SignInAndSignUpForm/>
  )
}
