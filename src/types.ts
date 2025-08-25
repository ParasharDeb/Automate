import z, { email } from 'zod'
export const Signupschema=z.object({
    username:z.string().max(50),
    password:z.string(),
    email:z.email()
})
export const Signinschema=z.object({
    email:z.email(),
    password:z.string()
})
export const Change_passwordschema=z.object({
    oldpassword:z.string(),
    newpassword:z.string(),
})