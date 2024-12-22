"use server"

import { auth } from "@/auth"
import bcrypt from 'bcryptjs'
import { getUserByEmail, getUserById } from "@/lib/data/user"
import { sendVerificationEmail } from "@/lib/mail"
import { db } from "@/lib/prismadb"
import { generateVerificationToken } from "@/lib/tokens"

export const profile = async values => {
    const session = await auth()
    const user = session?.user

    if (!user) {
        return { error: "Requête non authorisée" }
    }

    const dbUser = await getUserById(user.id)
    if (!dbUser) {
        return { error: "Requête non authorisée" }
    }

    if (user.isOAuth) {
        values.email = undefined
        values.password = undefined
        values.newPassword = undefined
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email)
        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email déjà utilisé" }
        }

        const verificationToken = await generateVerificationToken(values.email)

        await sendVerificationEmail(verificationToken.email, verificationToken.token)

        const newValues = { email: values.email, emailVerified: null }
        if (values.name && values.name !== user.name) {
            newValues.name = values.name
        }

        await db.user.update({
            where: { id: dbUser.id },
            data: newValues
        })

        return { success: 'Email de confirmation envoyé' }
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(values.password, dbUser.password)
        if (!passwordMatch) {
            return { error: "Mot de passe incorrect" }
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10)
        values.password = hashedPassword
        values.newPassword = undefined
    }

    if (!values.password) {
        delete values.password
    }

    delete values.newPassword

    await db.user.update({
        where: { id: dbUser.id },
        data: { ...values }
    })

    return { success: "Profil mis à jour" }
}