/**
 * Contact form API → Google Sheets
 * Uses service account in GOOGLE_APPLICATION_CREDENTIALS (or CREDENTIALS_PATH).
 * Share your Google Sheet with: website@website-488003.iam.gserviceaccount.com
 */
require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// CORS so frontend on another port/origin can post
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME || 'Sheet1';
const PORT = process.env.PORT || 3001;

function getCredentialsPath() {
  const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.CREDENTIALS_PATH;
  if (envPath && fs.existsSync(envPath)) return envPath;
  // Default: App folder or folder above App (credentials file next to "App")
  const inApp = path.join(__dirname, '..', 'website-488003-e84749b32e0a.json');
  const aboveApp = path.join(__dirname, '..', '..', 'website-488003-e84749b32e0a.json');
  if (fs.existsSync(inApp)) return inApp;
  if (fs.existsSync(aboveApp)) return aboveApp;
  return envPath || null;
}

async function getSheetsClient() {
  const credPath = getCredentialsPath();
  if (!credPath) throw new Error('Missing credentials. Set CREDENTIALS_PATH or GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.');
  const auth = new google.auth.GoogleAuth({
    keyFile: credPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient });
}

// POST /api/contact — append one row to Google Sheet
app.post('/api/contact', async (req, res) => {
  const { name, mobile, email, problem } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  if (!SPREADSHEET_ID) {
    return res.status(500).json({
      success: false,
      message: 'Server not configured. Set SPREADSHEET_ID in .env',
    });
  }

  try {
    const sheets = await getSheetsClient();
    // Columns match your sheet: Name, Mobile No., Email, Problem Description
    const row = [String(name).trim(), String(mobile || '').trim(), String(email).trim(), String(problem || '').trim()];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('Sheets error:', err.message);
    const message = err.code === 404 || (err.message && err.message.includes('Unable to parse range'))
      ? 'Spreadsheet not found or sheet name wrong. Check SPREADSHEET_ID and SHEET_NAME, and share the sheet with website@website-488003.iam.gserviceaccount.com'
      : 'Failed to save to sheet.';
    return res.status(500).json({ success: false, message });
  }
});

// Optional: serve frontend so form and API are same origin
const frontendDir = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendDir)) {
  app.use(express.static(frontendDir));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) res.sendFile(path.join(frontendDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (!SPREADSHEET_ID) console.warn('Set SPREADSHEET_ID in .env to enable saving to Google Sheets.');
});
