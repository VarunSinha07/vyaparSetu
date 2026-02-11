VyaparSetu

A Multi-Tenant Vendor & Procurement Management Platform for Indian MSMEs

VyaparSetu is a web-based SaaS application built to help Indian MSMEs manage their procurement and vendor payment workflows in a structured and reliable way.

In many small and mid-sized Indian companies, procurement is still handled using Excel sheets, WhatsApp messages, emails, and manual follow-ups. This leads to poor visibility, delayed approvals, payment issues, and missing audit trails. VyaparSetu aims to replace these fragmented processes with a single, role-based system that covers the entire procurement lifecycle.

Problem Statement

In typical Indian MSMEs:

Purchase requests are raised informally

Approvals happen over WhatsApp or email

Vendor details are stored in spreadsheets

Invoice verification is manual

Payments are tracked separately from approvals

These practices often result in delays, payment disputes, GST compliance risks, and lack of accountability.

VyaparSetu addresses these issues by providing a centralized procurement system designed around how Indian MSMEs actually operate.

What VyaparSetu Does

VyaparSetu digitizes the complete procurement lifecycle in one platform:

Purchase Request → Approval → Purchase Order → Invoice → Payment

Each step is company-scoped, role-based, and auditable, ensuring clarity and control throughout the process.

User Roles

Each company using VyaparSetu has internal users with defined roles:

Admin – Company owner or system administrator

Procurement – Raises purchase requests and manages vendors

Manager – Reviews and approves purchase requests

Finance – Verifies invoices and initiates vendor payments

Vendors do not log in to the system. They are managed as external entities, which keeps the workflow simple and aligned with real-world practices.

High-Level System Architecture

Frontend: Web-based dashboard for internal users

Backend: REST APIs handling business logic and RBAC

Database: Centralized relational database with strict tenant isolation

External services:

Razorpay for payments

Email service for user invitations and notifications

Each company’s data is isolated using a companyId, ensuring multi-tenant safety.

Authentication and Security

Authentication is handled using Better Auth

Authorization is enforced at the API level using role-based access control

Each user belongs to exactly one company

Every database query is scoped to the user’s company

Payment status is confirmed only via Razorpay webhooks, not frontend callbacks

Core Modules
Company and User Management

Users sign up and create a company workspace

Admins invite employees via email

Roles determine what actions each user can perform

Vendor Management

Companies can add and manage external vendors

Vendor details include GSTIN, PAN, and bank information

Only authorized roles can add or edit vendors

Purchase Requests (PR)

Raised by Procurement or Admin users

Includes purchase justification, department, estimated amount, and priority

PR lifecycle:

DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED / REJECTED

Approval Workflow

Single-level approval by Manager or Admin

Approval or rejection includes comments

All actions are recorded for audit purposes

Purchase Orders (PO)

Created only after a PR is approved

One PO per PR

PO lifecycle:

DRAFT → ISSUED → CANCELLED

Issued POs are locked and cannot be edited

Invoice Upload and Verification

Invoices are uploaded against issued POs

Invoice numbers are entered exactly as provided by vendors

Finance verifies invoice amounts and GST breakup

Invoice lifecycle:

UPLOADED → VERIFIED / REJECTED / MISMATCH

Vendor Payments

Only Finance users can initiate payments

Payments are made using Razorpay

Razorpay webhooks are used as the source of truth

Invoices are marked as PAID only after webhook confirmation

Dashboard and Reports

Dashboard overview is role-aware

Managers see approval-related metrics

Procurement sees execution status

Finance sees payment readiness

Admins get overall visibility

Reports include vendor-wise spend and payment aging

Audit Logs

Tracks all important actions such as:

PR approvals

PO issuance

Invoice verification

Payments

Audit logs are read-only and accessible to Admins

End-to-End Workflow
Create Company
→ Invite Users
→ Add Vendor
→ Create Purchase Request
→ Approve Request
→ Create Purchase Order
→ Upload Invoice
→ Verify Invoice
→ Pay Vendor

Tech Stack

Frontend

Next.js
Tailwind CSS

Backend

Node.js / Express
Prisma ORM

Database
PostgreSQL

Authentication
Better Auth

Payments
Razorpay (Checkout and Webhooks)

Email
Nodemailer

Key Design Decisions

Vendors do not log in to keep workflows simple

Invoice numbers are vendor-provided for GST and audit compliance

Payments are confirmed only via Razorpay webhooks

Single-level approval reflects Indian MSME reality

Strict tenant isolation prevents cross-company data access

Future Enhancements

Vendor read-only dashboard

Multi-level approval workflows

Invoice OCR

Inventory tracking

Accounting software integrations

Why This Project Matters

VyaparSetu is not just a CRUD application. It demonstrates:

Real-world problem solving

End-to-end system design

Secure payment handling

Role-based workflows

Audit and compliance awareness

Author

Varun Sinha
Full Stack Developer
