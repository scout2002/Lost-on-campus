# Lost on Campus

Your witty college navigator! A playful, AI-powered virtual buddy that provides directions with humor and local slang.

## 🚀 Project Overview

**Lost on Campus** is a web-based interactive guide designed to help students find their way around college campuses with a touch of wit and humor. Instead of boring, static maps, our AI companion delivers directions in a quirky, engaging manner, making navigation more fun and memorable.

## 🎯 Features

- **Text & Voice Input** – Users can type or speak their queries (e.g., *"Where is the library?"* or *"How to get to the computer lab?"*).
- **Humorous & Intelligent Directions** – AI-generated responses incorporate local slang and fun elements.
- **Campus Location Database** – Stores building names, common hangout spots, and fun facts.
- **Route Suggestions** – Offers alternative paths (shortest vs. scenic).
- **Interactive Map (Optional)** – Google Maps or OpenStreetMap integration.
- **User Feedback System** – Allows users to rate the helpfulness and humor of directions.

## 🏗️ Tech Stack

### **Frontend**
- React (or any modern JS framework)
- TypeScript (optional, for type safety)
- Google Maps/OpenStreetMap API (optional)

### **Backend**
- Flask/FastAPI (Python) or Node.js (Express)
- LLM Integration (OpenAI GPT-3.5/4 or Hugging Face models)
- REST API for processing user queries

### **Database**
- SQLite/PostgreSQL
- Tables for:
  - Campus locations (name, coordinates, fun facts)
  - User feedback (ratings, session data)

### **DevOps & Deployment**
- GitHub (version control)
- Docker (for local development & deployment)
- AWS / Replit (optional for hosting)

## 📜 Architecture

```mermaid
graph TD;
    User-->Frontend[React App];
    Frontend-->|Query|Backend[Flask/FastAPI API];
    Backend-->|Fetch Data|DB[Campus Database];
    Backend-->|Generate Response|LLM[GPT Model];
    DB-->Backend;
    LLM-->Backend;
    Backend-->|Response|Frontend;
```

## 📊 Database Schema

### **Campus Locations Table**
| Column        | Type        | Description                          |
|--------------|------------|--------------------------------------|
| id           | INTEGER    | Primary key                          |
| name         | TEXT       | Location name                        |
| description  | TEXT       | Short description                    |
| latitude     | FLOAT      | GPS latitude                         |
| longitude    | FLOAT      | GPS longitude                        |
| fun_fact     | TEXT       | Interesting fact about the location  |

### **User Feedback Table**
| Column        | Type        | Description                          |
|--------------|------------|--------------------------------------|
| id           | INTEGER    | Primary key                          |
| direction_id | INTEGER    | Foreign key (link to direction log)  |
| rating       | INTEGER    | Upvote/downvote                      |
| comment      | TEXT       | User feedback                        |

## 🚦 Getting Started

### **1. Clone the Repository**
```sh
git clone https://github.com/yourusername/lost-on-campus.git
cd lost-on-campus
```

### **2. Install Dependencies**
#### Backend (Flask example)
```sh
cd backend
pip install -r requirements.txt
```
#### Frontend (React example)
```sh
cd frontend
npm install
```

### **3. Set Up Database**
```sh
python setup_db.py
```

### **4. Run the Application**
#### Start Backend Server
```sh
cd backend
flask run
```
#### Start Frontend
```sh
cd frontend
npm start
```

## 🛠️ Future Enhancements
- Expand to multiple campuses.
- More AI personality customization.
- Gamification (e.g., leaderboard for best-rated directions).
- Real-time navigation assistance.

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

## 📄 License
This project is licensed under the MIT License.

---
Made with ❤️ for lost students everywhere!

