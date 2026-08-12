const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html }) {
  const { data, error } = await resend.emails.send({
    from: "LibraCore <onboarding@resend.dev>",
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error("Resend email error:", error);

    throw new Error(
      error.message || "Email could not be sent"
    );
  }

  return data;
}

module.exports = sendEmail;