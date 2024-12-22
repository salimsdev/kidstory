"use server"

import { db } from "@/lib/prismadb"
import { getVerificationTokenByToken } from "@/lib/data/verification-token"
import { getUserByEmail } from "@/lib/data/user"
import { stripe } from "@/lib/stripe/stripe"

export const newVerification = async token => {
    const existingToken = await getVerificationTokenByToken(token)

    if (!existingToken) {
        return { error: "Le token n'existe pas" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) {
        return { error: "Délai de confirmation expiré" }
    }

    const existingUser = await getUserByEmail(existingToken.email)
    if (!existingUser) {
        return { error: "Aucun utilisateur enregistré avec cet email" }
    }

    const stripeCustomer = await stripe.customers.create({
        email: existingUser.email,
        name: existingUser.name
    })

    await db.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: new Date(), email: existingToken.email, stripeCustomerId: stripeCustomer?.id }
    })

    await db.verificationToken.delete({
        where: { id: existingToken.id }
    })

    return { success: "Votre compte a bien été confirmé"}
}