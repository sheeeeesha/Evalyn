const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendCandidateScoreEmail = async ({ to, name, score, remarks }) => {
  const mailOptions = {
    from: `"TES Evaluation" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your TES Evaluation Results`,
    html: `
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your submission has been evaluated.</p>
      <p><strong>Score:</strong> ${score}</p>
      <p><strong>Remarks:</strong> ${remarks || "N/A"}</p>
      <p>Thanks for participating in the evaluation process.</p>
      <hr />
      <p><em>This is an automated email from TES Platform</em></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendSubmissionConfirmationEmail = async ({ to, name, formName }) => {
  const mailOptions = {
    from: `"TES Evaluation" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your response has been recorded`,
    html: `
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for submitting your response to <strong>${formName}</strong>.</p>
      <p>Your response has been successfully recorded. We appreciate your participation!</p>
      <hr />
      <p><em>This is an automated email from TES Platform</em></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendInviteEmail = async ({ to, name, orgName, role, inviteLink }) => {
  const mailOptions = {
    from: `"TES Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject: `You're invited to join ${orgName} on TES`,
    html: `
      <p>Hi <strong>${name}</strong>,</p>
      <p>You have been invited to join <strong>${orgName}</strong> as a <strong>${role}</strong> on the TES platform.</p>
      <p>To accept the invitation and set up your account, please click the link below:</p>
      <p><a href="${inviteLink}">${inviteLink}</a></p>
      <p>If you did not expect this invitation, you can ignore this email.</p>
      <hr />
      <p><em>This is an automated email from TES Platform</em></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendCandidateScoreEmail,
  sendSubmissionConfirmationEmail,
  sendInviteEmail,
};
