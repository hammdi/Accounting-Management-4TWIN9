
# 📊 Accounting Management Application

## 🚀 Overview

This project is a full-featured **Accounting Management Application** developed using the **MERN stack (MongoDB, Express.js, React 18, Node.js)**, with integrated **AI modules (Python + XGBoost)** for fraud detection and predictive analytics. It also includes **CI/CD pipelines with Docker and GitHub Actions**.

Designed specifically to meet the needs of the **Tunisian accounting system**, this platform aims to streamline business financial management while incorporating smart automation and compliance monitoring.

---

## 🧠 AI Integration

The app integrates a powerful AI module built with **Python (venv)** and **XGBoost** to provide:
- **Fraud Detection**: Detect suspicious transactions based on historical data.
- **Predictive Analytics**: Forecast revenue, expenses, and liquidity.
- **Smart Prioritization**: Identify and highlight critical accounting tasks.

---

## ⚙️ Technology Stack

### Backend
- **Node.js**
- **Express.js**
- **MongoDB with Mongoose**
- **Python (XGBoost, Pandas, Scikit-learn)** via REST API
- **Authentication with JWT & Role-based Access**

### Frontend
- **React 18**
- **Tailwind CSS**
- **Axios & React Router**

### DevOps
- **Docker** (Frontend, Backend, AI service containerized)
- **GitHub Actions** for automated testing, building, and deployment

---

## 📌 Key Features

### ✅ Authentication & Authorization
- JWT-based auth
- 2FA support
- Role-based permissions (BusinessOwner, Accountant, User)

### 📘 Accounting Management
- Manage users, companies, invoices, transactions, payrolls, taxes
- AI-powered anomaly detection and forecasting
- Smart dashboards and reports

### 📈 Financial Statements & Dashboards
- Automatically generate income statements, cash flow, and balance sheets
- Interactive visualizations using charts and tables

### 📅 Fiscal Analysis & Compliance
- Tax alerts & regulatory notifications
- Built-in rules to ensure compliance with Tunisian accounting standards

---

## 🗂️ Project Structure

```
accounting-management-app/
│
├── backend/                  # Express.js API + MongoDB
│   ├── models/              # All Mongoose schemas
│   ├── routes/              # All API route files
│   ├── controllers/         # Controllers for CRUD logic
│   ├── middleware/          # Validators & auth middleware
│   └── app.js               # Main entry point
│
├── frontend/                 # React 18 + Tailwind CSS
│   └── src/                 # Pages, Components, Services
│
├── ai/                       # Python venv + AI models
│   ├── model.pkl            # XGBoost trained fraud model
│   └── server.py            # Flask/FastAPI endpoint for inference
│
├── docker-compose.yml       # Multi-service orchestration
├── .github/workflows/       # GitHub Actions for CI/CD
└── README.md
```

---

## 🐳 Dockerized Architecture

- Backend API (`Node.js + Express`)
- Frontend (`React`)
- AI microservice (`Python + Flask/FastAPI`)
- MongoDB database

Run with:
```bash
docker-compose up --build
```

---

## 🔁 CI/CD with GitHub Actions

Each push or pull request triggers:
- Linting & testing
- Docker image builds
- Deployment pipeline

---

## 👥 Authors

- **Hmaidi Ala Eddine**
- **Kbaier Hamdi**
- **Ben Attaya Mehdi**
- **Mohamed Skander Laribi**
- **Said Ahmed Boudali**

---


# 🎓 Esprit School of Engineering

> This project was developed as part of my studies at **Esprit School of Engineering**, Tunisia.  
> [www.esprit.tn](https://www.esprit.tn)

---

## 📄 License

MIT License. See `LICENSE` file for details.

---

## 📬 Contact

For questions or collaboration inquiries, feel free to open an issue or contact any of the authors.

---

> _“Bringing AI and compliance together for smarter accounting.”_
