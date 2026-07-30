import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendPasswordResetEmail(email: string) {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Redefinir senha",
    html: "<strong>It works!</strong>",
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}
