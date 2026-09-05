# 🏠 Real Estate & Legal Verification Platform

A full-stack real estate platform that allows users to **buy and sell properties** while providing a secure way to **verify property documents through registered lawyers/legal advisors**.

The platform connects property buyers and sellers with legal professionals who can review property documents, set their own verification fees, and provide verification reports.

---

## 🚀 Features

### 👤 User Features

Users can:

* Create an account and sign in
* Browse available properties
* Search and filter properties
* Buy properties
* List properties for sale
* Upload property documents
* Save properties
* Contact property owners
* Schedule property visits
* Request legal document verification
* Select a lawyer based on rating and verification fee
* Pay for document verification
* Track verification requests
* View verification reports
* Communicate with lawyers

---

### ⚖️ Lawyer / Legal Advisor Features

Lawyers have a separate dashboard where they can:

* Create a lawyer account
* Submit legal credentials for verification
* Set their own document verification fee
* Receive verification requests
* Accept or reject requests
* Review uploaded property documents
* Request additional documents
* Add remarks and observations
* Approve or reject documents
* Generate verification reports
* View completed verification requests
* Track earnings
* Communicate with users

> Lawyers must be verified by the platform administrator before they can provide document verification services.

---

### 🔐 Authentication & Roles

The platform supports two account types:

```text
USER
 ├── Buy Property
 ├── Sell Property
 ├── Upload Documents
 ├── Hire Lawyer
 └── Track Verification

LAWYER
 ├── Verify Documents
 ├── Set Verification Fee
 ├── Manage Requests
 └── Generate Reports
```

Role-based access control ensures that users and lawyers only have access to the features relevant to their accounts.

---

## 📄 Document Verification

One of the core features of the platform is property document verification.

A user can upload documents such as:

* Sale Deed
* Title Deed
* Encumbrance Certificate
* Property Tax Receipts
* Previous Ownership Documents
* Building Approval Documents
* Other relevant property documents

### Verification Flow

```text
User uploads documents
          ↓
Selects a lawyer
          ↓
Views lawyer's verification fee
          ↓
Makes payment
          ↓
Verification request created
          ↓
Lawyer reviews documents
          ↓
Lawyer adds remarks
          ↓
Verified / Rejected
          ↓
Verification report generated
```

### Verification Status

A request can move through different stages:

```text
PENDING
   ↓
ACCEPTED
   ↓
IN REVIEW
   ↓
NEEDS CLARIFICATION
   ↓
RE-SUBMITTED
   ↓
VERIFIED / REJECTED
```

---

## 💰 Lawyer Verification Fees

Lawyers can set their own verification fees.

For example:

| Lawyer   | Rating | Documents Verified |    Fee |
| -------- | -----: | -----------------: | -----: |
| Lawyer A |  ⭐ 4.9 |                230 | ₹1,500 |
| Lawyer B |  ⭐ 4.7 |                184 | ₹1,200 |
| Lawyer C |  ⭐ 4.8 |                310 | ₹2,000 |

Users can compare lawyers and choose the professional they want to handle their document verification.

---

## 🏡 Property Marketplace

Users can list and discover properties.

Each property can contain:

* Property title
* Property type
* Price
* Location
* Area
* Bedrooms
* Bathrooms
* Description
* Amenities
* Property images
* Seller information
* Verification status

### Property Listing Flow

```text
Create Listing
      ↓
Add Property Details
      ↓
Upload Images
      ↓
Upload Documents
      ↓
Submit Listing
      ↓
Admin Review
      ↓
Published
```

---

## 🔐 Admin Dashboard

The platform also includes an administrator dashboard.

Admins can:

* Manage users
* Manage lawyers
* Verify lawyer credentials
* Approve/reject lawyer accounts
* Review property listings
* Approve/reject properties
* Manage reported listings
* Monitor verification requests
* Manage platform activity
* View platform statistics

---

## 📊 Dashboards

### User Dashboard

```text
Dashboard
│
├── Overview
├── Buy Property
├── Sell Property
├── My Properties
├── Saved Properties
│
├── Document Verification
│   ├── New Request
│   ├── Pending
│   ├── In Review
│   └── Completed
│
├── Messages
├── Appointments
├── Profile
└── Settings
```

### Lawyer Dashboard

```text
Dashboard
│
├── Overview
├── Verification Requests
│   ├── Pending
│   ├── In Review
│   └── Completed
│
├── Verification Fee
├── Earnings
├── Verification History
├── Messages
├── Profile
└── Settings
```

### Admin Dashboard

```text
Dashboard
│
├── Overview
├── Users
├── Lawyers
├── Properties
├── Verification Requests
├── Reports
└── Settings
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* Next.js API Routes / Server Actions
* Node.js

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* Auth.js / NextAuth

### File Storage

* Cloudinary / Cloudflare R2

### Payments

* Razorpay / Stripe

### Maps

* Google Maps API / Mapbox

### Deployment

* Vercel
* PostgreSQL Cloud Database

---

## 🏗️ Project Structure

```text
real-estate-platform/
│
├── app/
│   ├── page.tsx
│   │
│   ├── login/
│   ├── signup/
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── profile/
│   │   ├── properties/
│   │   ├── saved/
│   │   ├── verification/
│   │   ├── messages/
│   │   └── settings/
│   │
│   ├── buy/
│   ├── sell/
│   │
│   ├── property/
│   │   └── [id]/
│   │
│   ├── lawyers/
│   │   └── [id]/
│   │
│   └── admin/
│       ├── page.tsx
│       ├── users/
│       ├── lawyers/
│       ├── properties/
│       └── verification/
│
├── components/
│   ├── Navbar.tsx
│   ├── PropertyCard.tsx
│   ├── SearchBar.tsx
│   ├── PropertyFilters.tsx
│   ├── DashboardSidebar.tsx
│   └── DocumentUploader.tsx
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── lib/
│
└── README.md
```

---

## 🗄️ Core Database Models

The application will contain models such as:

```text
User
Property
PropertyImage
Document
LawyerProfile
VerificationRequest
VerificationReport
Payment
Message
Appointment
Review
Notification
Report
```

### User

```text
id
name
email
phone
password
role
createdAt
```

Roles:

```text
USER
LAWYER
ADMIN
```

### Property

```text
id
ownerId
title
description
price
location
propertyType
area
bedrooms
bathrooms
status
createdAt
```

### Lawyer Profile

```text
userId
licenseNumber
credentials
verificationFee
rating
verified
createdAt
```

### Verification Request

```text
id
propertyId
userId
lawyerId
amount
status
remarks
createdAt
```

---

## 🔒 Security

The platform should implement:

* Secure authentication
* Password hashing
* Role-based authorization
* Protected dashboards
* Secure document uploads
* File type validation
* File size restrictions
* Payment verification
* Secure API endpoints
* Access control for private documents
* Lawyer credential verification

Property documents can contain highly sensitive information, so access should be restricted to the **property owner, assigned lawyer, and authorized administrators**.

---

## ⚠️ Legal Disclaimer

The platform's document verification feature is intended to facilitate review by qualified legal professionals.

A verification result should **not automatically be presented as a guarantee that a property is completely free from legal, ownership, financial, or regulatory issues**.

The final verification report should clearly state the scope and limitations of the lawyer's review.

---

## 🗺️ Development Roadmap

### Phase 1 — Project Setup

* [ ] Initialize Next.js project
* [ ] Configure Tailwind CSS
* [ ] Configure database
* [ ] Set up Prisma

### Phase 2 — Authentication

* [ ] User signup
* [ ] User login
* [ ] Lawyer signup
* [ ] Role-based authentication
* [ ] Protected routes

### Phase 3 — User Dashboard

* [ ] Dashboard
* [ ] Profile
* [ ] Saved properties
* [ ] My properties
* [ ] Settings

### Phase 4 — Property Marketplace

* [ ] Property listing
* [ ] Property search
* [ ] Filters
* [ ] Property details
* [ ] Image uploads
* [ ] Save property

### Phase 5 — Lawyer System

* [ ] Lawyer profile
* [ ] Credential submission
* [ ] Admin lawyer verification
* [ ] Lawyer dashboard
* [ ] Lawyer fee management

### Phase 6 — Document Verification

* [ ] Document upload
* [ ] Lawyer selection
* [ ] Verification request
* [ ] Document review
* [ ] Remarks
* [ ] Approve/reject
* [ ] Verification report

### Phase 7 — Payments

* [ ] Payment integration
* [ ] Verification fee payment
* [ ] Payment history
* [ ] Lawyer earnings

### Phase 8 — Communication

* [ ] User-laywer messaging
* [ ] Notifications
* [ ] Appointment scheduling

### Phase 9 — Admin

* [ ] Admin dashboard
* [ ] User management
* [ ] Lawyer management
* [ ] Property management
* [ ] Verification management
* [ ] Reports and analytics

### Phase 10 — Deployment

* [ ] Production database
* [ ] Environment variables
* [ ] Deploy frontend/backend
* [ ] Configure storage
* [ ] Configure payment gateway
* [ ] Testing and security review

---

## 🎯 Project Goal

The goal of this project is to create a trusted digital ecosystem for real estate where users can **discover, buy, and sell properties** while having access to **professional legal document verification** before making important property decisions.

Instead of simply listing properties, the platform aims to add an additional layer of trust by connecting users with verified legal professionals who can review relevant property documents.

---

## 🚀 Future Improvements

Potential future features include:

* AI-assisted document analysis
* Property price prediction
* Fraud detection
* Property recommendations
* Digital agreements
* E-signatures
* Advanced property maps
* Mortgage/loan integration
* Property valuation
* Automated notifications
* Lawyer reviews and ratings
* Multi-language support
* Mobile application

---

## 📌 Project Status

**Currently in development.**

More features and improvements will be added as development progresses.
