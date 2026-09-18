const crypto = require('crypto');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const confirmationCode = crypto.randomUUID();
  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : (forwardedProto || 'https').split(',')[0].trim();
  const host = req.headers.host;
  const url = `${protocol}://${host}/data-deletion-status?code=${encodeURIComponent(confirmationCode)}`;

  return res.status(200).json({
    url,
    confirmation_code: confirmationCode
  });
};
