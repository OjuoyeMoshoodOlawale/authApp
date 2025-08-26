# AuthApp

An **Express.js authentication API** built with **Sequelize ORM**.  
This project provides a secure and extensible authentication system with support for:

- User Registration & Login  
- Logout  
- Forgot Password & Reset with OTP  
- Email Verification (via NodeMailer)  
- Secure password encryption (bcrypt + crypto)  
- JWT-based Authentication & Authorization  

---

## 🚀 Features

- **Express.js** – Backend framework  
- **Sequelize** – ORM for database models & migrations  
- **JWT (JSON Web Tokens)** – Authentication & session management  
- **Bcrypt & Crypto** – Secure password hashing & OTP/token generation  
- **NodeMailer** – Email verification & password reset OTP delivery  
- **Helmet** – Security headers  
- **Morgan** – HTTP request logging  

---

## ⚙️ Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/authApp.git
cd authApp
npm install

```


## .env

Create a .env file in the project root with the following keys:

```
PORT=5000
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:3000

```

