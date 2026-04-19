# 💼 Job Portal (MERN Stack)

A full-stack Job Portal web application where users can register, login, explore jobs, and apply. Recruiters can post and manage job listings.

---

## 🚀 Features

* 🔐 User Authentication (JWT-based login/signup)
* 👨‍💼 Job Seeker Dashboard
* 🏢 Recruiter Dashboard
* 📄 Post, Update, Delete Jobs
* 🔍 Search & Filter Jobs
* 📎 Upload Resume (Cloudinary integration)
* 🖼 Profile Image Upload
* 📱 Responsive UI

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Other Tools

* Cloudinary (Image/File Uploads)
* JWT (Authentication)

---

## 📂 Folder Structure

```
Job-Portal/
│
├── frontend/        # React app
├── backend/         # Node/Express server
├── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abhinav211203/job.git
cd job
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file in backend:

```
MONGO_URI=your_mongodb_uri
SECRET_KEY=your_secret
PORT=8000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run backend:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

| Variable     | Description               |
| ------------ | ------------------------- |
| MONGO_URI    | MongoDB connection string |
| SECRET_KEY   | JWT secret                |
| CLOUDINARY_* | Cloudinary credentials    |

---

## 📸 Screenshots (Optional)

*Add screenshots here if needed*

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork and submit a PR.

---

## 📜 License

This project is open-source and free to use.

---

## 👨‍💻 Author

**Abhinav Verma**

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!

---
