# RecruitFlow RMS — Planning Documentation

This folder is the **architectural foundation** for turning the existing RecruitFlow public
website into a production-grade **Recruitment Management System (RMS)** for a real staffing agency.

> **Status:** Planning only. No production code has been written yet. These documents are meant to be
> read, challenged, and approved *before* implementation begins.

## Read in this order

| # | Document | What it answers |
|---|----------|-----------------|
| 01 | [Architecture](./01-ARCHITECTURE.md) | Current state vs. target, tech decisions, how the migration works |
| 02 | [Database Schema](./02-DATABASE-SCHEMA.md) | Every table, relationship, index, and how data flows |
| 03 | [Security & RBAC](./03-SECURITY-RBAC.md) | Roles, permission matrix, field-level security, file security, client ownership |
| 04 | [Features & Workflows](./04-FEATURES.md) | Feature-by-feature specs for public site and dashboard |
| 05 | [Implementation Roadmap](./05-ROADMAP.md) | Phased delivery plan with milestones |
| 06 | [Open Questions & Decisions](./06-OPEN-QUESTIONS.md) | What I need from you, edge cases, and risks |

## The one-paragraph summary

RecruitFlow becomes a **single Next.js application** with two zones: a **public zone** (the existing
approved marketing site + job listings + intake forms, no login) and a **private dashboard zone**
(internal agency users only, behind Supabase Auth with role-based access). Every candidate,
employer, hiring request, job, application, note, and file lives in **Supabase PostgreSQL** and
**Supabase Storage**, with **Row-Level Security** enforcing who can see what — down to the field
level for sensitive employer data. The whole thing is owned end-to-end by the client on their own
GitHub, Vercel, and Supabase accounts, so no developer can ever hold the business hostage again.

## Version 1 scope, in one line

Digitize the agency's manual workflow (candidates, employers, jobs, applications, notes, documents,
placements) into one secure internal dashboard — **without** public candidate/employer logins, and
**without** redesigning the approved public site.
