import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from '@/lib/prismadb'
import authConfig from "@/lib/auth.config"
import { getUserById } from "@/lib/data/user"
import { getAccountByUserId } from "@/lib/data/account"
// import { stripe } from "./lib/stripe/stripe"

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/se-connecter',
        error: '/authentification-erreur'
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } })
        },
        async createUser({ user }) {
            if (!user || !user.id) {
                return
            }
            
            // const stripeCustomer = await stripe.customers.create({
            //     email: user.email,
            //     name: user.name
            // })

            // await db.user.update({
            //     where: { id: user.id },
            //     data: { stripeCustomerId: stripeCustomer?.id }
            // })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            // Allow OAuth without email verified(email already verified by provider)
            if (account?.provider !== 'credentials') return true
            
            const existingUser = await getUserById(user.id)
            // Prevent login if email not verified
            if (!existingUser?.emailVerified) return false

            return true
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.error && session.user) {
                session.error = true
            }

            if (token.plan && session.user) {
                session.user.plan = token.plan
            }

            if ((token.messages >= 0) && session.user) {
                session.user.messages = token.messages
            }

            if (session.user) {
                session.user.name = token.name
                session.user.email = token.email
                session.user.isOAuth = token.isOAuth
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token

            const existingUser = await getUserById(token.sub)
            if (!existingUser) {
                token.error = true
                return token
            }

            const existingAccount = await getAccountByUserId(existingUser.id)

            token.isOAuth = !!existingAccount
            token.name = existingUser.name
            token.email = existingUser.email
            token.plan = existingUser.plan
            token.messages = existingUser.messages

            return token
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
})