"use server"

import bcrypt from 'bcryptjs'
import { AuthCredentialsValidator } from "@/lib/validators/account-credentials-validator"
import { db } from '@/lib/prismadb'
import { getUserByEmail } from '@/lib/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

export const signup = async values => {
    const validatedFields = AuthCredentialsValidator.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Champs invalides' }
    }

    const { name, email, password } = validatedFields.data

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        return { error: 'Email déjà utilisé' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.create({ 
        data: { name, email, password: hashedPassword } 
    })

    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)
    
    return { success: 'Email de confirmation envoyé' }
}