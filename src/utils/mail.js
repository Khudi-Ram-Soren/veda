import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Veda",
      link: "https://veda.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: true,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_SECRET,
    },
  });

  const mail = {
    from: "khudi@soren.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed siliently. Make sure that you have provided your MAILTRAP credentials in the .env file"
    );
    console.error(error);
  }
};

const emailVarificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to Veda! We\'re very excited to have you on board.",
      action: {
        instructions: "To verify your email please click on following button.",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const resetPasswordMailgenContent = (username, resetPasswordUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account.",
      action: {
        instructions: "To reset your password click on the following button.",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: resetPasswordUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  emailVarificationMailgenContent,
  resetPasswordMailgenContent,
  sendEmail,
};
