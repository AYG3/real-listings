"use server"

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

export async function login(formData: FormData) {


    const result = await auth.api.signInEmail({
      
      body: {
        email: "email",
        password: "password",
      } 

    });

    console.log("results: ", result);
    redirect('/admin/overview')
};
