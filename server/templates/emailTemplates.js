// Responsive, inline-styled HTML email templates. No participant name appears in the OTP email.

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const layout = (content) => `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#070b1a;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0f1630;border-radius:16px;padding:32px;">
          <tr>
            <td>
              <h1 style="margin:0 0 16px;font-size:22px;color:#a78bfa;">Code-a-Nova</h1>
              ${content}
              <p style="margin:32px 0 0;font-size:12px;color:#94a3b8;">This is an automated message from Code-a-Nova. Please do not reply to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const otpEmailTemplate = ({ otp, expiryMinutes }) =>
  layout(`
    <p style="margin:0 0 16px;">Use the verification code below to confirm your email address.</p>
    <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;background:#1e2747;border-radius:12px;padding:16px;color:#67e8f9;">${escapeHtml(otp)}</div>
    <p style="margin:16px 0 8px;">This code expires in ${escapeHtml(expiryMinutes)} minutes.</p>
    <p style="margin:0;color:#fca5a5;">Never share this code with anyone. Code-a-Nova staff will never ask for it. If you did not request this, you can ignore this email.</p>
  `);

const row = (label, value) => `
  <tr>
    <td style="padding:8px 0;color:#94a3b8;width:40%;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#ffffff;">${escapeHtml(value)}</td>
  </tr>`;

export const registrationEmailTemplate = (registration) => {
  const members = registration.teamMembers?.length
    ? registration.teamMembers
        .map(
          (m) => `<tr>
            <td style="padding:8px;border-bottom:1px solid #1e2747;">${escapeHtml(m.fullName)}</td>
            <td style="padding:8px;border-bottom:1px solid #1e2747;">${escapeHtml(m.email)}</td>
          </tr>`
        )
        .join('')
    : `<tr><td colspan="2" style="padding:8px;">Solo participant</td></tr>`;

  return layout(`
    <p style="margin:0 0 16px;">Your Code-a-Nova Hackathon registration has been submitted successfully.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('Registration ID', registration.registrationId)}
      ${row('Event', 'Code-a-Nova Hackathon')}
      ${row('Participant', registration.fullName)}
      ${row('Project name', registration.projectName)}
      ${row('Domain / track', registration.domain)}
      ${row('Team size', registration.teamSize)}
    </table>
    <h3 style="margin:24px 0 8px;color:#67e8f9;">Team members</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <th align="left" style="padding:8px;color:#94a3b8;">Name</th>
        <th align="left" style="padding:8px;color:#94a3b8;">Email</th>
      </tr>
      ${members}
    </table>
    <p style="margin:24px 0 0;">Keep your Registration ID safe. You can review your entry from your dashboard.</p>
  `);
};
