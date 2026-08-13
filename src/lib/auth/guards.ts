import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'

import { Role } from '../types'
import { redirect } from 'next/navigation'

export async function requireAuth(allowedRoles?: Role[]){
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if(!session?.user){
        //No user seesion – send to home
        redirect("/");
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = session?.user.role as Role | undefined;
        if (!userRole || !allowedRoles.includes(userRole)) {
        // Wrong role → redirect home
        redirect("/");
        }
    }

 return session
}


/** Require ADMIN role — for admin layouts/pages */
export async function requireAdmin() {
    return requireAuth(["ADMIN"])
}

/** Require AGENT role — for agent layouts/pages */
export async function requireAgent() {
  return requireAuth(["AGENT"]);
}

export async function getSession() {
    return auth.api.getSession({
        headers: await headers()
    })
}