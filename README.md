# TaskFlow - Task Management App

TaskFlow is a **Full-Stack Next.js Task Management Platform** where users can sign up, log in, manage tasks, edit their profile, and log out securely.  
It features JWT authentication, MongoDB integration, and a modern responsive UI built with Tailwind CSS and shadcn/ui.

<<<<<<< HEAD
🔗 **Live Demo:** [https://taskflow-app-nu.vercel.app](https://taskflow-app-nu.vercel.app)

🎥 **Video Demo:** [https://youtu.be/etYtdwYO5pQ](https://youtu.be/etYtdwYO5pQ)

---

## 🧩 Features
<<<<<<< HEAD
- **User Authentication:** Secure signup, login, and logout using JWT.
- **Task Management:** Create, update, delete, and mark tasks as completed.
- **User Profile:** View and update your name and bio.
- **Database Integration:** MongoDB Atlas used for persistent storage.
- **Responsive Design:** Built with Tailwind CSS and shadcn/ui.
- **Error Handling:** Graceful API error handling and toast notifications.
- **Fully Deployed:** Live on Vercel with serverless API routes.

---

## 🛠️ Tech Stack
<<<<<<< HEAD
### Frontend:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Redux Toolkit
- Axios
- Sonner (toast notifications)
- Lucide React (icons)

### Backend:
<<<<<<< HEAD
- Next.js API Routes
- Node.js
- MongoDB (Mongoose)
- JWT Authentication

### Deployment:
<<<<<<< HEAD
- Frontend & Backend → Vercel  
- Database → MongoDB Atlas

---

## ⚙️ Environment Variables
<<<<<<< HEAD
Create a `.env` file in the project root and add the following:

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# App URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/taskflow-app.git
cd taskflow-app
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run the App
```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📂 Folder Structure
```
TASKFLOW-APP
├── app
│   ├── api
│   │   ├── auth
│   │   │   ├── login
│   │   │   ├── register
│   │   │   └── me
│   │   ├── tasks
│   │   │   ├── create
│   │   │   ├── update
│   │   │   └── delete
│   ├── profile
│   ├── tasks
│   ├── layout.tsx
│   └── page.tsx
├── components
├── lib
│   ├── db.ts
│   ├── auth.ts
│   └── axios.ts
├── models
│   ├── User.ts
│   └── Task.ts
├── store
│   ├── authSlice.ts
│   ├── taskSlice.ts
│   └── index.ts
├── public
├── styles
│   └── globals.css
└── package.json
```

---

## 🧠 Approach & Decisions
- Used **Next.js App Router** with API routes for serverless backend.
- Connected MongoDB using a reusable connection function.
- JWT tokens stored in cookies for secure authentication.
- Profile and task data fetched using protected API routes.
- Optimized UX with toast notifications and responsive UI.

---

## 📸 Screenshots
<<<<<<< HEAD
- ## Login Page
- 
  <img width="3060" height="1550" alt="Screenshot from 2025-10-30 19-31-13" src="https://github.com/user-attachments/assets/0474735e-6621-4d46-93c3-b3cda7f13244" />
 
- ## Dashboard Page
   <img width="3060" height="1550" alt="Screenshot from 2025-10-30 19-30-40" src="https://github.com/user-attachments/assets/8f49ca4f-ed9e-4507-95e6-a7c36136d08b" />

- ## Profile Update Page  
  <img width="3060" height="1550" alt="Screenshot from 2025-10-30 19-31-03" src="https://github.com/user-attachments/assets/b7b3e117-8657-48d5-8111-dcaa6f478e11" />
  
- ## MongoDB Atlas 
  <img width="3060" height="1550" alt="Screenshot from 2025-10-30 19-49-13" src="https://github.com/user-attachments/assets/e7174abc-b595-48dc-bfee-eed0de14f876" />
  <img width="3060" height="1550" alt="image" src="https://github.com/user-attachments/assets/6ec6d56c-fed6-4842-80d8-4b9f477a7bbc" />

---

## 💡 Future Improvements
<<<<<<< HEAD
- Implement dark mode.
- Add drag-and-drop task reordering.
- Enable profile picture upload.

---
