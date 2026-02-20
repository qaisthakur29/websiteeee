# API Contracts & Backend Integration Plan

## Overview
Frontend-only MVP with mock data has been created. This document outlines the backend integration plan for Google Sheets submission.

## Current Mock Data

### Location: `/app/frontend/src/components/ContactModal.jsx`
**Mock Implementation:**
- Form submission simulates 1-second delay
- Shows success toast notification
- Clears form after submission
- No actual data persistence

**Form Fields:**
- `name` (string, required)
- `mobile` (string, required)
- `email` (string, required)
- `problem` (string, required) - labeled as "Tell us about your podcast"

---

## Backend Requirements

### 1. Google Sheets Integration

**Target Sheet:**
- URL: `https://docs.google.com/spreadsheets/d/133Ql6p7oOFHMSAksLMjgeeqFsomA85ylj6UOEKUIi7Y/edit?usp=sharing`
- Columns: `Name | Mobile No. | Email | Problem Description`

**Backend Endpoint:**
```
POST /api/contact
```

**Request Body:**
```json
{
  "name": "string",
  "mobile": "string",
  "email": "string",
  "problem": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## Implementation Steps

### Phase 1: Backend Setup
1. **Install required packages:**
   - `gspread` - Google Sheets Python API
   - `google-auth` - Google authentication
   - `google-auth-oauthlib` - OAuth flows
   - `google-auth-httplib2` - HTTP library

2. **Create Google Service Account:**
   - Generate service account credentials JSON
   - Share Google Sheet with service account email
   - Store credentials securely in backend

3. **Create Backend API Endpoint:**
   - File: `/app/backend/api/contact.py`
   - Validate incoming data
   - Append row to Google Sheets
   - Return success/error response

### Phase 2: Frontend Integration
1. **Update ContactModal.jsx:**
   - Replace mock API call with actual backend endpoint
   - Use `BACKEND_URL` from environment variables
   - Endpoint: `${BACKEND_URL}/api/contact`
   - Handle loading states
   - Show appropriate error messages

2. **Files to Modify:**
   - `/app/frontend/src/components/ContactModal.jsx` (line 29-35)

---

## Data Flow

```
User fills form → Click Submit → 
Frontend validates → POST to /api/contact → 
Backend validates → Append to Google Sheets → 
Return success → Show toast → Clear form
```

---

## Error Handling

**Frontend:**
- Form validation (required fields, email format, phone format)
- Network errors
- Timeout handling
- User-friendly error messages via toast

**Backend:**
- Input validation
- Google Sheets API errors
- Authentication errors
- Rate limiting
- Logging for debugging

---

## Security Considerations

1. **API Key Protection:**
   - Store Google credentials in `.env` file
   - Never commit credentials to git
   - Use environment variables in production

2. **Input Validation:**
   - Sanitize all inputs on backend
   - Check email format
   - Validate phone number format
   - Limit text length

3. **Rate Limiting:**
   - Prevent spam submissions
   - Implement per-IP rate limiting
   - Consider CAPTCHA if needed

---

## Testing Checklist

**Backend:**
- [ ] Google Sheets connection working
- [ ] Data successfully appended to correct sheet
- [ ] All fields mapping correctly
- [ ] Error handling working
- [ ] Input validation working

**Frontend:**
- [ ] Form submission calls correct endpoint
- [ ] Success toast shows after submission
- [ ] Form clears after success
- [ ] Error messages display properly
- [ ] Loading state shows during submission

**Integration:**
- [ ] End-to-end submission flow working
- [ ] Data appears in Google Sheets correctly
- [ ] No CORS errors
- [ ] Mobile responsive working

---

## Notes

- Mock data removed after backend integration
- Contact form is the only dynamic feature requiring backend
- All other sections (Work, Services, Process, About, Testimonials) are static content
- Future enhancement: Admin panel to manage portfolio projects
