"use server"

import bcrypt from 'bcryptjs'
import { getPasswordResetTokenByToken } from "@/lib/data/password-reset-token"
import { getUserByEmail } from "@/lib/data/user"
import { NewPasswordCredentialsValidator } from "@/lib/validators/account-credentials-validator"
import { db } from '@/lib/prismadb'

export const newPassword = async (values, token) => {
    if (!token) {
        return { error: "Le token n'existe pas"}
    }

    const validatedFields = NewPasswordCredentialsValidator.safeParse(values)
    if (!validatedFields.success) {
        return { error: 'Mot de passe invalide' }
    }

    const { password } = validatedFields.data

    const existingToken = await getPasswordResetTokenByToken(token)
    if (!existingToken) {
        return { error: "Token invalide" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) {
        return { error: "Le token de sécurité a expiré" }
    }

    const existingUser = await getUserByEmail(existingToken.email)
    if (!existingUser) {
        return { error: "Email inconnu" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
    })
    await db.passwordResetToken.delete({
        where: { id: existingToken.id }
    })

    return { success: "Mot de passe modifié" }
}