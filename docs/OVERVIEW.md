# Hands - Driver Screening Platform

Hands is an API and web app designed to simplify the driver screening and on-boarding process. For the MVP, we'll use Supabase to create a seamless registration and job application workflow, allowing candidates to register, complete their profiles, and apply for jobs.

**Tech Stack**: Supabase for the backend, TanStack UI for the frontend, hosted on Netlify.

---

## Business Goals

### Primary Objectives

1. **Streamline Driver Recruitment**
   - Reduce time-to-hire by automating application collection and processing
   - Centralize candidate data in a single, searchable system
   - Eliminate manual data entry and paper-based processes

2. **Ensure Compliance**
   - Automatically collect all required FMCSA (Federal Motor Carrier Safety Administration) documentation
   - Maintain audit trails for all candidate information and employment history
   - Ensure all DOT-regulated fields are complete before processing
   - Generate standardized PDF packets matching HR requirements (HT Bar application form)

3. **Improve Candidate Quality**
   - Collect comprehensive employment history (3 years + 7 years for CDL positions)
   - Validate all required information (CDL numbers, SSN, addresses)
   - Capture background check authorizations upfront
   - Enable dynamic job-specific questions to filter candidates

4. **Enhance HR Efficiency**
   - Provide managers with organized dashboards for candidate review
   - Generate ready-to-fax PDF packets automatically
   - Store all documents centrally for easy access
   - Enable manual review and decision workflows

5. **Data-Driven Hiring**
   - Track application statuses and candidate pipeline
   - Filter and sort candidates by qualifications
   - Generate reports on hiring metrics
   - Maintain historical records for future positions

---

## Manager/HR Experience

### Job Posting Management

**Workflow:**

1. Manager logs into the platform
2. Creates a new job posting with:
   - Job title and description
   - Required qualifications (CDL class, experience, etc.)
   - Dynamic job-specific questions
   - Document requirements
3. Publishes job posting (visible to candidates)
4. Can edit or delete job postings as needed

**Features:**

- Add, modify, and delete job ads
- Set job-specific questions that candidates must answer
- Define required documents (resumes, licenses, certifications)
- View number of applications per job posting

### Candidate Dashboard

**Workflow:**

1. Manager accesses the Candidates Dashboard
2. Views all candidate profiles with key information:
   - Personal information (name, contact, CDL info)
   - Employment history summary
   - Application status
   - Document upload status
3. Filters candidates by:
   - Job applied for
   - Application status
   - CDL class
   - Experience level
   - Location
4. Sorts by various criteria (date applied, name, status)
5. Clicks on a candidate to view full profile

**Features:**

- Sortable, filterable candidate list
- Search functionality
- Quick view of candidate status
- Link to full candidate profile and application

### Applications Dashboard

**Workflow:**

1. Manager accesses the Applications Dashboard
2. Views chronological list of all applications
3. Sees application status for each:
   - New (needs review)
   - Under Review
   - Approved
   - Rejected
4. Filters by status, job, or date range
5. Selects an application to review in detail

**Features:**

- Chronological view of all applications
- Status tracking and updates
- Filter by multiple criteria
- Quick actions (approve/reject)

### Application Review Process

**Workflow:**

1. Manager selects an application to review
2. Reviews complete candidate information:
   - Personal information and CDL details
   - Driving experience (equipment types, miles, years)
   - Complete employment history (3 years + 7 years CDL)
   - Background questions (9 yes/no questions with details)
   - Emergency contacts
   - Uploaded documents (resumes, licenses)
3. Validates all required information is complete
4. Makes decision:
   - **Approve**: Generate PDF packet for HR processing
   - **Reject**: Mark application as rejected with optional notes
   - **Request More Info**: Send candidate a request for additional information
5. If approved, PDF packet is automatically generated and stored

**Features:**

- Complete candidate profile view
- Document viewer for uploaded files
- Application status management
- Notes/comments for internal tracking
- PDF generation on approval

### PDF Generation

**Workflow:**

1. Manager approves a candidate application
2. System automatically generates PDF packet matching HT Bar application form structure
3. PDF includes all required sections:
   - Personal Information
   - Driving Experience
   - Employment History (with verification forms)
   - Background Questions (9 questions with details)
   - Emergency Contacts
   - Authorizations (FMCSA, HireRight, PSP)
   - Uploaded Documents
4. PDF is stored in Supabase Storage
5. Manager can download or fax PDF directly from the system
6. HR team has centralized access to all generated packets

**Features:**

- Automatic PDF generation matching HR requirements
- Centralized storage for all packets
- Download and fax capabilities
- PDF versioning and timestamps
- Audit trail for generated packets

---

## Candidate Experience

### Registration & Profile Creation

**Workflow:**

1. Candidate visits the platform
2. Creates an account (email/password via Supabase Auth)
3. Completes initial profile:
   - Personal information (name, SSN, DOB, phone)
   - Present address and address history (last 3 years)
   - CDL number and state
   - Driving experience (equipment types, miles, years)
4. System validates all required fields
5. Profile saved and can be edited later

**Features:**

- Step-by-step profile creation
- Real-time validation
- Save and continue later
- Progress indicators

### Employment History Collection

**Workflow:**

1. Candidate navigates to Employment History section
2. Adds employment records:
   - **Last 3 years**: All employers (with gaps explained)
   - **Additional 7 years**: CDL employers only
3. For each employer, provides:
   - Company name and address
   - Employment dates
   - Supervisor name and contact
   - Reason for leaving
   - Whether CDL was required
4. Explains any employment gaps over 1 month
5. System validates completeness and dates

**Features:**

- Guided employment history entry
- Gap detection and explanation prompts
- Employment verification form preparation
- Clear distinction between regular and CDL employment

### Background Questions

**Workflow:**

1. Candidate answers 9 required background questions:
   1. Criminal felony/misdemeanor charges?
   2. Denied license/permit/privilege?
   3. License suspended/revoked?
   4. DWI/DUI conviction in last 10 years?
   5. Positive alcohol/drug test in last 3 years?
   6. Refused alcohol/drug test in last 3 years?
   7. Denied job due to failed test in last 3 years?
   8. Discharged or requested to resign?
   9. Ability to perform job functions?
2. For any "yes" answers, provides detailed explanations
3. System saves all responses

**Features:**

- Clear yes/no questions with explanation fields
- Required field validation
- Save progress

### Document Upload

**Workflow:**

1. Candidate navigates to Documents section
2. Uploads required documents:
   - Resume/CV
   - CDL license copy
   - Other certifications (if applicable)
3. System validates file types and sizes
4. Documents are stored securely in Supabase Storage
5. Candidate can view, replace, or delete uploaded documents

**Features:**

- Drag-and-drop upload
- File type validation (PDF, images)
- File size limits
- Preview uploaded documents
- Replace/delete capabilities

### Emergency Contacts

**Workflow:**

1. Candidate adds up to 3 emergency contacts
2. For each contact, provides:
   - Full name
   - Address (city, state, zip)
   - Relationship
   - Telephone number
3. System validates contact information

**Features:**

- Simple contact entry form
- Validation for phone numbers and addresses
- Required field indicators

### Authorizations & Releases

**Workflow:**

1. Candidate reviews required authorizations:
   - Applicant certification (agreement to terms)
   - FMCSA Drug and Alcohol Clearinghouse authorization (49 CFR 382.701)
   - HireRight background check authorization
   - PSP (Pre-Employment Screening Program) authorization
2. Reads disclosures and legal language
3. Electronically signs each authorization
4. System records timestamp and signature

**Features:**

- Clear disclosure presentation
- Required reading before signing
- Electronic signature capture
- Legal compliance language included

### Job Application Process

**Workflow:**

1. Candidate browses available job postings
2. Views job details and requirements
3. Selects a job to apply for
4. Reviews profile completeness
5. Answers job-specific questions (if any)
6. Reviews and confirms all uploaded documents
7. Submits application
8. Receives confirmation and application tracking number
9. Can track application status in dashboard

**Features:**

- Job browsing and search
- Application status tracking
- Email notifications for status changes
- Application history

### Application Status Tracking

**Workflow:**

1. Candidate views Application Dashboard
2. Sees all submitted applications with status:
   - Submitted (awaiting review)
   - Under Review
   - Approved (PDF generated)
   - Rejected
   - More Information Requested
3. Can view details of each application
4. Receives notifications when status changes

**Features:**

- Real-time status updates
- Application history
- Status change notifications
- View application details

---

## Related Workflows

### Application Submission Workflow

```
1. Candidate completes profile
   ↓
2. Candidate adds employment history
   ↓
3. Candidate answers background questions
   ↓
4. Candidate uploads documents
   ↓
5. Candidate adds emergency contacts
   ↓
6. Candidate signs authorizations
   ↓
7. Candidate browses and selects job
   ↓
8. Candidate answers job-specific questions
   ↓
9. Candidate submits application
   ↓
10. Application status: "Submitted"
    ↓
11. Manager receives notification
    ↓
12. Manager reviews application
    ↓
13a. APPROVED → Generate PDF → Status: "Approved"
13b. REJECTED → Status: "Rejected" (with notes)
13c. MORE INFO → Status: "More Information Requested"
```

### PDF Generation Workflow

```
1. Manager approves application
   ↓
2. System validates all required data is present
   ↓
3. System generates PDF with all sections:
   - Personal Information
   - Driving Experience
   - Employment History (with forms)
   - Background Questions
   - Emergency Contacts
   - Authorizations
   - Document attachments
   ↓
4. PDF stored in Supabase Storage
   ↓
5. Manager can download/fax PDF
   ↓
6. HR team has access to PDF repository
   ↓
7. Application status updated to "Approved"
```

### Profile Validation Workflow

```
1. Candidate enters information
   ↓
2. System validates in real-time:
   - SSN format
   - CDL number format
   - Address completeness
   - Phone number format
   - Email format
   - Required fields
   ↓
3. If validation fails:
   - Show error message
   - Highlight field
   - Prevent submission
   ↓
4. If validation passes:
   - Allow saving
   - Show success indicator
```

### Employment Gap Detection Workflow

```
1. Candidate enters employment history
   ↓
2. System calculates gaps between employment periods
   ↓
3. If gap > 1 month:
   - Flag gap
   - Prompt for explanation
   - Require explanation before submission
   ↓
4. System validates gap explanations are provided
```

### Document Upload Workflow

```
1. Candidate selects file to upload
   ↓
2. System validates:
   - File type (PDF, images)
   - File size (< 50MB)
   ↓
3. If invalid:
   - Show error
   - Reject upload
   ↓
4. If valid:
   - Upload to Supabase Storage
   - Store metadata in database
   - Show preview
   - Mark as uploaded
```

### Manager Review Workflow

```
1. Manager views Applications Dashboard
   ↓
2. Manager filters/sorts applications
   ↓
3. Manager selects application to review
   ↓
4. Manager reviews:
   - Complete profile
   - Employment history
   - Background questions
   - Documents
   - Application answers
   ↓
5. Manager makes decision:
   - Approve → Generate PDF
   - Reject → Add notes
   - Request Info → Send notification
   ↓
6. System updates application status
   ↓
7. Candidate receives notification
```

---

## Next Steps

### M1: Job Posting & Application Workflow

**Goal**: Enable managers to post job ads and candidates to apply for positions.

**Key Tasks:**

- Create the job posting management interface for managers (add, modify, delete ads)
- Implement the job application flow for candidates, including dynamic job-specific questions
- Ensure candidates can upload necessary documents (licenses, resumes)
- Build candidate registration and profile creation
- Implement employment history collection (3 years + 7 years CDL)
- Add background questions section
- Create emergency contacts form
- Implement authorization and release forms

### M2: Dashboards & Review Workflow

**Goal**: Build dashboards for managers to view candidates and application statuses.

**Key Tasks:**

- Develop the Candidates Dashboard with sortable, filterable profiles
- Build the Applications Dashboard with a chronological view of applications
- Allow managers to manually review, accept, or reject candidates
- Implement application status tracking
- Add notification system for status changes

### M2: PDF Generation & Document Storage

**Goal**: Implement PDF generation for candidate profiles and application details.

**Key Tasks:**

- Generate a PDF containing candidate profiles, application data, and uploaded documents
- Match HT Bar application form structure exactly
- Include all required sections (personal info, employment, background questions, etc.)
- Store the generated PDFs in Supabase Storage for HR access
- Enable download and fax capabilities for managers
- Implement PDF versioning and audit trails
