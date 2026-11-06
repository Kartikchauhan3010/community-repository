const bcrypt = require('bcryptjs');
const { sequelize, User, Module, QuizQuestion, WorkshopSession, FeedbackResponse, IncidentReport } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });

  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await User.create({
    name: 'Admin Coordinator',
    email: 'admin@cyberguard.org',
    password_hash: passwordHash,
    role: 'admin'
  });

  const mod1 = await Module.create({
    title: 'Digital Payment & Merchant Security',
    category: 'Digital Safety',
    description: 'Protect small shopkeepers and daily shoppers against unverified payment screenshots, QR code PIN traps, and soundbox spoofing.',
    icon: 'credit-card',
    key_takeaways: [
      'UPI PIN is strictly for sending payments, NEVER for receiving funds.',
      'Always verify official bank SMS or merchant soundbox audio before releasing goods.',
      'Maintain secure handling of payment terminals.'
    ]
  });

  const mod2 = await Module.create({
    title: 'Digital Communication & Message Safety',
    category: 'Digital Safety',
    description: 'Empower senior citizens and families against unexpected utility disconnection SMS alerts and unverified payment web links.',
    icon: 'shield-alert',
    key_takeaways: [
      'Never click unverified web links in messaging applications.',
      'No bank or government agency will demand an authorization PIN over a phone call.',
      'Verify unexpected emergency requests via a direct phone call first.'
    ]
  });

  const mod3 = await Module.create({
    title: 'Community Health, Sanitation & Hygiene',
    category: 'Health & Hygiene',
    description: 'Promote essential daily hygiene habits, clean drinking water practices, and preventive nutrition.',
    icon: 'heart-pulse',
    key_takeaways: [
      'Wash hands with soap for at least 20 seconds before preparing food.',
      'Keep drinking water vessels covered and clean daily.',
      'Maintain balanced seasonal nutrition rich in green vegetables.'
    ]
  });

  const mod4 = await Module.create({
    title: 'Sustainable Waste Segregation & Environmental Care',
    category: 'Environmental Responsibility',
    description: 'Guide households and shopkeepers on wet/dry waste separation and proper e-waste disposal.',
    icon: 'recycle',
    key_takeaways: [
      'Separate wet (biodegradable) and dry (recyclable) waste bins.',
      'Avoid burning plastic materials in open air environments.',
      'Dispose of old batteries and e-waste at designated points.'
    ]
  });

  await QuizQuestion.create({
    module_id: mod1.id,
    scenario_title: 'The Reverse QR Code Test',
    scenario_type: 'UPI Merchant Test',
    image_badge: '📱 QR Code Guide',
    scenario_text: 'A customer says: "I am sending you funds. Scan this QR code on your phone and enter your PIN to receive funds."',
    option_a: 'Scan the code and enter PIN immediately.',
    option_b: 'Refuse! Entering a PIN is ONLY for sending money, never for receiving.',
    correct_option: 'option_b',
    explanation: 'ENTERING A PIN ALWAYS DEDUCTS MONEY FROM YOUR ACCOUNT. Receiving money only requires sharing your account details or static QR code.'
  });

  await QuizQuestion.create({
    module_id: mod1.id,
    scenario_title: 'Unverified Payment Confirmation Screenshot',
    scenario_type: 'Merchant Safety',
    image_badge: '🖼️ Screen Verification',
    scenario_text: 'A buyer shows a green Payment Successful screen on their phone, but your phone has not received a bank SMS or soundbox chime.',
    option_a: 'Trust the customer screen and let them leave immediately.',
    option_b: 'Ask the buyer to wait until your soundbox chimes or bank app confirms credited balance.',
    correct_option: 'option_b',
    explanation: 'Mobile screens can display fake offline screenshots. Always verify incoming transfers via your official soundbox alert or bank balance update.'
  });

  await QuizQuestion.create({
    module_id: mod2.id,
    scenario_title: 'Urgent Utility Disconnection Alert',
    scenario_type: 'Message Safety',
    image_badge: '💬 SMS Verification',
    scenario_text: 'An SMS states: "Your utility service will be disconnected in 2 hours. Update payment via web portal link or call 98xxxxxx."',
    option_a: 'Click the link immediately in panic.',
    option_b: 'Do NOT click! Verify your bill balance directly via official utility receipts.',
    correct_option: 'option_b',
    explanation: 'Utility services do not demand immediate payment via unverified web links or unverified numbers. Threatening urgent disconnection is a classic pressure tactic.'
  });

  const session = await WorkshopSession.create({
    title: 'Senior Citizen & Merchant Digital Safety Camp',
    location: 'Community Center, Sector 14',
    target_group: 'Senior Citizens & Small Shopkeepers',
    session_date: '2026-10-10',
    participants_count: 45,
    coordinator_id: admin.id
  });

  await FeedbackResponse.create({
    session_id: session.id,
    participant_type: 'Shopkeeper',
    pre_confidence_score: 2,
    post_confidence_score: 5,
    fraud_awareness_rating: 5,
    feedback_notes: 'Learned that PIN entry is never needed to receive money. Excellent practical learning!'
  });

  await FeedbackResponse.create({
    session_id: session.id,
    participant_type: 'Senior Citizen',
    pre_confidence_score: 1,
    post_confidence_score: 4,
    fraud_awareness_rating: 5,
    feedback_notes: 'Understood how to verify unverified SMS links before responding.'
  });

  await IncidentReport.create({
    title: 'Unverified Screenshot Trend',
    category: 'Merchant Payment Risk',
    location_name: 'Main Market, Sector 14',
    lat: 28.6139,
    lng: 77.2090,
    severity: 'High'
  });

  await IncidentReport.create({
    title: 'Utility Disconnection Alert Trend',
    category: 'Messaging Risk',
    location_name: 'Resident Association, Sector 18',
    lat: 28.6200,
    lng: 77.2150,
    severity: 'Critical'
  });

  await IncidentReport.create({
    title: 'Biometric Scanner Risk',
    category: 'Terminal Safety',
    location_name: 'Industrial Block B',
    lat: 28.6050,
    lng: 77.2000,
    severity: 'Medium'
  });

  console.log('Seed completed successfully!');
}

seed().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
