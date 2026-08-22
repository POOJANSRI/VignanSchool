# Vignan Insight

Build a production-quality, responsive web application called VIGNAN PARENT VOICE AI for Vignan School, Kondapur, Hyderabad.

Product Vision

Create an AI-powered parent feedback and continuous-improvement platform based on:

LISTEN → UNDERSTAND → IDENTIFY → ACT → MEASURE → IMPROVE

The product must feel like a premium modern school-management SaaS platform—not a generic admin dashboard. The UI should be clean, trustworthy, data-rich, intuitive, and suitable for Principal, HODs, Faculty, Management, Super Admin, and Call Coordinators.

Tagline:

“Listen. Understand. Act. Improve.”

1. Design System & Visual Direction

Use a sophisticated education/SaaS visual language.

Color palette

Primary: Deep Navy #123B63

Secondary: Royal Blue #2563EB

Accent: Teal #0F9D8A

Success: Green #16A34A

Warning: Amber #F59E0B

Danger: Red #DC2626

Background: #F6F8FB

Cards: White

Primary text: #172033

Secondary text: #667085

Borders: #E5E7EB

Use subtle gradients sparingly.

UI style

Rounded cards with 12–16px radius

Soft shadows

Excellent whitespace

Clear typography hierarchy

Modern charts

Status badges

Progress indicators

Interactive filters

Responsive tables

Drawer/modal patterns for details

Accessible contrast

Desktop-first but fully responsive

Avoid excessive decoration

Use Lucide icons or another consistent professional icon library

Use tasteful micro-interactions and hover states

Charts should be visually polished and easy to understand

Create a reusable design system for buttons, cards, badges, tables, charts, filters, forms, modals, alerts and empty states.

2. Application Shell

Create a persistent left sidebar on desktop and collapsible navigation on smaller screens.

Sidebar:

Logo / Vignan School

VIGNAN PARENT VOICE AI

Dashboard

Call Campaigns

Parents & Students

Feedback

Faculty

HOD / Coordinators

Issues

Actions

Reports

AI Assistant

Notifications

Settings

Bottom sidebar:

Current user

Role

Profile

Logout

Top navigation:

Breadcrumb

Global search

Date/period selector

Notifications

User avatar/menu

3. Role-Based Experience

Implement role-aware navigation and permissions for:

Super Administrator

Principal

HOD / Academic Coordinator

Faculty

Management

Feedback / Call Coordinator

Faculty must only see appropriate aggregated/anonymized feedback.

Never expose parent phone numbers, personal contact details or sensitive parent information to Faculty by default.

Recording access must appear permission-controlled.

4. Main Dashboard

Create a high-quality executive dashboard.

Header:

Good afternoon, Principal

Subtitle:

Here’s what parents are saying about Vignan School.

Show a period selector such as:

August 2026 | Last 30 Days | Academic Year 2026–27

KPI cards

Parents Contacted

Completed Calls

Feedback Collected

Response Rate

Average Satisfaction

Critical Issues

Open Actions

Resolution Rate

Example:

1,250
Parents Contacted

1,040
Responses

83.2%
Response Rate

4.2 / 5
Average Satisfaction

Main analytics

Create:

Sentiment distribution donut chart

Positive 68%

Neutral 19%

Negative 13%

Feedback trend line chart

June

July

August

Top concerns horizontal bar chart

Communication

Transportation

Academic Support

Infrastructure

Activities

Top strengths

Critical issues panel

Recent actions

“AI Insight” card with a concise automatically generated executive insight.

Example:

“Parent satisfaction improved over the last three reporting periods, while communication remains the most frequently mentioned improvement area.”

5. Call Campaigns

Create a campaign management module.

Campaign list columns:

Campaign Name

Academic Year

Target Audience

Parents

Completed

Response Rate

Status

Start Date

End Date

Actions

Campaign statuses:

Draft

Scheduled

Running

Paused

Completed

Campaign creation wizard:

Step 1

Campaign details

Step 2

Select audience

Filters:

Grade

Section

Faculty

Subject

Parent language

Step 3

Questionnaire

Allow administrators to configure questions.

Step 4

Calling schedule

Step 5

Consent/recording policy configuration

Step 6

Review and launch

Campaign detail page should show live operational metrics:

Calls queued

Calling

Completed

Failed

Callback requested

No answer

Declined

Language issue

Add a live activity feed.

6. AI Calling Agent

Create a visual call-monitoring interface.

Show:

Current call

Parent reference

Student reference

Preferred language

Call duration

Call status

Consent status

Recording status

Display a conversation transcript in real time.

Use chat-style speech bubbles:

AI Agent
“May I take a few minutes of your time?”

Parent
“Yes, that's fine.”

Show AI-detected information beside the transcript:

Sentiment

Category

Priority

Detected issue

Follow-up required

Provide callback and human-escalation indicators.

Do not make the interface look like a consumer phone app. It should look like a professional call-center/AI operations console.

7. Parent & Student Database

Create a searchable data-management page.

Filters:

Grade

Section

Faculty

Subject

Language

Call Status

Feedback Status

Table:

Student ID

Student Name

Grade

Section

Parent

Relationship

Preferred Language

Faculty

Call Status

Feedback Status

Last Call

Actions

Provide:

Import Excel/CSV

Download template

Export

Add student

Bulk actions

Student detail page should show historical feedback and calls without exposing unnecessary sensitive information.

8. Feedback Explorer

Create a powerful feedback-analysis screen.

Filters:

Date

Grade

Section

Faculty

Subject

Category

Sentiment

Priority

Campaign

Feedback cards should show:

Overall sentiment

Summary

Positive observations

Issues

Categories

Priority

Suggested action

Create a transcript drawer that allows authorized users to inspect the full conversation.

Include a clear privacy/permission indicator before exposing recording or transcript information.

9. Individual Call Report

Create a polished report page.

Title:

Parent Feedback Summary

Show:

Student

Grade/Section

Faculty

Call Date

Duration

Overall Sentiment

Overall Rating

Sections:

AI Summary

Positive Feedback

Issues Identified

Categories

Priority

Suggested Actions

Transcript

Recording

Recording should be permission-gated.

Example issue:

Examination Communication

Priority:

Medium

Suggested Action:

Improve advance communication regarding examination schedules.

10. Faculty Dashboard

Create a dedicated faculty experience.

Header:

My Parent Feedback

Show:

4.2 / 5
Overall Rating

42
Parents Contacted

35
Responses

83.3%
Response Rate

Sentiment

Create a donut chart:

Positive 73%

Neutral 18%

Negative 9%

Faculty strengths

Examples:

Good subject knowledge

Clear explanation of concepts

Regular academic support

Approachable teacher

Good communication

Improvement areas

Use ranked cards:

Parent Communication

Academic Support

Individual Attention

Issue analysis

Table:

| Issue | Mentions | Priority |
| Academic Support | 8 | Medium |
| Parent Communication | 6 | Medium |
| Homework/Practice | 4 | Low |
| Individual Attention | 3 | Medium |

AI-generated action points

Display recommendation cards with:

Action

Reason

Suggested target date

Status

Faculty can enter:

Action Taken

Remarks

Target Date

Status

Statuses:

Open

In Progress

Completed

Do not expose parent identities.

11. Faculty Trend Page

Create a historical trend visualization.

Example:

June — 3.8
July — 4.0
August — 4.2

Show an AI-generated interpretation:

“Parent feedback improved from 3.8 to 4.2 over the last three reporting periods.”

Also show improvement-area trends.

12. HOD / Coordinator Dashboard

Create a department/grade-level overview.

Title:

Grade 8 Academic Feedback

Faculty comparison table:

Faculty

Subject

Rating

Positive %

Neutral %

Negative %

Key Concern

Open Actions

Make it clear that the system is intended for improvement and support, not automated punitive ranking.

Include:

Faculty trend chart

Class/section comparison

Recurring issues

Open actions

High-priority concerns

13. Class / Section Analytics

Create filterable analytics.

Example:

Grade 8-A

Metrics:

Parents Contacted: 42

Responses: 35

Satisfaction: 4.2/5

Top Concerns:

Communication

Academic Support

Transport

Show category distribution and sentiment by section.

14. Issue Management

Create a dedicated issue-management module.

Issue lifecycle:

Reported → Assigned → Under Review → Action Taken → Resolved → Closed

Issue table:

Issue

Category

Mentions

Classes Affected

Priority

Trend

Assigned To

Status

Last Updated

Priority badges:

🔴 Critical
🟠 High
🟡 Medium
🟢 Low

Critical issues should be visually prominent.

Example:

Examination Communication

126 mentions

7 classes affected

Priority: Medium

Trend: Increasing

Status: Open

Create an issue detail page showing:

AI summary

Parent feedback evidence

Affected classes

Trend

Assigned owner

Action history

Resolution notes

Before/after metrics

15. Action Tracking

Create an action-management dashboard.

Columns:

Action

Source Issue

Owner

Priority

Created Date

Target Date

Status

Outcome

Show overdue actions prominently.

Statuses:

Open

In Progress

Completed

Overdue

Add a timeline for every action.

16. Before & After Measurement

Create a visual intervention-effectiveness page.

Example:

Transport Complaints

August: 42
September: 31
October: 18

Show a downward trend chart.

AI insight:

“Transport-related complaints decreased by approximately 57% following the corrective action.”

Clearly distinguish correlation/observed change from causal certainty. Use language such as “following the corrective action” rather than claiming definitive causation.

17. Principal Dashboard

Create a more strategic version of the dashboard.

Sections:

Executive Summary

One-page AI-generated summary.

School Feedback Statistics

Calls

Responses

Response rate

Average rating

Sentiment

Positive / Neutral / Negative / Mixed

Top Strengths

Top Concerns

Immediate Attention

Critical and high-priority issues.

Improvement Trends

Resolution Performance

Faculty/Grade Highlights

Use visual storytelling rather than overwhelming tables.

18. Management Dashboard

Create an executive-level dashboard with fewer operational details.

Focus on:

Overall parent satisfaction

Sentiment trend

Major recurring issues

Improvement actions

Resolution rate

Before/after intervention metrics

School-wide strengths

Areas requiring management decisions

Create an “Executive AI Insight” section.

Example:

What management should know

Communication is the most recurring concern.

Transport complaints are declining after intervention.

Academic support remains concentrated in selected grades.

Overall parent sentiment is stable/improving.

19. AI Management Assistant

Create a premium conversational AI interface.

Title:

Ask VIGNAN AI

Subtitle:

Ask questions about authorized parent feedback data.

Chat interface with suggested prompts:

“What are the top five concerns raised by parents this month?”

“Which classes have the highest negative feedback?”

“What are parents most satisfied with?”

“Show me all transport-related concerns.”

“Which issues are still unresolved?”

“Summarize feedback for Grade 10.”

“What improvement actions were taken this month?”

“Did parent satisfaction improve after the transport intervention?”

AI responses should contain:

Answer

Key evidence

Relevant metrics

Time period

Filters used

Links/buttons to drill into the underlying data

Important:

The assistant must answer only from authorized school feedback data.

Do not allow it to invent statistics.

20. Reports

Create a Reports Center.

Report cards:

Faculty Report

Class Report

Section Report

HOD Report

Principal Report

Management Report

Issue Report

Action Tracking Report

Call Campaign Report

Each report should support:

Date range

Filters

Preview

PDF export

Excel export

CSV export

Create polished report previews suitable for school leadership.

21. Weekly AI Report

Create an automated weekly-report screen.

Sections:

Feedback Coverage

Overall Sentiment

Top Positive Themes

Top Concerns

Critical/High-Priority Issues

Faculty Highlights

Class/Section Trends

Unresolved Issues

Actions Taken

Recommended Actions

Allow:

Generate Report

Download PDF

Schedule Report

22. Notifications

Create a notification center.

Notification types:

Critical Alert

High-Priority Alert

Recurring Issue Alert

Negative Trend Alert

Unresolved Issue Alert

Callback Reminder

Action Due

Report Ready

Use color-coded severity.

23. Callback Management

Create an operational callback page.

Show:

Parent reference

Student

Preferred callback time

Reason

Attempt count

Status

Assigned coordinator

Statuses:

Pending

Scheduled

Completed

Failed

Escalated

24. Call Failure Monitoring

Create analytics for:

No Answer

Busy

Declined

Switched Off

Invalid Number

Parent Unavailable

Callback Requested

Language Issue

Show retry attempts and campaign-level call performance.

25. Human Escalation

Create a dedicated escalation queue.

Each escalation card should show:

HUMAN FOLLOW-UP REQUIRED

Call summary

Issue category

Priority

Student reference

Parent reference

Assigned person

Follow-up status

Created date

Critical escalations should appear at the top.

Provide:

Assign

Mark In Progress

Resolve

View Evidence

26. Settings

Create a comprehensive settings area with tabs:

General

School information and branding.

Users & Roles

Role-based access.

Calling

Calling hours, retry limits, callback rules.

Languages

English, Telugu, Hindi and configurable future languages.

Questionnaire

Create/edit/reorder questions.

Categories

Manage feedback categories and subcategories.

Priority Rules

Configure thresholds.

Notifications

Configure alerts.

Privacy & Retention

Consent, recording, retention and deletion policies.

Integrations

ERP/SIS and future integrations.

Audit Logs

Track sensitive operations.

27. Privacy & Security UX

Make privacy visible throughout the application.

Include:

Consent status

Recording status

Role-based permissions

Audit trail

Data retention indicator

Sensitive issue warning

Permission-gated recording access

Create an audit-log screen:

User

Action

Resource

Date/time

IP/device metadata where appropriate

Result

Never imply that AI can independently resolve serious complaints.

Serious issues must be routed to authorized human personnel.

28. Data Model / Backend Readiness

Structure the frontend so it can later connect cleanly to a real backend.

Core entities:

User

Role

Student

Parent

Faculty

Subject

Class

Section

Campaign

Call

Consent

Transcript

Feedback

Feedback Category

Issue

Action

Escalation

Report

Notification

Audit Log

Use realistic mock data initially.

Do not hard-code analytics into individual UI components. Centralize mock data/services so they can easily be replaced with APIs.

29. Dashboard Interactions

All major dashboard cards and charts should be interactive.

Examples:

Clicking “126 mentions” opens filtered issues.

Clicking a faculty rating opens the faculty report.

Clicking a sentiment segment filters feedback.

Clicking a critical alert opens the escalation.

Clicking an action opens the action detail.

Clicking a class opens class analytics.

Use drawers or detail pages instead of navigating unnecessarily.

30. Important UX States

Design all major pages for:

Loading

Empty state

Error state

No search results

No permissions

Successful operation

Confirmation dialogs

Destructive-action warnings

Do not leave blank white areas.

31. Demo Data

Populate the prototype with realistic Vignan School-style demo data.

Use approximately:

1,250 parents contacted

1,040 responses

83.2% response rate

Average satisfaction 4.2/5

68% positive

19% neutral

13% negative

Include multiple:

Grades

Sections

Faculty

Subjects

Issues

Actions

Campaigns

Create believable trends and relationships between datasets.

Clearly label the data as demo/sample data where appropriate.

32. Landing / Login Experience

Create a professional login screen.

Brand:

VIGNAN PARENT VOICE AI

Tagline:

Listen. Understand. Act. Improve.

Login:

Email

Password

Remember me

Sign in

Use Vignan-inspired academic branding without pretending to use official logos/assets unless provided.

33. Overall UX Principle

The application should answer these five questions immediately:

What are parents saying?

What are they satisfied with?

What problems are recurring?

What action should the school take?

Did the action improve the parent experience?

Prioritize actionable insights over raw data.

The final product should feel like an AI-powered school continuous-improvement platform, not merely a calling application.

Build the complete responsive frontend with reusable components, realistic demo data, polished charts, functional navigation, role-aware views, filters, drawers, modals, tables, dashboards and report previews.

Use clean component architecture and keep the code maintainable and ready for future API/backend integration.

Ensure every major navigation item has a meaningful, polished screen rather than placeholder text.

The final UI should be presentation-ready for a demonstration to the Principal, HODs and Management of Vignan School, Kondapur, Hyderabad.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
