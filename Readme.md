# RemindX

RemindX is a simple appointment scheduling system. Users book an appointment through the frontend, receive an immediate confirmation email, and get an automated reminder email ~60 minutes before their scheduled time. 

**Live Links:**
- Frontend: https://remind-x-23rg.vercel.app
- Backend: https://remind-x-wh8q.vercel.app

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Emails:** Nodemailer
- **Infrastructure:** Vercel (Serverless Functions), cron-job.org

## How to run locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/ashishsharma349/remindX.git
   cd remindX
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   EMAIL_USER=your_gmail
   EMAIL_PASS=your_gmail_app_password
   CRON_SECRET=random_secret_string
   CLIENT_URL=http://localhost:5173
   REMINDER_WINDOW_MINUTES=60
   NODE_ENV=development
   ```
   Run the backend: `npm run dev`

3. **Start Frontend**
   Open a new terminal.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Vercel Cron Note
Vercel serverless functions freeze immediately after sending an HTTP response, meaning background tasks like `node-cron` do not work. To solve this, the reminder logic is exposed as a secured API endpoint (`/api/cron/reminders`). An external service (cron-job.org) is configured to ping this endpoint every 5 minutes with a Bearer token (`CRON_SECRET`) to trigger the reminder emails.
