# 🛍️ Gadget Galaxy

This is a **feature-rich e-commerce frontend application** built with **React** and **Redux Toolkit**.  
It includes **user authentication**, **product browsing**, and a **complete checkout workflow**, designed with smooth animations and modern UI practices.

---

## 🚀 Key Features

### 🔐 User Authentication  
- Full **login and signup system** with protected routes for account and checkout pages.  

### 🛒 E-Commerce Workflow  
A complete shopping experience including:  
- Product listing and detail pages  
- Shopping cart functionality  
- Wishlist management  
- Product comparison system  

### ⚙️ State Management  
- Centralized state handling with **Redux Toolkit** (`@reduxjs/toolkit`)  
- Separate slices for **auth**, **cart**, **products**, **wishlist**, and **compare**  

### 🎨 Rich Interactions  
- 3D model integration using **@splinetool/react-spline**  
- Smooth UI animations powered by **Framer Motion**  

### 🧾 PDF Generation  
- Ability to generate PDFs (invoices/reports) using **jspdf** and **jspdf-autotable**

---

## 🧰 Technology Stack

| Category | Technology |
|---|---|
| **Frontend** | React (v19) |
| **Build Tool** | Vite |
| **State Management** | Redux Toolkit |
| **Routing** | React Router (`react-router-dom`) |
| **Styling** | Bootstrap, React-Bootstrap, Sass |
| **API Client** | Axios |
| **Animation** | Framer Motion |
| **3D Graphics** | Spline (`@splinetool/react-spline`) |

---

## 🔗 Links

- **Repository:** https://github.com/MK-1512/gadget-galaxy  
- **Live Demo:** https://gadget-galaxy.vercel.app/

---

## ⚙️ Setup and Installation

> These commands assume you have Node.js and npm installed.

1. **Clone the repository**
```bash
git clone https://github.com/MK-1512/gadget-galaxy.git
cd gadget-galaxy
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```
Open your browser at the address shown in the terminal (usually `http://localhost:5173` for Vite).

4. **Build for production**
```bash
npm run build
```

5. **Preview production build locally**
```bash
npm run preview
```

---

## 📁 Project Structure (high level)

```
gadget-galaxy/
├─ public/
├─ src/
│  ├─ components/
│  ├─ pages/
│  ├─ redux/        # slices, store (auth, cart, products, wishlist, compare)
│  ├─ assets/
│  └─ App.jsx
├─ package.json
└─ README.md
```

---

## 🧪 Notes & Usage Tips

- If authentication or API endpoints require environment variables, create a `.env` file in the project root and add keys as needed (example: `VITE_API_BASE_URL=https://api.example.com`). Do **not** commit `.env` to the repo.
- For local testing of API-driven features, the app may fall back to mocked/local data if no backend is provided.

---

## 📸 Screenshots

*(Optional — add screenshot files under `/public` or `/assets` and then uncomment and update the path below)*

```markdown
![Home Page](./public/screenshot-home.png)
![Product Page](./public/screenshot-product.png)
```

---

## 🤝 Contribution

This project was developed as part of my learning and exploration in frontend development, focusing on scalable React architecture and modern UI design practices.

---

## 👨‍💻 Author & Contact

**Mukesh Kumar J**  
- Email: mktech1512@gmail.com  
- LinkedIn: https://linkedin.com/in/mk2003  
- GitHub: https://github.com/MK-1512
