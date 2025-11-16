# Email Templates - NSS Portal

## 📧 All Email Templates Sent to Students

---

## 1. 🆕 **New Event Notification**

**Sent when:** A new NSS event is created by Admin/Faculty

**Subject:** `New NSS Event: [Event Title]`

### Text Version:
```
Dear Student,

A new NSS event "[Event Title]" has been created!

Event Details:
- Type: [Event Type]
- Location: [Location]
- Start Date: [Start Date]
- End Date: [End Date]
- Registration Deadline: [Deadline Date]

Log in to the NSS Portal to register for this event.
```

### HTML Version:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #0ea5e9;">New NSS Event Created!</h2>
  <p>Dear Student,</p>
  <p>A new NSS event <strong>[Event Title]</strong> has been created!</p>
  <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p><strong>Event Details:</strong></p>
    <ul>
      <li>Type: [Event Type]</li>
      <li>Location: [Location]</li>
      <li>Start Date: [Start Date]</li>
      <li>End Date: [End Date]</li>
      <li>Registration Deadline: [Deadline Date]</li>
    </ul>
  </div>
  <p>
    <a href="[Frontend URL]/student/events" 
       style="background-color: #0ea5e9; color: white; padding: 10px 20px; 
              text-decoration: none; border-radius: 5px; display: inline-block;">
      View Event
    </a>
  </p>
</div>
```

---

## 2. 📝 **Registration Confirmation**

**Sent when:** Student registers for an event

**Subject:** `Registration Confirmed: [Event Title]`

### Text Version:
```
Dear [Student Name],

Your registration for the event "[Event Title]" has been received and is pending approval.

Event Details:
- Type: [Event Type]
- Location: [Location]
- Date: [Event Date]

You will be notified once your registration is approved.
```

### HTML Version:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #0ea5e9;">Registration Received</h2>
  <p>Dear [Student Name],</p>
  <p>Your registration for the event <strong>[Event Title]</strong> has been received and is pending approval.</p>
  <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p><strong>Event Details:</strong></p>
    <ul>
      <li>Type: [Event Type]</li>
      <li>Location: [Location]</li>
      <li>Date: [Event Date]</li>
    </ul>
  </div>
  <p>You will be notified once your registration is approved.</p>
</div>
```

---

## 3. ✅ **Registration Approved**

**Sent when:** Admin/Faculty approves student's event registration

**Subject:** `Registration Approved: [Event Title]`

### Text Version:
```
Dear [Student Name],

Your registration for "[Event Title]" has been approved!

Event Details:
- Type: [Event Type]
- Location: [Location]
- Start Date: [Start Date]
- End Date: [End Date]

Please make sure to attend the event.
```

### HTML Version:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #10b981;">Registration Approved!</h2>
  <p>Dear [Student Name],</p>
  <p>Great news! Your registration for <strong>[Event Title]</strong> has been approved!</p>
  <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p><strong>Event Details:</strong></p>
    <ul>
      <li>Type: [Event Type]</li>
      <li>Location: [Location]</li>
      <li>Start Date: [Start Date]</li>
      <li>End Date: [End Date]</li>
    </ul>
  </div>
  <p>Please make sure to attend the event.</p>
  <p>
    <a href="[Frontend URL]/student/profile" 
       style="background-color: #10b981; color: white; padding: 10px 20px; 
              text-decoration: none; border-radius: 5px; display: inline-block;">
      View My Profile
    </a>
  </p>
</div>
```

---

## 4. ⏰ **Event Reminder**

**Sent when:** Automated reminder before event starts (default: 1 day before)

**Subject:** `Reminder: [Event Title] in [X] day(s)`

### Text Version:
```
Dear [Student Name],

This is a reminder that you are registered for "[Event Title]" which will start in [X] day(s).

Event Details:
- Type: [Event Type]
- Location: [Location]
- Start Date: [Start Date]
- End Date: [End Date]

Please ensure you are prepared for the event.
```

### HTML Version:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #f59e0b;">Event Reminder</h2>
  <p>Dear [Student Name],</p>
  <p>This is a reminder that you are registered for <strong>[Event Title]</strong> which will start in [X] day(s).</p>
  <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
    <p><strong>Event Details:</strong></p>
    <ul>
      <li>Type: [Event Type]</li>
      <li>Location: [Location]</li>
      <li>Start Date: [Start Date]</li>
      <li>End Date: [End Date]</li>
    </ul>
  </div>
  <p>Please ensure you are prepared for the event.</p>
</div>
```

---

## 5. ✔️ **Contribution Verified**

**Sent when:** Admin/Faculty verifies student's contribution and adds volunteer hours

**Subject:** `Contribution Verified: [Event Title]`

### Text Version:
```
Dear [Student Name],

Your contribution for "[Event Title]" has been verified and [X] volunteer hours have been added to your account.

Your total volunteer hours: [Total Hours]
```

### HTML Version:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #10b981;">Contribution Verified</h2>
  <p>Dear [Student Name],</p>
  <p>Your contribution for <strong>[Event Title]</strong> has been verified and <strong>[X]</strong> volunteer hours have been added to your account.</p>
  <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p><strong>Your total volunteer hours: [Total Hours]</strong></p>
  </div>
</div>
```

---

## 📊 Email Sending Details

### Sender Information
- **Sender Name:** NSS Portal (configurable via `BREVO_SENDER_NAME`)
- **Sender Email:** Configured via `BREVO_SENDER_EMAIL` in `.env`
- **Service Provider:** Brevo (formerly Sendinblue)

### Rate Limiting
- **Delay between emails:** 200ms (to avoid rate limiting)
- **Batch notification:** Progress logged every 10 emails

### Email Service Configuration
Located in: `backend/utils/notifications.js`

Required environment variables:
```env
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=your_verified_email@example.com
BREVO_SENDER_NAME=NSS Portal
FRONTEND_URL=https://your-frontend-url.netlify.app
```

---

## 🎨 Email Design Features

### Common Styling
- **Font:** Arial, sans-serif
- **Max Width:** 600px (mobile-friendly)
- **Colors:**
  - Blue (#0ea5e9) - New events, info
  - Green (#10b981) - Approvals, success
  - Orange (#f59e0b) - Reminders, warnings
  - Gray (#f3f4f6) - Background boxes

### Responsive Design
All emails use inline CSS for maximum compatibility across email clients.

### Call-to-Action Buttons
- Rounded corners (border-radius: 5px)
- High contrast colors
- Clear padding for easy clicking
- Direct links to portal pages

---

## 📋 Email Logging

All email operations are logged:

### Success Example:
```
📧 Attempting to send email to: student@example.com
✅ Email sent successfully to student@example.com. Message ID: <msg-id>
✓ Sent 10/50 emails...
```

### Failure Example:
```
❌ Email send error for student@example.com: Invalid recipient
✗ Failed to send email to student@example.com (John Doe): Invalid recipient
```

### Summary:
```
📊 Email notification summary:
   ✅ Successful: 48
   ❌ Failed: 2
   📧 Total attempted: 50
```

---

## 🔧 Testing Emails

To test email configuration, run:
```bash
cd backend
node utils/test-email.js
```

This will:
1. Check Brevo configuration
2. Verify API key
3. Send a test email
4. Display detailed results

---

## 📝 Notes

1. **Bulk Email Notifications:** When creating a new event, emails are sent to ALL registered students
2. **Individual Notifications:** Registration confirmations, approvals, and reminders are sent individually
3. **Email Validation:** Students without valid email addresses are skipped automatically
4. **Error Handling:** Failed emails are logged but don't stop the notification process
5. **Fallback:** If Brevo is not configured, emails are skipped with warnings logged

---

## 🔗 Useful Links

- Brevo Dashboard: https://app.brevo.com
- Get API Key: https://app.brevo.com/settings/keys/api
- Verify Senders: https://app.brevo.com/senders
- Brevo Documentation: https://developers.brevo.com/

---

**Last Updated:** November 16, 2025
