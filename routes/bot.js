const express = require('express');
const router = express.Router();

router.post('/simulate-alert', (req, res) => {
  try {
    const { phone_number, scam_type } = req.body;
    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const tips = {
      'upi_screenshot': '⚠️ [CYBERGUARD ALERT] Beware of Fake UPI Payment Screenshots! Always verify payment credit via your official bank SMS or merchant soundbox before handing over goods.',
      'qr_code': '⚠️ [CYBERGUARD ALERT] Scanning a QR code or entering your UPI PIN will DEDUCT money, never credit it. Never enter PIN to receive payments!',
      'fake_call': '⚠️ [CYBERGUARD ALERT] Banks or Police NEVER demand OTP or money transfers over phone calls. Hang up and dial 1930 immediately.',
      'default': '⚠️ [CYBERGUARD ALERT] Report any cyber fraud within 2 hours at National Helpline 1930 or cybercrime.gov.in.'
    };

    const alertMessage = tips[scam_type] || tips['default'];

    res.json({
      success: true,
      phone_number,
      delivered_via: 'WhatsApp / SMS Gateway Simulator',
      message: alertMessage,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
