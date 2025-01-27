Here's the updated `README.md` with full URLs for the endpoints:

```markdown
# Student Project Manager API

This repository provides the backend API for the **Student Project Manager**, designed to manage students, teachers, and project-related data efficiently. Built using Node.js, Express, and MongoDB.

## Features

- **User Roles:** Students and Teachers
- **Authentication:** JWT-based authentication and cookies
- **Password Management:** OTP-based password reset, password change functionality
- **Email Support:** Sends OTP and registration notifications using the `sendEmail` utility

---

## API Endpoints

### Base URL

```
http://localhost:5000/auth

```



### Authentication Endpoints

---

#### **1. Student Registration**  
**POST** `http://localhost:5000/auth/student/register`  
Registers a new student.  
**Body:**  

```json
{
    "name": "John Doe",
    "profilePic": "profilePicUrl",
    "email": "johndoe@example.com",
    "department": "CSE",
    "password": "Password123!",
    "semester": 5,
    "classRollNumber": "12345",
    "enrollmentNumber": "EN12345",
    "universityRollNumber": "UR12345"
}
```

---

#### **2. Teacher Registration**  
**POST** `http://localhost:5000/auth/teacher/register`  
Registers a new teacher.  
**Body:**  
```json
{
    "name": "Jane Smith",
    "profilePic": "profilePicUrl",
    "email": "janesmith@example.com",
    "department": "IT",
    "password": "Password123!",
    "designation": "Assistant Professor",
    "semester": 4,
    "employeeId": "EMP456"
}
```

---

#### **3. Student Login**  
**POST** `http://localhost:5000/auth/student/login`  
Logs in a student.  
**Body:**  
```json
{
    "email": "johndoe@example.com",
    "password": "Password123!"
}
```

---

#### **4. Teacher Login**  
**POST** `http://localhost:5000/auth/teacher/login`  
Logs in a teacher.  
**Body:**  
```json
{
    "email": "janesmith@example.com",
    "password": "Password123!"
}
```

---

#### **5. Student Change Password**  
**PUT** `http://localhost:5000/auth/student/change-password`  
Allows a student to change their password.  
**Body:**  
```json
{
    "email": "johndoe@example.com",
    "oldPassword": "OldPassword123",
    "newPassword": "NewPassword123"
}
```

---

#### **6. Teacher Change Password**  
**PUT** `http://localhost:5000/auth/teacher/change-password`  
Allows a teacher to change their password.  
**Body:**  
```json
{
    "email": "janesmith@example.com",
    "oldPassword": "OldPassword123",
    "newPassword": "NewPassword123"
}
```

---

#### **7. Student Forgot Password (Generate OTP)**  
**POST** `http://localhost:5000/auth/student/forgot-password-otp-generate`  
Generates OTP for student password reset.  
**Body:**  
```json
{
    "email": "johndoe@example.com"
}
```

---

#### **8. Teacher Forgot Password (Generate OTP)**  
**POST** `http://localhost:5000/auth/teacher/forgot-password-otp-generate`  
Generates OTP for teacher password reset.  
**Body:**  
```json
{
    "email": "janesmith@example.com"
}
```

---

#### **9. Student Forgot Password (Reset Password)**  
**POST** `http://localhost:5000/auth/student/forgot-password`  
Resets a student's password using OTP.  
**Body:**  
```json
{
    "email": "johndoe@example.com",
    "otp": "123456",
    "newPassword": "NewPassword123!"
}
```

---

#### **10. Teacher Forgot Password (Reset Password)**  
**POST** `http://localhost:5000/auth/teacher/forgot-password`  
Resets a teacher's password using OTP.  
**Body:**  
```json
{
    "email": "janesmith@example.com",
    "otp": "123456",
    "newPassword": "NewPassword123!"
}
```

---

## Environment Variables

- `JWT_SECRET_KEY`: Secret key for JWT signing.
- `PORT`: Port on which the application runs (default: 5000).

---

## Project Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add a `.env` file with the necessary environment variables.
4. Run the server:
   ```bash
   npm start
   ```

---

