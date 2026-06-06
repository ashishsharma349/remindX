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

## How It Works
1. A user books an appointment through the frontend interface.
2. An immediate confirmation email is sent to the user.
3. A background job checks every 5 minutes for appointments scheduled in the next 50-60 minutes.
4. An automated reminder email is dispatched for those upcoming appointments.

## Submission Notes
# 0 Tools Used
already mentioned above
# 1. Data Flow
When a user submits the appointment form, 
the frontend sends a POST request to the backend API. 
The backend immediately saves the appointment to the database and dispatches a asynchronous(using await ) confirmation email using Nodemailer.
A separate Vercel-compatible API endpoint acts as a cron job, triggered externally using cronjob.org every 5 minutes ,which queries MongoDB for appointments finds those with time left between 50 to 60 minutes and dispatches reminder emails. 
# 2. Hardest Part
The hardest part of this build was adapting traditional background cron tasks (like `node-cron`) to work within Vercel's serverless environment, which forcefully kills background processes the moment an HTTP response is sent. Overcoming this required decoupling the cron logic into a secured endpoint triggered by cron-job.org. The entire application was built, debugged, and deployed over the course of roughly 6 to 8 hours across two days.
