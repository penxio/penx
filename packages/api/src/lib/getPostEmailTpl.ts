export function getPostEmailTpl(
  title: string,
  content: string,
  url: string,
  cover = '',
): string {
  let coverImage = ``

  if (cover) {
    coverImage = `
  <img
    alt="Herman Miller Chair"
    height="320"
    src="${cover}"
    style="display:block;outline:none;border:none;text-decoration:none;width:100%;border-radius:12px;object-fit:cover" />
    `
  }

  const emailTemplate = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <link rel="preload" as="image" href="/static/herman-miller-chair.jpg" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--$-->
    <style>
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        mso-font-alt: 'Helvetica';
        src: url(https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2) format('woff2');
      }

      * {
        font-family: 'Inter', Helvetica;
      }
    </style>
    <style>
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        mso-font-alt: 'Helvetica';
        src: url(https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fjbvMwCp50PDca1ZL7.woff2) format('woff2');
      }

      * {
        font-family: 'Inter', Helvetica;
      }
    </style>
    <style>
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        mso-font-alt: 'Helvetica';
        src: url(https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fjbvMwCp50BTca1ZL7.woff2) format('woff2');
      }

      * {
        font-family: 'Inter', Helvetica;
      }
    </style>
  </head>
  <body style="margin:0;margin-left:12px;margin-right:12px">
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:37.5em;margin-left:auto;margin-right:auto;box-sizing:border-box;padding-top:1rem;padding-bottom:1rem;height:100vh">
      <tbody>
        <tr style="width:100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="margin-top:16px;margin-bottom:16px">
              <tbody>
                <tr>
                  <td>
                    ${coverImage}
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="margin-top:32px;text-align:center">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:18px;line-height:28px;margin:16px 0;margin-top:16px;margin-bottom:16px;font-weight:600;color:rgb(79,70,229)">
                              Our new article
                            </p>
                            <h1
                              style="margin:0px;margin-top:8px;font-size:36px;line-height:36px;font-weight:600;color:rgb(17,24,39)">${title}</h1>
                            <p
                              style="font-size:16px;line-height:24px;margin:16px 0;color:rgb(107,114,128)">${content}</p>
                            <a
                              href="${url}"
                              style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;margin-top:16px;border-radius:8px;background-color:rgb(79,70,229);padding-left:40px;padding-right:40px;padding-top:12px;padding-bottom:12px;font-weight:600;color:rgb(255,255,255);padding:12px 40px 12px 40px"
                              target="_blank"
                              ><span
                                ><!--[if mso]><i style="mso-font-width:500%;mso-text-raise:18" hidden>&#8202;&#8202;&#8202;&#8202;</i><![endif]--></span
                              ><span
                                style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px"
                                >Read more</span
                              ><span
                                ><!--[if mso]><i style="mso-font-width:500%" hidden>&#8202;&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span
                              ></a
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!--/$-->
  </body>
</html>
  `
  return emailTemplate
}

interface SubscriptionConfirmEmailConfig {
  siteName: string
  confirmUrl: string
  supportEmail?: string
}

export function createSubscriptionConfirmEmail(
  config: SubscriptionConfirmEmailConfig,
) {
  const { siteName, confirmUrl } = config

  return {
    subject: `Confirm your subscription to ${siteName}`,
    content: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm your subscription</title>
        </head>
        <body style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.5;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        ">
          <p style="margin-bottom: 20px;">
            Please confirm your subscription to ${siteName} by clicking the button below:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" 
               style="
                 background: #000;
                 color: #fff;
                 padding: 12px 24px;
                 border-radius: 4px;
                 text-decoration: none;
                 display: inline-block;
               "
            >
              Confirm Subscription
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            If you didn't request this subscription, you can safely ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <div style="color: #666; font-size: 12px; text-align: center;">
            <p>
              This email was sent by ${siteName}.<br>
              ${config.supportEmail ? `For support, contact ${config.supportEmail}` : ''}
            </p>
          </div>
        </body>
      </html>
    `.trim(),
  }
}
