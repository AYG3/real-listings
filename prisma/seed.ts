import { auth } from "@/lib/auth/auth";

await auth.api.signUpEmail({
    body: {
        name: "ADMIN",
        email: "admin@gmail.com",
        password: "checkers",
    }
})