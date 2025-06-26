# 🏛️ Indilex – Legal Aid Web Application

**Indilex** is a full-stack legal aid platform designed to connect users across India with verified legal professionals. It facilitates legal support access, current legal news, and a structured interface for different user roles—User, Lawyer, and Admin.

---

## 🌟 Key Features

### 👤 **User**
- Explore the **latest legal news**.
- Connect with **verified lawyers**.
- Apply to become a **registered legal practitioner**.

### ⚖️ **Lawyer**
- View legal **news and updates**.
- Manage **case requests** from users.
- Accept or reject case assignments.

### 🛡️ **Admin**
- Review and verify **lawyer registration requests**.
- Maintain the integrity of the lawyer directory.

---

## 🧱 Tech Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React + TypeScript + Vite |
| Styling   | Tailwind CSS |
| Backend   | Node.js + Express |
| ORM       | Prisma |
| Database  | PostgreSQL (e.g., via NeonDB) |
| Auth      | JWT + HTTP-only Cookies |
| Package Manager | npm |

---

## 📁 Project Structure

```
INDILEX/
│
├── backend/                 # Backend source code
│   ├── dist/                # Compiled JS (if using TS)
│   ├── node_modules/
│   ├── prisma/              # Prisma schema & migrations
│   ├── src/                 # Backend routes, controllers, middlewares
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # Frontend source code
│   ├── public/
│   ├── src/                 # React app source
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── tsconfig.app.json
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/AayushGDTU205/indilex.git
cd indilex
```

### 2. Setup Environment Variables

#### Backend (`backend/.env`)
```env
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
PORT=5000
```

### 3. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 4. Run the Application

#### Backend
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

---

## 🧪 TODOs / Future Work

- 🔲 Legal Document Summarizer

---

## 🤝 Contributing

We welcome contributions! Please fork the repo and make a pull request.
