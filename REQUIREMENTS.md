Calendly clone.

Made specifically for Levant IT Solution.

# Features:

### Version 01 - MVP

- One-on-one meeting
- Create scheduled events
- See meeting bookings
- Set multiple Availability
- Public users can book meetings.
- User can collect their contact and other details.
- Book a meeting in the user’s Google Calendar (using Google OAuth).
- Dark theme support
- Embedding support

### Version 02 - Extended

- Send a calendar invitation to the invitee in their email.
- Remind the invitee before the meeting.
- Webhook support
- AI research bot: will research on the internet based on the information given by the invitee (such as scraping their website).
- User info tracking (possible location, device, time, etc.)

# Tech Stack

### Version 01 - MVP

- Next.js

### Version 02 - Extended

- Next.js (frontend)
- Nest.js (backend)
- tRPC + Turborepo
- Prisma + Postgres
- JWT (authentication)
- Go (queue processing, reminder scheduling, AI)
- SendGrid (mail sending) _[not sure]_
- React Native
- Docker + Kubernetes

# Pages (version 01 - MVP)

## /dashboard

Shows some reports about the latest meetings, contacts, and other data.

## /scheduling

- Create a new event type button.
  - It will pop up a drawer from the right side for creating new event types.
- Display all event types
  - Meeting title
  - Duration
  - Avalibility
  - Copy Link button
  - More Options:
    - View booking page
    - Edit
    - Add to website
    - Turn on/off
    - Delete

## /meetings

- A tab of _Upcoming_ and _Past_ meetings
- Group meeting data by dates
- Each data will have:
  - A random color circle
  - Time range (2 am - 2:30 am) _(user selected timezone)_
  - User name
  - Event type name
  - Delete button

## /availability

- Header
  - Schedule selector
    - Shows the default schedule first
    - In the select, it shows all schedules.
    - Create schedule button
  - More options button
    - Rename
    - Set as default schedule
    - Delete
- Weekly hours
  - List of all 7 days of the week
  - Each day can have multiple time ranges.
  - Time zone selector

## /contacts

- A contact button
  - Pop up a drawer **form** from the right side
- Search contact input
- Show contact table
  - When clicking on each contact show the info from right side drawer
  - Show upcoming and recent meetings
  - Show button to create **Meeting** with this contact

## /settings

- Name
- Profile picture
- Public email
- Google Connect button

## /booking/[user]

Shows all event types

## /booking/[user]/[eventTypeId]

Just like Calendly, with:

- User name
- Public email
- Profile picture
- Event type name
- Duration
- Date & Time selector
- After selecting Date & time, questions will pop up
- After that, **Schedule Event** button.

# Forms (version 01 - MVP)

## 1. Event Type

- Name
- Description
- Duration
- Availability (select)
- Invitee questions
  - Question index (drag-n-drop feature)
  - Question
  - Answer type
    - One Line
    - Multiple Lines
    - Radio Buttons
      - Input fields with index
    - Checkboxes
      - Input fields with index
    - Dropdown
      - Input fields with index
    - Phone Number
- Immediate calendar invitation
  - Also, show a settings icon to update the calendar invitation template.

## 2. Contact Form

- Full name
- Email
- Phone (with country)
- Job Title
- Company
- LinkedIn
- Timezone
- Country
- City
- State
- Upload Image
