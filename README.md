# Contesto- Ultimate Coding Contest Tracker

A MERN stack application that  displays upcoming coding contests from LeetCode, Codeforces, and CodeChef.
![Screenshot 2025-03-17 092009](https://github.com/user-attachments/assets/dbdc29fb-2099-4389-9dd0-1e25333fd215)


![Screenshot 2025-03-20 100805](https://github.com/user-attachments/assets/6edf96be-4d9c-4863-9b3e-5dc67db87cfd)

# DashBoard page
![Screenshot 2025-03-20 100745](https://github.com/user-attachments/assets/54bd4492-78b6-4004-a8d3-1905bfb82ce5)

# Search, Filter and BookMark functionality
![image](https://github.com/user-attachments/assets/004a9705-4e3e-412b-b561-60c4b93f73e2)

# Admin Page
![Screenshot 2025-03-20 101339](https://github.com/user-attachments/assets/8fc2f143-8c9b-4bd9-8c21-690163a33063)




## 📋 Overview

Coding Contest Tracker helps competitive programmers stay updated with upcoming contests across multiple platforms. The application fetches real-time contest data and provides an intuitive dashboard for easy tracking.

## 🔗 Links & Resources

- **Demo Video-1**:[https://drive.google.com/file/d/1wCg6kwIDPmUADiG7lMzMdfM5NMDmnCTK/view?usp=sharing
- **Repository**: [Checkout the code](https://github.com/Tufailahmed-Bargir/Contesto-1)
- **Developer**: [Tufail Ahmed](https://github.com/Tufailahmed-Bargir)

## ✨ Features

- **Multi-Platform Integration**: Displays contests from LeetCode, Codeforces, and CodeChef.
- **Real-time Updates**: Uses platform APIs to fetch the latest contest schedules.
- **Contest Filtering**: Sort contests by platform, date, and duration.
- **Reminder System**: Option to add contests to Google Calendar.
- **Responsive Design**: Fully optimized for desktop and mobile.

## 🛠️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Recoil** for state management
- **Tailwind CSS** for styling

### Backend
- **Node.js & Express.js** for server
- **Prisma ORM** for database interaction
- **PostgreSQL** as the database

## 🔌 API Usage

The following APIs are used to fetch contest details:
 # 📡 API Endpoints Table

| Method | Endpoint             | Description                                      | Example Response |
|--------|----------------------|--------------------------------------------------|------------------|
| GET    | `/api/all`           | Fetch all upcoming and past contests from Codeforces, CodeChef, and LeetCode. | `{ "contests": [{ "name": "Codeforces Round 900", "platform": "Codeforces", "date": "2025-03-20", "duration": "120 min", "status": "upcoming", "url": "https://codeforces.com/contest/900" }] }` |
| GET    | `/api/past`          | Fetch all past contests from Codeforces, CodeChef, and LeetCode. | `{ "codeForcePast": [...], "codeChefPast": [...], "leetcodePast": [...] }` |
| GET    | `/api/bookmarks`     | Retrieve all bookmarked contests. | `{ "msg": "Here is the list of all the past contests!", "bookmarked": [{ "id": 1, "contestId": "900", "platform": "Codeforces" }] }` |
| POST   | `/api/bookmark/:id`  | Bookmark a contest by its ID. | `{ "msg": "Contest bookmarked successfully!", "bookmark": { "contestId": "900" } }` |
| DELETE | `/api/bookmark/:id`  | Remove a bookmarked contest by its ID. | `{ "msg": "Bookmark deleted successfully!" }` |
| POST   | `/api/filter`        | Filter contests by platform and status. | `{ "msg": "Here are the filtered contests!", "contests": [...] }` |
| POST   | `/api/admin`         | Admin-only route to add YouTube solutions. | `{ "msg": "Solution Link added Success!" }` |

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tufailahmed-Bargir/Contesto-1
   cd FE
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open `http://localhost:8080` in your browser.

## 🧪 Start Backed Server

On the root folder run these commands:
```bash
cd BE
```
Install the dependencies:
```bash
pnpm i
# or
npm i
```

Add the Database credentials from neon.tech or use docker and start the postgres instace :
```ATABASE_URL="postgresql://postgres:<password>@localhost:5432?schema=public"```

migrate the Database
```bash
npx prisma migrate dev --name initial-migration
 
```

generate the prisma client
```bash
npx prisma generate
 
```

check prisma working correctly open the prisma studio
```bash
npx prisma studio
 
```

run the backend server:
```bash
cd src
 # and
node index.js
#or 
nodemon index.js
```

## 🔮 Future Enhancements
- User authentication for personalized experiences
- Contest performance tracking
- Community discussions for each contest
 

