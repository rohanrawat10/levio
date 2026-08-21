# Livio.AI 🤖
> AI-powered Interview Agent built with MERN stack

## 🚀 Live Demo
Coming soon...

## ✨ Features (so far)
- ✅ Google Authentication (Firebase + JWT)
- ✅ Resume PDF upload & AI extraction
- ✅ AI-generated interview questions
- ✅ Answer evaluation (confidence, communication, correctness)
- ⬜ Razorpay credit payments (coming soon)
- ⬜ Performance dashboard (coming soon)
- ⬜ Deployment on Render (coming soon)

## 🛠️ Tech Stack
**Frontend:** React.js, Redux, Framer Motion, Tailwind CSS  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Auth:** Firebase Google OAuth, JWT, HTTP-only cookies  
**AI:** OpenRouter API (GPT-4o-mini)  
**File handling:** Multer, pdfjs-dist  

## 📁 Project Structure
\`\`\`
levio/
├── client/          → React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── redux/
│   │   └── utils/
└── server/          → Express backend
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middlewares/
    └── services/
\`\`\`

## ⚙️ Setup & Installation

### Backend
\`\`\`bash
cd server
npm install
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

### Environment Variables
\`\`\`
# server/.env
MONGO_URI=
JWT_SECRET=
OPENROUTER_API_KEY=
PORT=8000

# client/.env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=
\`\`\`

## 🗺️ Roadmap
- [ ] Razorpay payment integration
- [ ] Interview history dashboard
- [ ] Performance analytics
- [ ] Deploy on Render

## 👨‍💻 Author
**Rohan Rawat** — https://www.linkedin.com/in/rohan-rawat-a16399257
