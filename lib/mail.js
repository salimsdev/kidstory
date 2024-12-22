import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendVerificationEmail = async (email, token) => {
    const confirmLink = `${domain}/verification-email?token=${token}`

    await resend.emails.send({
        from: 'Contact KidStory <contact@senpia.fr>',
        to: email,
        subject: 'Confirmez votre compte KidStory',
        html: `<h2>Confirmation de votre compte</h2><p>Merci de vous être inscrits sur KidStory. Confirmez votre compte en cliquant sur le lien suivant:</p><a href="${confirmLink}">Cliquez</a>`
    })
}

export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${domain}/nouveau-mot-de-passe?token=${token}`

    await resend.emails.send({
        from: 'Contact KidStory <contact@senpia.fr>',
        to: email,
        subject: 'Réinitialisez votre mot de passe',
        html: `<h2>Réinitialisation de votre mot de passe.</h2><p>Vous avez oublié votre mot de passe ou souhaitez le modifier. Cliquez sur le lien suivant pour créer un nouveau mot de passe:</p><a href="${resetLink}">Cliquez</a>`
    })
}