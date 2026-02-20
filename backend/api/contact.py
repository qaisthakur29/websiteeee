from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
import logging
import os

router = APIRouter()
logger = logging.getLogger(__name__)

# Google Sheets configuration
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]
SPREADSHEET_ID = '133Ql6p7oOFHMSAksLMjgeeqFsomA85ylj6UOEKUIi7Y'


class ContactForm(BaseModel):
    name: str
    mobile: str
    email: EmailStr
    problem: str


def get_google_sheets_client():
    """Initialize and return Google Sheets client"""
    try:
        credentials_path = os.path.join(os.path.dirname(__file__), '..', 'google-credentials.json')
        credentials = Credentials.from_service_account_file(
            credentials_path,
            scopes=SCOPES
        )
        client = gspread.authorize(credentials)
        return client
    except Exception as e:
        logger.error(f"Failed to initialize Google Sheets client: {str(e)}")
        raise


@router.post("/contact")
async def submit_contact_form(form_data: ContactForm):
    """
    Submit contact form data to Google Sheets
    """
    try:
        # Validate data
        if not form_data.name or len(form_data.name.strip()) == 0:
            raise HTTPException(status_code=400, detail="Name is required")
        
        if not form_data.mobile or len(form_data.mobile.strip()) == 0:
            raise HTTPException(status_code=400, detail="Mobile number is required")
        
        if not form_data.email:
            raise HTTPException(status_code=400, detail="Email is required")
        
        if not form_data.problem or len(form_data.problem.strip()) == 0:
            raise HTTPException(status_code=400, detail="Problem description is required")
        
        # Get Google Sheets client
        client = get_google_sheets_client()
        
        # Open the spreadsheet
        spreadsheet = client.open_by_key(SPREADSHEET_ID)
        
        # Get the first sheet
        worksheet = spreadsheet.get_worksheet(0)
        
        # Prepare the row data
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        row_data = [
            form_data.name.strip(),
            form_data.mobile.strip(),
            form_data.email.strip(),
            form_data.problem.strip(),
            timestamp
        ]
        
        # Append the row to the sheet
        worksheet.append_row(row_data)
        
        logger.info(f"Contact form submitted successfully for {form_data.email}")
        
        return {
            "success": True,
            "message": "Contact form submitted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting contact form: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to submit contact form. Please try again later."
        )
