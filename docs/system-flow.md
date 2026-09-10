# FPOP HealthHub — Simple System Flow

## System architecture (how all the parts connect)

```mermaid
flowchart TB
    subgraph People
        PAT[🩺 Patient<br/>uses the website from any browser]
        STF[👩‍⚕️ Staff / Doctor<br/>uses the website from any browser]
        ADM[🛡️ Admin / Manager<br/>uses the website from any browser]
    end

    subgraph "Layer 1 — Website you see (React app on Vercel)"
        WEB[Buttons, menus, forms, charts]
    end

    subgraph "Layer 2 — Brain / API server (Express on Render)"
        API[Handles every click action:<br/>login, booking, forms, reports<br/>checks who you are, keeps things safe]
    end

    subgraph "Layer 3 — Services it talks to"
        DB[(Database - MongoDB Atlas<br/>accounts, appointments, inventory, assessments, surveys)]
        MAIL[Email service - EmailJS<br/>verification codes + booking/confirmation emails]
        PICS[Pictures - Cloudinary<br/>profile photos]
    end

    PAT --> WEB
    STF --> WEB
    ADM --> WEB

    WEB -->|sends the action| API
    API -->|checks identity, saves/reads data| DB
    API -->|sends emails| MAIL
    API -->|uploads photos| PICS
    DB -->|returns info| API
    API -->|shows the result| WEB
    MAIL -->|emails reach the user| PAT
```

## Who uses it?

| Person | What they see/do |
|--------|------------------|
| **Patient** (the public) | Browse the site, book an appointment, see their bookings, give feedback |
| **Staff** (the doctors) | Check the day's schedule, confirm/decline bookings, fill medical forms, update inventory |
| **Admin** (the manager) | Oversee everything: users, appointments, reports, notifications, clinic info |

## Main flow — booking an appointment

```mermaid
flowchart TD
    A[Person visits the website] --> B[Creates an account]
    B --> C[Verifies email with the code sent to their inbox]
    C --> D[Logs in]
    D --> E[Picks a service<br/>e.g. Family Planning]
    E --> F[Picks a doctor + date]
    F --> G[Picks a free time slot]
    G --> H[Booking submitted = Pending]
    H --> I[Email confirmation is sent]
    I --> J{Staff or Admin reviews}
    J -- Yes --> K[Appointment Confirmed<br/>email sent to patient]
    J -- No --> L[Appointment Cancelled<br/>email sent to patient]
    K --> M[Patient shows up]
    M --> N[Staff marks it Completed]
    N --> O[Patient can leave feedback]
    L --> P[Patient books another time]
```

## Side features

```mermaid
flowchart LR
    subgraph Patient
        S1[View my bookings]
        S2[Book another appointment]
        S3[Fill a feedback survey]
    end

    subgraph Staff
        S4[See my daily schedule]
        S5[Fill medical assessment forms]
        S6[Track clinic inventory]
        S7[Export reports]
    end

    subgraph Admin
        S8[Manage clients and staff]
        S9[See clinic analytics]
        S10[Read system notifications]
        S11[Edit clinic info shown on website]
    end
```

## Where things run

- **Website + controls** — a web app (on Vercel)
- **Brain / API** — a server that talks to the app (on Render)
- **Memory / Database** — where all accounts, bookings, and forms are stored (MongoDB Atlas)
- **Email service** — sends the codes and booking/confirmation emails (EmailJS)