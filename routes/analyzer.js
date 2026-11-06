const express = require('express');
const router = express.Router();

router.post('/scan', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter text or message content to analyze.' });
    }

    const lower = text.toLowerCase();
    const flags = [];
    let riskScore = 15; // Baseline suspicion for unsolicited checks

    // Keyword & pattern heuristics
    if (lower.includes('pin') && (lower.includes('receive') || lower.includes('claim') || lower.includes('credit'))) {
      riskScore += 35;
      flags.push({ severity: 'CRITICAL', text: 'Claims you need to enter UPI PIN to RECEIVE money. (UPI PIN is ONLY required to SEND money!)' });
    }

    if (lower.includes('bit.ly') || lower.includes('tinyurl') || lower.includes('ngrok') || lower.includes('apk') || lower.includes('http:')) {
      riskScore += 25;
      flags.push({ severity: 'HIGH', text: 'Contains unverified link, shortened URL, or direct APK download file.' });
    }

    if (lower.includes('lottery') || lower.includes('winner') || lower.includes('reward') || lower.includes('cashback') || lower.includes('kbc')) {
      riskScore += 20;
      flags.push({ severity: 'HIGH', text: 'Unsolicited reward or lottery win claim commonly used in advance-fee scams.' });
    }

    if (lower.includes('electricity') || lower.includes('disconnect') || lower.includes('power cut') || lower.includes('kyc') || lower.includes('blocked')) {
      riskScore += 25;
      flags.push({ severity: 'HIGH', text: 'High-pressure urgency tactic threatening account closure or service interruption.' });
    }

    if (lower.includes('urgently') || lower.includes('immediately') || lower.includes('within 10 mins') || lower.includes('call now')) {
      riskScore += 15;
      flags.push({ severity: 'MEDIUM', text: 'Artificial time pressure designed to prevent double-checking.' });
    }

    if (lower.includes('otp') || lower.includes('code') || lower.includes('verification')) {
      riskScore += 20;
      flags.push({ severity: 'CRITICAL', text: 'Mentions OTP or verification code. Never share OTP with anyone under any circumstances!' });
    }

    // Cap at 98%
    riskScore = Math.min(Math.max(riskScore, flags.length ? 55 : 10), 98);

    let threatLevel = 'SAFE / LOW RISK';
    let badgeColor = 'green';
    if (riskScore >= 75) {
      threatLevel = 'CRITICAL PHISHING / SCAM ALERT';
      badgeColor = 'red';
    } else if (riskScore >= 45) {
      threatLevel = 'MODERATE THREAT / SUSPICIOUS';
      badgeColor = 'orange';
    }

    const recommendation = riskScore >= 50
      ? 'DO NOT click links, DO NOT share OTP/PIN, and report immediately to Helpline 1930 or cybercrime.gov.in.'
      : 'Message appears low risk, but always verify sender credentials through official banking channels.';

    res.json({
      scanned_text: text,
      risk_score: riskScore,
      threat_level: threatLevel,
      badge_color: badgeColor,
      detected_flags: flags,
      recommendation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
