"use server"

import { getUserByEmail } from "@/lib/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetCredentialsValidator } from "@/lib/validators/account-credentials-validator"

export const reset = async values => {
    const validatedFields = ResetCredentialsValidator.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Email invalide' }
    }

    const { email } = validatedFields.data

    const existingUser = await getUserByEmail(email)
    if (!existingUser) {
        return { error: "Email inconnu" }
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

    return { success: "Email de réinitialisation envoyé" }
}