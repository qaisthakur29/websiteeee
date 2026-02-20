/**
 * Google Apps Script Code — Ruqfa Marketing Contact Form
 * 
 * ═══════════════════════════════════════════════════════════
 * INSTRUCTIONS:
 * 1. script.google.com → New project
 * 2. Purana code delete karke ye code paste karo
 * 3. SPREADSHEET_ID me apna sheet ID daalo
 * 4. Save → Deploy → New deployment → Web app
 * 5. Execute as: Me, Who has access: Anyone
 * 6. Deploy → Web app URL copy karo
 * 7. Frontend me script.js me CONTACT_API me ye URL paste karo
 * ═══════════════════════════════════════════════════════════
 */

// ─── Apna Spreadsheet ID yahan daalo ───────────────────────
var SPREADSHEET_ID = '133QI6p70OFHMSAksLMjgeeqFsomA85ylj6UOEKUli7Y';
var SHEET_NAME = 'Sheet1';

/**
 * POST request handler — form data receive karke Sheet me save karta hai
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

    // Form data parse karo (Content-Type: text/plain se bhi JSON aata hai)
    var data = JSON.parse(e.postData.contents);
    var name = data.name || '';
    var mobile = data.mobile || '';
    var email = data.email || '';
    var problem = data.problem || '';

    // Validation
    if (!name || !email) {
      return sendResponse({ success: false, message: 'Name and email are required.' });
    }

    // Timestamp — kab submit hua
    var timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Row append karo: Timestamp | Name | Mobile | Email | Problem
    sheet.appendRow([timestamp, name.trim(), mobile.trim(), email.trim(), problem.trim()]);

    return sendResponse({ success: true, message: 'Data saved successfully!' });

  } catch (error) {
    return sendResponse({ success: false, message: 'Failed to save: ' + error.toString() });
  }
}

/**
 * GET request handler — testing ke liye (browser me URL open karke check karo)
 */
function doGet(e) {
  return sendResponse({ success: true, message: 'Ruqfa Contact Form API is working!' });
}

/**
 * JSON response bhejta hai with CORS headers
 */
function sendResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
