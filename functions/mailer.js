var nodemailer = require("nodemailer");
const { USER, PASSWORD } = process.env;
var transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: USER,
    pass: PASSWORD,
  },
});

let rows = [];

export function sendMail(name, email, orders, type, pay_link) {
  var body = ``;
  var subjectLine = "";
  if (type === "INITIATE") {
    subjectLine = "Order Created";
    body = `
        Dear ${name}, <br />
        You have made an order. Your order Id is ${orders[0].orderId}. 
        You can make payment at this <a href=${pay_link}>Link</a>
        <br/>
        Thank You for shopping with us.
        `;
  } else if (type === "VALID_SAFE") {
    subjectLine = "Payment Received";
    body = `
        Dear ${name}, <br />
        We have <b>received your payment</b> for Order ${orders[0].orderId}. We will deliver the items within 3 working days. Thank You
        for shopping with us.
        `;
  } else if (type === "VALID_UNSAFE") {
    subjectLine = "Payment Verification Needed";
    body = `
        Dear ${name}, <br />
        There were some <b>issues in receiving your payment</b> for Order ${orders[0].orderId}. We will get in touch shortly to sort things out. Thank You for shopping with us.
        `;
  } else if (type === "FAILED") {
    subjectLine = "Payment Failed";
    body = `
        Dear ${name}, <br />
        Your payment has <b>failed</b>, please check with your payment service. 
        `;
  } else if (type === "CANCELLED") {
    subjectLine = "Payment Cancelled";
    body = `
        Dear ${name}, <br />
        You have <b>cancelled</b> the order ${orders[0].orderId}. We hope next time you find something you like!
        `;
  } else if (type === "UNATTEMPTED") {
    subjectLine = "Payment Unattempted";
    body = `
        Dear ${name}, <br />
        It seems you have not <b>attempted</b> the payment for the order ${orders[0].orderId}. The payment portal will expire soon. 
        Please make the payment as soon as possible. Thank You for shopping with us.
        `;
  } else if (type === "EXPIRED") {
    subjectLine = "Payment Expired";
    body = `
        Dear ${name}, <br />
        The payment link for your last order has <b>expired</b>. If the transaction is not refunded within 24 hours please contact us.
        `;
  }
  if (type != "EXPIRED") {
    rows.push(`
            <table
              class="bg_white"
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
            >
              <tr style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)">
                <th
                  width="60%"
                  style="
                    text-align: left;
                    padding: 1em 2.5em;
                    color: #000;
                    padding-bottom: 20px;
                  "
                >
                  Item
                </th>
                <th
                  width="20%"
                  style="
                    text-align: right;
                    padding: 1em 2.5em;
                    color: #000;
                    padding-bottom: 20px;
                  "
                >
                  Quantity
                </th>
                <th
                  width="20%"
                  style="
                    text-align: right;
                    padding: 1em 2.5em;
                    color: #000;
                    padding-bottom: 20px;
                  "
                >
                  Price
                </th>
              </tr>
    `);
    orders[0].items.forEach((element) => {
      rows.push(
        `<tr style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)">
        <td
          valign="middle"
          width="60%"
          style="text-align: left; padding: 0 2.5em"
        >
          <div class="product-entry">
            <div class="text">
              <h3>${element.name}</h3>
            </div>
          </div>
        </td>
        <td
          valign="middle"
          width="20%"
          style="text-align: left; padding: 0 2.5em"
        >
          <span class="quantity" style="color: #000; font-size: 20px">
            ${element.quantity}
          </span>
        </td>
         <td
          valign="middle"
          width="20%"
          style="text-align: left; padding: 0 2.5em"
        >
          <span class="price" style="color: #000; font-size: 20px">
            ${element.price}
          </span>
        </td>
      </tr>`
      );
    });
    rows.push(
      `<tr>
      <td
        valign="middle"
        width="60%"
        style="text-align: right; padding: 0 2.5em"
      ></td>
      <td
        valign="middle"
        width="20%"
        style="text-align: right; padding: 0 2.5em"
      >
        <span class="quantity" style="color: #000; font-size: 20px">
          Total
        </span>
      </td>
      <td
        valign="middle"
        width="20%"
        style="text-align: right; padding: 0 2.5em"
      >
        <span class="quantity" style="color: #000; font-size: 20px">
          ${orders[0].total}
        </span>
      </td>
    </tr>
      </table>`
    );
  } else {
    rows.push(``);
  }
  var mailOptions = {
    from: '"Ecommerce Team" <zarifecommercedemo@gmail.com>',
    to: email,
    subject: subjectLine,
    html: setBody(body, rows),
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      rows = [];
      return error;
    }
    rows = [];
  });
}
function setBody(body, rows) {
  return `  <head>
    <meta charset="utf-8" />
    <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width" />
    <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting" />
    <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <title></title>
    <!-- The title tag shows in email notifications, like Android 4.4. -->

    <link
      href="https://fonts.googleapis.com/css?family=Work+Sans:200,300,400,500,600,700"
      rel="stylesheet"
    />

    <!-- CSS Reset : BEGIN -->
    <style>
      /* What it does: Remove spaces around the email design added by some email clients. */
      /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
      html,
      body {
        margin: 0 auto !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        background: #f1f1f1;
      }

      /* What it does: Stops email clients resizing small text. */
      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      /* What it does: Centers email on Android 4.4 */
      div[style*="margin: 16px 0"] {
        margin: 0 !important;
      }

      /* What it does: Stops Outlook from adding extra spacing to tables. */
      table,
      td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }

      /* What it does: Fixes webkit padding issue. */
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }

      /* What it does: Uses a better rendering method when resizing images in IE. */
      img {
        -ms-interpolation-mode: bicubic;
      }

      /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
      a {
        text-decoration: none;
      }

      /* What it does: A work-around for email clients meddling in triggered links. */
      *[x-apple-data-detectors],  /* iOS */
.unstyle-auto-detected-links *,
.aBn {
        border-bottom: 0 !important;
        cursor: default !important;
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
      .a6S {
        display: none !important;
        opacity: 0.01 !important;
      }

      /* What it does: Prevents Gmail from changing the text color in conversation threads. */
      .im {
        color: inherit !important;
      }

      /* If the above doesn't work, add a .g-img class to any image in question. */
      img.g-img + div {
        display: none !important;
      }

      /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
      /* Create one of these media queries for each additional viewport size you'd like to fix */

      /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
      @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
        u ~ div .email-container {
          min-width: 320px !important;
        }
      }
      /* iPhone 6, 6S, 7, 8, and X */
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
        u ~ div .email-container {
          min-width: 375px !important;
        }
      }
      /* iPhone 6+, 7+, and 8+ */
      @media only screen and (min-device-width: 414px) {
        u ~ div .email-container {
          min-width: 414px !important;
        }
      }
    </style>

    <!-- CSS Reset : END -->

    <!-- Progressive Enhancements : BEGIN -->
    <style>
      .primary {
        background: #17bebb;
      }
      .bg_white {
        background: #ffffff;
      }
      .bg_light {
        background: #f7fafa;
      }
      .bg_black {
        background: #000000;
      }
      .bg_dark {
        background: rgba(0, 0, 0, 0.8);
      }
      .email-section {
        padding: 2.5em;
      }

      /*BUTTON*/
      .btn {
        padding: 10px 15px;
        display: inline-block;
      }
      .btn.btn-primary {
        border-radius: 5px;
        background: #17bebb;
        color: #ffffff;
      }
      .btn.btn-white {
        border-radius: 5px;
        background: #ffffff;
        color: #000000;
      }
      .btn.btn-white-outline {
        border-radius: 5px;
        background: transparent;
        border: 1px solid #fff;
        color: #fff;
      }
      .btn.btn-black-outline {
        border-radius: 0px;
        background: transparent;
        border: 2px solid #000;
        color: #000;
        font-weight: 700;
      }
      .btn-custom {
        color: rgba(0, 0, 0, 0.3);
        text-decoration: underline;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: "Work Sans", sans-serif;
        color: #000000;
        margin-top: 0;
        font-weight: 400;
      }

      body {
        font-family: "Work Sans", sans-serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 1.8;
        color: rgba(0, 0, 0, 0.4);
      }

      a {
        color: #17bebb;
      }

      table {
      }
      /*LOGO*/

      .logo h1 {
        margin: 0;
      }
      .logo h1 a {
        color: #17bebb;
        font-size: 24px;
        font-weight: 700;
        font-family: "Work Sans", sans-serif;
      }

      /*HERO*/
      .hero {
        position: relative;
        z-index: 0;
      }

      .hero .text {
        color: rgba(0, 0, 0, 0.3);
      }
      .hero .text h2 {
        color: #000;
        font-size: 34px;
        margin-bottom: 15px;
        font-weight: 300;
        line-height: 1.2;
      }
      .hero .text h3 {
        font-size: 24px;
        font-weight: 200;
      }
      .hero .text h2 span {
        font-weight: 600;
        color: #000;
      }

      /*PRODUCT*/
      .product-entry {
        display: block;
        position: relative;
        float: left;
        padding-top: 20px;
      }
      .product-entry .text {
        width: calc(100% - 125px);
        padding-left: 20px;
      }
      .product-entry .text h3 {
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .product-entry .text p {
        margin-top: 0;
      }
      .product-entry img,
      .product-entry .text {
        float: left;
      }

      ul.social {
        padding: 0;
      }
      ul.social li {
        display: inline-block;
        margin-right: 10px;
      }

      /*FOOTER*/

      .footer {
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        color: rgba(0, 0, 0, 0.5);
      }
      .footer .heading {
        color: #000;
        font-size: 20px;
      }
      .footer ul {
        margin: 0;
        padding: 0;
      }
      .footer ul li {
        list-style: none;
        margin-bottom: 10px;
      }
      .footer ul li a {
        color: rgba(0, 0, 0, 1);
      }

      @media screen and (max-width: 500px) {
      }
    </style>
  </head>

  <body
    width="100%"
    style="
      margin: 0;
      padding: 0 !important;
      mso-line-height-rule: exactly;
      background-color: #f1f1f1;
    "
  >
    <center style="width: 100%; background-color: #f1f1f1">
      <div style="max-width: 600px; margin: 0 auto" class="email-container">
        <!-- BEGIN BODY -->
        <table
          align="center"
          role="presentation"
          cellspacing="0"
          cellpadding="0"
          border="0"
          width="100%"
          style="margin: auto"
        >
          <tr>
            <td
              valign="top"
              class="bg_white"
              style="padding: 1em 2.5em 0 2.5em"
            >
              <table
                role="presentation"
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
              >
                <tr>
                  <td class="logo" style="text-align: center">
                    <h1><a href="#">Ecommerce</a></h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end tr -->
          <tr>
            <td
              valign="middle"
              class="hero bg_white"
              style="padding: 2em 0 2em 0"
            >
              <table
                role="presentation"
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
              >
             
                <tr>
                  <td style="padding: 0 2.5em; text-align: left">
                    <div class="text">
                      <h4>
                      ${body}
                      </h4>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end tr -->
          <tr>
            
              ${rows}
          
          </tr>
          <!-- end tr -->
          <!-- 1 Column Text + Button : END -->
        </table>
        <table
          align="center"
          role="presentation"
          cellspacing="0"
          cellpadding="0"
          border="0"
          width="100%"
          style="margin: auto"
        >
          <tr>
            <td valign="middle" class="bg_light footer email-section">
              <table>
                <tr>
                  <td valign="top" width="33.333%" style="padding-top: 20px">
                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      width="100%"
                    >
                      <tr>
                        <td style="text-align: center; padding-right: 10px">
                          <h3 class="heading">About</h3>
                          <p>This email is from a demo Ecommerce Site.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end: tr -->
        </table>
      </div>
    </center>
  </body>`;
}
