# Deploy to Netlify

Your site (frontend + contact form → Google Sheets) is set up to deploy on Netlify.

## 1. Push your code to Git

Netlify deploys from a Git repo (GitHub, GitLab, or Bitbucket). If you haven’t already:

- Create a repo and push your `App` project (or the folder that contains `frontend`, `netlify`, and `netlify.toml`).
- **Do not commit** your service account JSON or `.env`. They are in `.gitignore`.

## 2. Connect the site on Netlify

1. Go to [netlify.com](https://www.netlify.com) and sign in.
2. **Add new site** → **Import an existing project**.
3. Choose your Git provider and select the repo.
4. Netlify will read `netlify.toml`. It should show:
   - **Build command:** (leave empty — static site)
   - **Publish directory:** `frontend`
   - **Functions directory:** `netlify/functions`
5. Click **Deploy site**.

## 3. Set environment variables

After the first deploy, set these in the Netlify dashboard so the contact form can write to Google Sheets:

1. **Site** → **Site configuration** → **Environment variables** → **Add a variable** / **Import from .env**.
2. Add:

| Variable | Value | Notes |
|----------|--------|--------|
| `SPREADSHEET_ID` | `133QI6p70OFHMSAksLMjgeeqFsomA85ylj6UOEKUli7Y` | Your “inquires” sheet ID |
| `SHEET_NAME` | `Sheet1` | Optional; default is `Sheet1` |
| `GOOGLE_CREDENTIALS_JSON` | *(see below)* | Full contents of your service account JSON |

**For `GOOGLE_CREDENTIALS_JSON`:**

- Open your `website-488003-e84749b32e0a.json` file.
- Copy the **entire** JSON (one line is fine; keep the `\n` inside the `private_key` string as `\n`).
- In Netlify, create a variable named `GOOGLE_CREDENTIALS_JSON` and paste that JSON as the value (you can use “Secret” so it’s hidden).

3. **Save** and then trigger a **new deploy** (e.g. **Deploys** → **Trigger deploy** → **Deploy site**) so the function picks up the new variables.

## 4. Google Sheet sharing

Make sure your “inquires” Google Sheet is shared with the service account:

- **Share** the sheet with: **website@website-488003.iam.gserviceaccount.com** as **Editor**.

## 5. Test the form

Open your Netlify site URL (e.g. `https://your-site-name.netlify.app`), open “Book a Strategy Call”, submit the form. A new row should appear in your sheet.

---

## Local testing with Netlify (optional)

To run the site and the contact function locally:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. In the project root (where `netlify.toml` is), create a `.env` file with the same variables:
   - `SPREADSHEET_ID=133QI6p70OFHMSAksLMjgeeqFsomA85ylj6UOEKUli7Y`
   - `SHEET_NAME=Sheet1`
   - `GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}` (paste the full JSON; escape quotes if needed or keep it on one line)
3. Run: `netlify dev`
4. Open the URL it prints (e.g. http://localhost:8888) and test the form.

This uses the same function and env vars as production.
