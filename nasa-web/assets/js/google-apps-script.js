/**
 * NASSAA UTH HUB — Google Apps Script for Customer Enquiry Collection
 * =====================================================================
 * HOW TO SET UP (one-time, takes ~5 minutes):
 *
 * STEP 1 — Create Google Sheet:
 *   1. Go to https://sheets.google.com and create a new spreadsheet.
 *   2. Rename it: "NASSAA UTH HUB — Customer Enquiries"
 *   3. In Row 1 (headers), add these columns:
 *      A: Timestamp | B: Name | C: Email | D: Phone | E: Branch | F: Subject | G: Message | H: Status
 *
 * STEP 2 — Open Apps Script Editor:
 *   1. In the Google Sheet: click Extensions → Apps Script
 *   2. Delete all existing code in the editor
 *   3. Paste the ENTIRE code below (starting from "function doPost")
 *   4. Click Save (disk icon or Ctrl+S)
 *   5. Give the project a name: "NASSAA Enquiry Handler"
 *
 * STEP 3 — Deploy as Web App:
 *   1. Click Deploy → New Deployment
 *   2. Click the gear icon next to "Type" → select Web App
 *   3. Description: "Enquiry Form v1"
 *   4. Execute as: Me (your Google account)
 *   5. Who has access: Anyone
 *   6. Click Deploy → Authorize access (grant permissions)
 *   7. COPY the Web App URL — it looks like:
 *      https://script.google.com/macros/s/AKfycb.../exec
 *
 * STEP 4 — Paste URL into contact.html:
 *   1. Open contact.html
 *   2. Find the line:  const GOOGLE_SCRIPT_URL = 'YOUR_SCRIPT_URL_HERE';
 *   3. Replace 'YOUR_SCRIPT_URL_HERE' with your copied Web App URL
 *   4. Save contact.html
 *
 * DONE! Every form submission now saves to your Google Sheet automatically.
 * =====================================================================
 */

// ─── PASTE THIS INTO GOOGLE APPS SCRIPT EDITOR ──────────────────────────────

function doPost(e) {
  try {
    // Get the active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming JSON data from the contact form
    var data = JSON.parse(e.postData.contents);

    // Append a new row with all form fields + timestamp
    sheet.appendRow([
      new Date(),                          // Timestamp (Col A)
      data.name    || 'N/A',              // Full Name (Col B)
      data.email   || 'N/A',              // Email (Col C)
      data.phone   || 'Not provided',     // Phone (Col D)
      data.branch  || 'N/A',              // Branch (Col E)
      data.subject || 'N/A',              // Subject (Col F)
      data.message || 'N/A',              // Message (Col G)
      'New'                               // Status (Col H) — change to "Replied" manually
    ]);

    // Auto-format column widths (runs only when sheet has just header row before first entry)
    if (sheet.getLastRow() === 2) {
      sheet.setColumnWidth(1, 160);  // Timestamp
      sheet.setColumnWidth(2, 160);  // Name
      sheet.setColumnWidth(3, 220);  // Email
      sheet.setColumnWidth(4, 150);  // Phone
      sheet.setColumnWidth(5, 140);  // Branch
      sheet.setColumnWidth(6, 180);  // Subject
      sheet.setColumnWidth(7, 360);  // Message
      sheet.setColumnWidth(8, 100);  // Status
    }

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Enquiry saved!' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Return error response (visible in browser console, not to user)
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: handle GET requests so the URL works as a health check
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', service: 'NASSAA UTH HUB Enquiry Handler' }))
    .setMimeType(ContentService.MimeType.JSON);
}
