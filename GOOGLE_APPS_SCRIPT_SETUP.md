# Google Apps Script Setup — Step by Step

## Step 1: Google Sheet Setup

1. **Google Sheets** kholo → naya sheet banao ya existing sheet use karo
2. Sheet ID note karo — URL se: `https://docs.google.com/spreadsheets/d/SHEET_ID_YAHAN/edit`
3. Sheet1 me pehli row me headers daalo:

| Timestamp | Name | Mobile No. | Email | Problem Description |
|-----------|------|-----------|-------|---------------------|

---

## Step 2: Google Apps Script Create Karo

1. **[script.google.com](https://script.google.com)** kholo → **New project**
2. Project name do: `Ruqfa Contact Form`
3. Default code delete karo
4. `google-apps-script-code.js` ka **poora code** wahan paste karo
5. Agar alag sheet use kar rahe ho: **SPREADSHEET_ID** update karo (line 17)
6. **Save** karo (Ctrl+S)

---

## Step 3: Web App Deploy Karo

1. **Deploy** button → **New deployment**
2. ⚙️ Gear icon click karo → **Web app** select karo
3. Settings:
   - **Description**: `Contact Form API`
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
4. **Deploy** click karo
5. Pehli baar **Authorize access** maangega → **Allow** karo
6. ✅ **Web app URL** copy karo

---

## Step 4: Frontend me URL Set Karo

1. `frontend/script.js` kholo
2. Line 13 pe `CONTACT_API` dhundho
3. `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` replace karo apne deployed URL se:

```javascript
const CONTACT_API = 'https://script.google.com/macros/s/AKfycbw.../exec';
```

4. Save karo aur website deploy karo

---

## Step 5: Test Karo

1. Browser me URL khol ke test karo (GET request → "API is working!" message aana chahiye)
2. Website pe form submit karo
3. Google Sheet check karo — naya row aana chahiye

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS error | Make sure `Content-Type: text/plain` use ho raha hai (already updated in script.js) |
| 403 error | Script ko redeploy karo — **Who has access: Anyone** set karo |
| Data nahi aa raha | Sheet name check karo — `Sheet1` hona chahiye |
| Script update karna hai | Deploy → **Manage deployments** → existing deployment edit karo |

> ⚠️ **Important**: Jab bhi Apps Script code change karo, dobara deploy karna padega — **Deploy → Manage deployments → Edit → Version: New version**
