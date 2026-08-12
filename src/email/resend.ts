import "dotenv/config";
import { Resend } from "resend";
import { EmailNotSentException } from "./errors/email.error";
import { passwordResetEmailTemplate } from "./templates/password-reset";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(emailData: {
  email: string;
  name: string;
  link: string;
  expiresInMinutes: number;
}) {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [emailData.email],
    subject: "Redefinir senha",
    html: passwordResetEmailTemplate({
      name: emailData.name,
      link: emailData.link,
      expiresInMinutes: emailData.expiresInMinutes,
    }),
  });

  if (error) {
    throw new EmailNotSentException();
  }

  console.log({ data });
}

export async function infoPasswordResetEmail(email: string) {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Senha IBUSS alterada",
    html: `<strong>A senha da sua conta foi alterada</strong>`,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}
