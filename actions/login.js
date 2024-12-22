"use server"

import { AuthError } from "next-auth"
import { signIn } from "@/lib/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/data/routes"
import { LoginCredentialsValidator } from "@/lib/validators/account-credentials-validator"
import { getUserByEmail } from "@/lib/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export const login = async values => {
    const validatedFields = LoginCredentialsValidator.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Champs invalides' }
    }
    
    const { email, password } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: 'Aucun utilisateur enregistré avec cet email' }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return { success: 'Email de confirmation envoyé'}
    }

    try {
        await signIn('credentials', { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Identifiants invalides' }
                default:
                    return { error: "Une erreur inconnue s'est produite"}
            }
        }
        throw error
    }
}