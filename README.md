# 🚛 Fleet Wash Manager (ERP System)

> A full-stack Enterprise Resource Planning (ERP) system designed to optimize fleet maintenance and wash cycle management.

## 📖 Overview
**Fleet Wash Manager** is a comprehensive web application built to digitize and streamline the operational workflows of a vehicle maintenance business. This system replaces manual tracking with a robust digital solution, allowing administrators to manage vehicle inventories, track service history, and generate real-time reports.

The project demonstrates a modern **Microservices-ready architecture** separating the frontend and backend to ensure scalability and maintainability.

## 🚀 Key Features
* **Fleet Management:** Complete CRUD operations for vehicle inventory (Trucks, Pickups, Machinery).
* **Service Tracking:** Real-time logging of wash cycles and maintenance records.
* **Dashboard Analytics:** Visual overview of operational metrics.
* **RESTful API:** Secure and efficient communication between client and server.
* **Responsive Design:** Optimized user interface for desktop and tablet usage.

## 📸 Screenshots
<div align="center">
  <img width="90%" src="[https://github.com/user-attachments/assets/8b325f5f-2288-4099-a1d4-ad1fef5205f5](https://github.com/user-attachments/assets/8b325f5f-2288-4099-a1d4-ad1fef5205f5)" alt="Dashboard" />
  <br><br>
  <img width="90%" src="[https://github.com/user-attachments/assets/ba20ce5a-050b-43b7-b4ff-224d34a25ca3](https://github.com/user-attachments/assets/ba20ce5a-050b-43b7-b4ff-224d34a25ca3)" alt="List View" />
</div>

## 🛠️ Tech Stack

### Backend (Server-Side)
* **Language:** Java 17+
* **Framework:** Spring Boot 3
* **Data Access:** Spring Data JPA / Hibernate
* **Database:** PostgreSQL
* **Build Tool:** Maven

### Frontend (Client-Side)
* **Library:** React.js
* **Styling:** CSS3 / Bootstrap
* **HTTP Client:** Axio
* **State Management:** React Hooks

## 📂 Project Structure
text
Fleet-Wash-Manager/
├── backend/          # Spring Boot Application (API)
│   ├── src/main/java # Controller, Service, Repository layers
│   └── src/resources # Configuration (application.properties)
└── frontend/         # React Application (UI)
    ├── src/components
    └── public/

⚙️ Setup & Installation
Prerequisites

    Java JDK 17 or higher

    Node.js & npm

    PostgreSQL

1. Clone the Repository
```
    git clone [https://github.com/JareroDaniel23/Fleet-Wash-Manager.git](https://github.com/JareroDaniel23/Fleet-Wash-Manager.git)

    cd Fleet-Wash-Manager
```

2. Backend Setup
Navigate to the backend directory and run the Spring Boot application:
```
  cd backend
  
  ./mvnw spring-boot:run
```

The server will start on http://localhost:8080

3. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the development server:
```
  cd frontend
  npm install
  npm start
```
The client will run on http://localhost:3000

📬 Contact
Daniel Jarero - Full Stack Developer - [GitHub Profile](https://github.com/JareroDaniel23)
