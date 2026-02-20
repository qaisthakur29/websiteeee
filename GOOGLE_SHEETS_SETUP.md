# Connect Contact Form to Google Sheets

Your "Book a Strategy Call" form now saves submissions to a Google Sheet using your service account.

## 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it (e.g. "Ruqfa Contact Submissions").
3. In the **first row**, add headers:  
   **Timestamp** | **Name** | **Mobile** | **Email** | **Tell us about your podcast**
4. Copy the **Spreadsheet ID** from the URL:  
   `https://docs.google.com/spreadsheets/d/`**SPREADSHEET_ID**`/edit`

## 2. Share the sheet with the service account

- Click **Share** and add this email as **Editor**:  
  **website@website-488003.iam.gserviceaccount.com**

## 3. Configure the server

1. In the `server` folder, copy the example env file:
   - Windows: `copy .env.example .env`
   - Mac/Linux: `cp .env.example .env`
2. Open `.env` and set:
   - `SPREADSHEET_ID=` your spreadsheet ID from step 1
   - Optionally `SHEET_NAME=Sheet1` if your tab has a different name

The server looks for your credentials file at  
`App/website-488003-e84749b32e0a.json`  
(or the path in `App/server/`).  
If you put the JSON elsewhere, set in `.env`:
- `CREDENTIALS_PATH=C:\path\to\website-488003-e84749b32e0a.json`

## 4. Install and run

```bash
cd server
npm install
npm start
```

Open **http://localhost:3001** and submit the form. Rows will appear in your Google Sheet.

## 5. Production

- Deploy the `server` (e.g. Node on Railway, Render, or a VPS).
- Set `SPREADSHEET_ID` and `CREDENTIALS_PATH` (or `GOOGLE_APPLICATION_CREDENTIALS`) in the host’s environment.
- If the website is on a different domain, set `BACKEND_URL` in `frontend/script.js` to your API base URL (e.g. `https://your-api.com`).

---

**Security:** Keep the service account JSON and `.env` out of version control. Do not commit `website-488003-e84749b32e0a.json` or any file containing the private key.
