import { db } from '@/lib/prismadb'

export const getPasswordResetTokenByToken = async token => {
    try {
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where: { token }
        })
        return passwordResetToken
    } catch {
        return null
    }
}

export const getPasswordResetTokenByEmail = async email => {
    try {
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where: { email }
        })
        return passwordResetToken
    } catch {
        return null
    }
}