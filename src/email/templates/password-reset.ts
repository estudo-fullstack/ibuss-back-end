type PasswordResetEmailData = {
  name: string;
  link: string;
  expiresInMinutes: number;
};

// TODO: hospedar src/email/templates/assets/logo-ibuss-email.png
const LOGO_URL = process.env.EMAIL_LOGO_URL ?? "https://SUBSTITUIR/logo-ibuss-email.png";
const SITE_URL = process.env.BASE_URL_FRONT ?? "https://ibuss.com";

export function passwordResetEmailTemplate({
  name,
  link,
  expiresInMinutes,
}: PasswordResetEmailData) {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Redefinição de senha - iBUSS</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style type="text/css">
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; }
      body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
      a { color: #0142aa; }
      a[x-apple-data-detectors], .unstyled-link a {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      @media screen and (max-width: 600px) {
        .container { width: 100% !important; }
        .px { padding-left: 24px !important; padding-right: 24px !important; }
        .h1 { font-size: 22px !important; line-height: 30px !important; }
        .btn a { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      }
    </style>
  </head>

  <body style="margin: 0; padding: 0; background-color: #e0f0fe; font-family: 'Quicksand', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div style="display: none; font-size: 1px; color: #e0f0fe; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
      Recebemos um pedido para redefinir a sua senha do iBUSS. O link expira em ${expiresInMinutes} minutos.
      &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #e0f0fe">
      <tr>
        <td align="center" style="padding: 32px 12px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width: 600px; max-width: 600px">
            <tr>
              <td align="center" style="padding: 0 0 24px 0">
                <a href="${SITE_URL}" target="_blank" style="text-decoration: none">
                  <img src="${LOGO_URL}" width="120" alt="iBUSS" style="width: 120px; height: auto; margin: 0 auto; display: block;" />
                </a>
              </td>
            </tr>

            <tr>
              <td style="background-color: #ffffff; border-radius: 16px; border: 1px solid #a8d2f6;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="background-color: #0142aa; height: 6px; line-height: 6px; font-size: 0; border-radius: 16px 16px 0 0;">&nbsp;</td>
                  </tr>

                  <tr>
                    <td class="px" style="padding: 40px 48px 8px 48px">
                      <h1 class="h1" style="margin: 0 0 16px 0; font-size: 26px; line-height: 34px; font-weight: 700; color: #0142aa; font-family: 'Quicksand', 'Segoe UI', Helvetica, Arial, sans-serif;">
                        Redefinição de senha
                      </h1>

                      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 26px; color: #333333; font-family: 'Quicksand', 'Segoe UI', Helvetica, Arial, sans-serif;">
                        Olá, <strong>${name}</strong>!
                      </p>

                      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 26px; color: #333333; font-family: 'Quicksand', 'Segoe UI', Helvetica, Arial, sans-serif;">
                        Recebemos uma solicitação para redefinir a senha da sua conta no <strong>iBUSS</strong>. Clique no botão abaixo para criar uma nova senha.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td class="px" style="padding: 16px 48px 24px 48px">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn" width="100%">
                        <tr>
                          <td align="center" bgcolor="#0142AA" style="border-radius: 999px">
                            <a href="${link}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 999px; background-color: #0142aa; font-family: 'Quicksand', 'Segoe UI', Helvetica, Arial, sans-serif;">Redefinir minha senha</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td class="px" style="padding: 0 48px 24px 48px">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #e0f0fe; border-radius: 12px">
                        <tr>
                          <td style="padding: 16px 20px; font-size: 14px; line-height: 22px; color: #0142aa; font-family: 'Quicksand', 'Segoe UI', Helvetica, Arial, sans-serif;">
                            Por segurança, este link expira em <strong>${expiresInMinutes} minutos</strong> e só pode ser usado uma vez.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td class="px" style="padding: 0 48px 32px 48px">
                      <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 20px; color: #666666; font-family: 'Quicksand', 'Segoe UI', Helvetica, Arial, sans-serif;">
                        Se o botão não funcionar, copie e cole o endereço abaixo no seu navegador:
                      </p>
                      <p style="margin: 0; font-size: 13px; line-height: 20px; word-break: break-all; font-family: 'Segoe UI', Helvetica, Arial, sans-serif;">
                        <a href="${link}" target="_blank" style="color: #026ecc; text-decoration: underline">${link}</a>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td class="px" style="padding: 0 48px">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="border-top: 1px solid #e0f0fe; font-size: 0; line-height: 0;">&nbsp;</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td class="px" style="padding: 24px 48px 40px 48px">
                      <p style="margin: 0; font-size: 14px; line-height: 22px; color: #666666; font-family: 'Quicksand', 'Segoe UI', Helvetica, Arial, sans-serif;">
                        Não foi você que pediu? Pode ignorar este e-mail — sua senha atual continua valendo.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding: 24px 24px 0 24px">
                <p class="unstyled-link" style="margin: 0 0 6px 0; font-size: 13px; line-height: 20px; color: #0142aa; font-weight: 600; font-family: 'Quicksand', 'Segoe UI', Helvetica, Arial, sans-serif;">
                  iBUSS
                </p>
                <p style="margin: 0; font-size: 12px; line-height: 20px; color: #6b7f95; font-family: 'Quicksand', 'Segoe UI', Helvetica, Arial, sans-serif;">
                  Este é um e-mail automático, por favor não responda.<br />
                  &copy; ${year} iBUSS. Todos os direitos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
