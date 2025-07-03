# HRMS Notification System Setup

This document explains how to set up the email and WebSocket notification system for leave requests.

## Features

- 📧 **Email notifications** to admin when employees request leave
- 🔔 **Real-time WebSocket notifications** for instant updates
- 📱 **Browser notifications** for desktop alerts
- 📊 **Visual notification counter** in the admin header
- 🎯 **Employee status updates** when leave requests are approved/rejected

## Setup Instructions

### 1. Mailgun Configuration

1. **Create a Mailgun account**: Go to [mailgun.com](https://www.mailgun.com/)
2. **Get your API credentials**:
   - Navigate to "Settings" → "API Keys"
   - Copy your "Private API key" (starts with `key-`)
3. **Get your domain**:
   - Go to "Sending" → "Domains"
   - For testing: Use the sandbox domain (e.g., `sandbox-xyz123.mailgun.org`)
   - For production: Add and verify your custom domain

### 2. Environment Variables

Add these to your `api/.env` file:

```env
# Mailgun Configuration
MAILGUN_API_KEY=your_actual_api_key_here
MAILGUN_DOMAIN=sandbox-xyz123.mailgun.org

# Email Settings
ADMIN_EMAIL=admin@yourcompany.com
CLIENT_URL=http://localhost:5173

# Existing variables
MONGO=your_mongodb_connection_string
PORT=3000
```

### 3. Install Dependencies

Backend dependencies are already installed:

- ✅ `socket.io` - WebSocket server
- ✅ `mailgun.js` - Email service

Frontend dependencies are already installed:

- ✅ `socket.io-client` - WebSocket client

### 4. How It Works

#### When an Employee Requests Leave:

1. **Email sent** to admin with leave details
2. **WebSocket notification** appears in admin header
3. **Browser notification** (if permissions granted)

#### When Admin Updates Leave Status:

1. **Email sent** to employee with status update
2. **WebSocket notification** to employee (if online)
3. **Toast notification** appears on employee screen

### 5. Testing the System

#### Test Email Notifications:

1. Add your email to `ADMIN_EMAIL` in `.env`
2. In Mailgun sandbox, add your email to "Authorized Recipients"
3. Have an employee submit a leave request
4. Check your email for the notification

#### Test WebSocket Notifications:

1. Open admin dashboard in one browser tab
2. Open employee dashboard in another tab
3. Submit a leave request from employee side
4. Watch for real-time notification in admin header

#### Test Browser Notifications:

1. Allow notifications when prompted
2. Submit a leave request
3. Check for desktop notification

### 6. Production Setup

#### For Production Deployment:

1. **Verify a custom domain** in Mailgun for better email deliverability
2. **Update environment variables**:
   ```env
   MAILGUN_DOMAIN=yourdomain.com
   CLIENT_URL=https://yourapp.vercel.app
   ADMIN_EMAIL=admin@yourdomain.com
   ```
3. **Configure CORS** in `api/index.js` to include your production domain

### 7. Customization

#### Email Templates:

- Edit templates in `api/services/emailService.js`
- Customize HTML design, colors, and content

#### Notification Behavior:

- Modify notification logic in `AdminNotifications.jsx`
- Change notification duration, sounds, or styling

#### WebSocket Events:

- Add new event types in `api/controllers/leave.controller.js`
- Handle additional events in frontend components

### 8. Troubleshooting

#### Email Not Sending:

- Check Mailgun API key and domain
- Verify recipient email is authorized (for sandbox)
- Check server logs for error messages

#### Email Sending But Not Received:

**🔥 IMPORTANT: For Mailgun Sandbox domains, you MUST authorize recipients:**

1. **Go to Mailgun Dashboard**
2. **Navigate to**: "Sending" → "Domains"
3. **Click on your sandbox domain**: `sandbox84ebb0bf235c42d4b9fd9f4ab5e14d2d.mailgun.org`
4. **Scroll to "Authorized Recipients"**
5. **Add your admin email**: `sgpanchal2005@gmail.com`
6. **Click "Save Recipient"**
7. **Check your Gmail** for a verification email from Mailgun
8. **Click the verification link** in that email

**Other Email Issues:**

- Check Gmail spam/promotions folder
- Check Mailgun logs in dashboard under "Sending" → "Logs"
- Verify the "from" address uses the exact sandbox domain
- For production, upgrade to a paid plan or verify a custom domain

#### WebSocket Not Connecting:

- Verify CORS configuration
- Check browser console for connection errors
- Ensure both client and server are running

#### Notifications Not Appearing:

- Check browser notification permissions
- Verify user roles (admin vs employee)
- Check Redux store for user data

### 9. Security Considerations

- ✅ API keys stored in environment variables
- ✅ CORS properly configured
- ✅ Credentials included in requests
- ✅ Input validation on email data

### 10. File Structure

```
api/
├── services/
│   └── emailService.js          # Mailgun email service
├── controllers/
│   └── leave.controller.js      # Leave logic with notifications
└── index.js                     # WebSocket server setup

client/src/
├── context/
│   └── SocketContext.jsx        # WebSocket context provider
├── components/
│   ├── AdminNotifications.jsx   # Admin notification bell
│   └── EmployeeNotifications.jsx # Employee notification handler
└── App.jsx                      # Socket provider integration
```

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Review server logs for email/WebSocket errors
3. Verify environment variables are correctly set
4. Test with sandbox domain first before production
