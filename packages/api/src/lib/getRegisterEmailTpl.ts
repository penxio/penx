export function getRegisterEmailTpl(link: string): string {
  const emailTemplate = `
<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  <meta name="x-apple-disable-message-reformatting" />
  <!--$-->
</head>

<body
  style='background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'>
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style='max-width:37.5em;margin:0 auto;padding:20px 25px 48px;'>
    <tbody>
      <tr style="width:100%">
        <td>
          <h1>PenX</h1>
          <h1 style="font-size:28px;font-weight:bold;margin-top:48px">
            Verify your email address
          </h1>
          <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="margin:24px 0">
            <tbody>
              <tr>
                <td>
                  <p style="font-size:16px;line-height:26px;margin-bottom:16px;margin-top: 0;">
                    To start using PenX, just click the verify email button below:

                  </p>

                  <p style="font-size:16px;line-height:26px;margin:16px 0">
                    <a href="${link}" style="color:#FF6363;text-decoration-line:none" target="_blank">
                      Verify email
                    </a>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <p style="font-size:16px;line-height:26px;margin:16px 0">
            Best,<br />- PenX Team
          </p>
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
