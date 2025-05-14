export function getLoginCodeEmailTpl(code: string, isRegister = false): string {
  const emailTemplate = `
<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
  <link rel="preload" as="image" href="https://react-email-demo-clofh8kgn-resend.vercel.app/static/notion-logo.png" />
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  <meta name="x-apple-disable-message-reformatting" />
  <!--$-->
</head>

<body style="background-color:#ffffff">
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="max-width:37.5em;padding-left:12px;padding-right:12px;margin:0 auto">
    <tbody>
      <tr style="width:100%">
        <td>
          <h1
            style="color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:24px;font-weight:bold;margin:40px 0;padding:0">
            ${isRegister ? 'Register' : 'Login'} to PenX
          </h1>
          <p
            style="font-size:14px;line-height:24px;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin:24px 0;margin-bottom:24px;margin-top:24px;margin-right:0;margin-left:0">
            Your ${isRegister ? 'register' : 'login'} code:
          </p>
          <code
            style="display:inline-block;padding:16px 4.5%;width:90.5%;background-color:#f4f4f4;border-radius:5px;border:1px solid #eee;color:#333;font-size: 32px;">${code}</code>

          <p
            style="font-size:14px;line-height:24px;color:#ababab;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin:24px 0;margin-top:24px;margin-bottom:24px;margin-right:0;margin-left:0">
            If you didn&#x27;t try to ${isRegister ? 'register' : 'login'}, you can safely ignore this email.
          </p>

          <p
            style="font-size:14px;line-height:24px;color:#ababab;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin:24px 0;margin-top:24px;margin-bottom:24px;margin-right:0;margin-left:0">This code expires in 10 minutes. Do not share this code with anyone.</p>
        </td>
      </tr>
    </tbody>
  </table>
  <!--/$-->
</body>

</html>

    `.trim()
  return emailTemplate
}
