# Livio.AI 🤖
> AI-powered Voice Interview Agent built with the MERN stack

![Livio.AI](https://img.shields.io/badge/Status-Live-brightgreen)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![AI](https://img.shields.io/badge/AI-OpenRouter-purple)

---

## 🚀 Live Demo
https://levio-qfhb.onrender.com

---

## 📌 About

Livio.AI is a full-stack SaaS application that conducts AI-powered mock interviews.
Upload your resume, answer questions by voice, and get detailed AI feedback —
just like a real interview.

---

## ✨ Features

- 🔐 **Google Authentication** — Firebase OAuth + JWT in HTTP-only cookies
- 📄 **Resume Upload** — PDF parsed and analyzed by AI
- 🤖 **AI Question Generation** — 20 personalized questions based on your resume
- 🎙️ **Voice Interview** — AI speaks questions, you answer by voice or text
- ⏱️ **Timer-based** — auto-submits when time runs out
- 📊 **AI Evaluation** — scored across confidence, communication and correctness
- 📋 **Performance Report** — detailed feedback after every interview
- 📁 **Interview History** — track progress across all past interviews
- 💳 **Credit System** — buy credits via Razorpay to unlock interviews
- 🎨 **Smooth UI** — Framer Motion animations throughout

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Redux Toolkit
- Framer Motion
- Tailwind CSS
- react-speech-recognition
- Web Speech API

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file upload)
- pdfjs-dist (PDF parsing)

**Services:**
- Firebase (Google OAuth)
- OpenRouter AI (GPT-4o-mini)
- Razorpay (payments)
- Render (deployment)
- Cloudinary (file storage)

---

## 📁 Project Structure

```text
livio/
├── client/                         → React frontend
│   └── src/
│       ├── pages/
│       │   ├── Auth.jsx
│       │   ├── Home.jsx
│       │   ├── InterviewPage.jsx
│       │   ├── HistoryPage.jsx
│       │   └── PricingPage.jsx
│       │
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Step1SetUp.jsx
│       │   ├── Step2Interview.jsx
│       │   ├── Step3Report.jsx
│       │   ├── Timer.jsx
│       │   ├── AuthModel.jsx
│       │   └── Footer.jsx
│       │
│       ├── redux/
│       │   ├── store.js
│       │   └── userSlice.js
│       │
│       └── utils/
│           ├── firebase.js
│           └── config.js
│
└── server/                         → Node.js backend
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── interview.controller.js
    │   └── payment.controller.js
    │
    ├── models/
    │   ├── user.models.js
    │   ├── interview.model.js
    │   └── payment.model.js
    │
    ├── routes/
    │   ├── auth.route.js
    │   ├── interview.route.js
    │   └── payment.route.js
    │
    ├── middlewares/
    │   ├── isAuth.js
    │   └── multer.js
    │
    ├── services/
    │   ├── openRouter.services.js
    │   └── razorpay.service.js
    │
    └── server.js
```

---

## ⚙️ Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Firebase project
- OpenRouter API key
- Razorpay account

### Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

```bash
npm run dev
```

---

## 🔄 How It Works
1.User signs in with Google
2.Upload resume PDF → AI extracts role, skills, projects
3.Select interview type (Technical / HR)
4.AI generates 20 personalized questions
5.Interview begins — AI speaks each question
6.User answers by voice or text
7.Timer auto-submits when time runs out
8.AI evaluates answer → confidence + communication + correctness
9.AI speaks feedback after each answer
10.Full performance report generated at the end
11.Results saved to interview history

---

## 👨‍💻 Author

**Rohan Rawat**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/rohan-rawat-a16399257)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black)](https://github.com/rohanrawat10)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

# Create README in root folder
# Paste the content above
git add README.md
git commit -m "docs: add comprehensive README"
git push origin main
