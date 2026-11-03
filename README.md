# 📚 BookNook — A Small Online Library & Literary Archive

> *“Sanctuary for lost pages, timeless stories, and traveling readers.”*

**BookNook** is a cozy, neo-vintage full-stack web application designed for book lovers, students, and avid readers. It combines a rustic dark-academia design aesthetic with modern full-stack web architecture, featuring a curated digital catalog, seamless book borrowing/returning flows, interactive community marginalia, and a mysterious artifact archive.

---

## ✨ Key Features

* **📖 Interactive Banner Carousel**: Powered by Swiper.js with custom animations, endless looping, and fade effects showcasing featured library highlights and quick navigation.
* **🔍 Complete Book Catalog & Search**: Explore new arrivals and browse all cataloged books with real-time category filtering and availability status indicators.
* **📬 Duplicate-Borrow Protection**: Robust management system tracking book copies and active user borrow ledgers.
* **✍️ The Traveling Marginalia**: Interactive reader scrawls, notes, and emotional confessions left behind in the margins of classic volumes.
* **🗝️ Cabinet of Curiosities**: An interactive lore and artifact registry showcasing mysterious items recovered from the archive basement.
* **🎨 Folk & Dark-Academia UI**: Crafted with custom Tailwind CSS borders, soft parchment tones (`#FBF9F4`, `#3A506B`, `#2D312E`), handwritten typography, and Framer Motion micro-interactions.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** Next.js 16 (App Router, Client & Server Components)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Carousel / UI Sliders:** Swiper.js
* **Icons:** Lucide React

### **Backend & Database** *(External API)*
* **Runtime:** Node.js, Express.js
* **Database:** MongoDB / MySQL (via Prisma ORM / RESTful API architecture)

---

## 🚀 Getting Started Locally

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
* Node.js (v18+ recommended)
* npm or yarn package manager

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/booknook.git](https://github.com/your-username/booknook.git)
cd booknook
2. Install Dependencies
Bash
npm install
# or if using swiper / framer-motion dependencies
npm install swiper framer-motion lucide-react
3. Environment Variables
Create a .env.local file in the root directory of your project and configure your backend API endpoint:

Code snippet
NEXT_PUBLIC_API_URL=http://localhost:5000
4. Run the Development Server
Bash
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to view the application.

📂 Project Structure
Plaintext
booknook/
├── app/                  # Next.js App Router directory
│   ├── books/            # Dynamic book detail and review routes
│   ├── all-books/        # Full catalog repository page
│   ├── components/       # Reusable UI components (Hero, Navigation, etc.)
│   ├── layout.tsx        # Root layout with font and metadata configuration
│   └── page.tsx          # Home page featuring Swiper carousel & New Arrivals
├── public/               # Static assets, background patterns, and images
├── tailwind.config.js    # Tailwind styling configurations
└── package.json          # Project dependencies & scripts
✒️ Author & Contributors
Developed with care by Naira Mehjabin (Pixel Studio)

Frontend Designer & Full-Stack Web Developer