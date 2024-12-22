import { z } from "zod"

export const AuthCredentialsValidator = z.object({
    name: z.string().min(2, { message: "Minimum 2 caractères" }),
    email: z.string().email({ message: 'Email non valide' }),
    password: z.string().min(8, { message: "Minimum 8 caractères" })
})

export const LoginCredentialsValidator = z.object({
    email: z.string().email({ message: 'Email requis' }),
    password: z.string().min(1, { message: "Mot de passe requis" })
})

export const ResetCredentialsValidator = z.object({
    email: z.string().email({ message: 'Email requis' })
})

export const NewPasswordCredentialsValidator = z.object({
    password: z.string().min(8, { message: "Minimum 8 caractères" })
})

export const ProfileCredentialsValidator = z.object({
    name: z.string().min(2, { message: "Minimum 2 caractères" }).optional(),
    email: z.string().email({ message: 'Email non valide' }).optional(),
    password: z.string().min(8, { message: "Minimum 8 caractères" }).optional().or(z.literal('')),
    newPassword: z.string().min(8, { message: "Minimum 8 caractères" }).optional().or(z.literal('')),
})
    .refine(data => !(data.password && !data.newPassword), { message: "Nouveau mot de passe requis", path: ['newPassword'] }
    )
    .refine(data => !(data.newPassword && !data.password), { message: "Mot de passe actuel requis", path: ['password'] }
    )