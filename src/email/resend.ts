import "dotenv/config";
import { Resend } from "resend";
import { EmailNotSentException } from "./errors/email.error";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(emailData: { email: string; link: string }) {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [emailData.email],
    subject: "Redefinir senha",
    html: `<strong>It works! ${emailData.link}</strong>`,
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
