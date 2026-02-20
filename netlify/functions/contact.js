/**
 * Netlify serverless function: contact form → Google Sheets
 * Set in Netlify: SPREADSHEET_ID, SHEET_NAME (optional), GOOGLE_CREDENTIALS_JSON (full service account JSON string)
 */
const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME || 'Sheet1';

function getSheetsClient() {
  const raw = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!raw) throw new Error('GOOGLE_CREDENTIALS_JSON is not set in Netlify environment.');
  const credentials = typeof raw === 'string' ? JSON.parse(raw) : raw;
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid JSON' }) };
  }

  const { name, mobile, email, problem } = body;
  if (!name || !email) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: 'Name and email are required.' }),
    };
  }

  if (!SPREADSHEET_ID) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'SPREADSHEET_ID not set in Netlify.' }),
    };
  }

  try {
    const sheets = await getSheetsClient();
    const row = [
      String(name).trim(),
      String(mobile || '').trim(),
      String(email).trim(),
      String(problem || '').trim(),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Sheets error:', err.message);
    const message =
      err.code === 404 || (err.message && err.message.includes('Unable to parse range'))
        ? 'Spreadsheet not found or not shared with the service account.'
        : 'Failed to save to sheet.';
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message }) };
  }
};
