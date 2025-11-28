# 🌿 EcoFinds — Sustainable Marketplace

<div align="center">


**Connecting conscious consumers with eco-friendly products** ♻️

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

## ✨ About The Project

EcoFinds is a **full-stack web application** built to promote sustainable living by connecting users with eco-friendly products. This platform makes it easy for conscious consumers to discover and purchase products that align with their environmental values, while providing sellers with a dedicated space to showcase their sustainable offerings.

### 🎯 Why EcoFinds?

- 🌱 **Promote Sustainability** - Encourages eco-conscious shopping habits
- 🛍️ **Curated Products** - Verified sustainable and ethical products
- 🔒 **Secure Platform** - JWT authentication and secure transactions
- 📱 **Responsive Design** - Seamless experience across all devices
- ⚡ **Lightweight & Fast** - Built with performance in mind

## 🚀 Features

### 👤 User Features
- **🔐 Secure Authentication** - JWT-based login/signup with bcrypt password hashing
- **🛍️ Product Discovery** - Browse curated eco-friendly products with intuitive UI
- **🛒 Smart Cart System** - Add/remove items with persistent storage per user
- **💚 Personalized Experience** - User-specific cart and preferences
- **📱 Mobile-First Design** - Flawless experience on all screen sizes

### 👨‍💼 Admin/Seller Features
- **📦 Product Management** - Add new sustainable products to the marketplace
- **🗑️ Inventory Control** - Remove products when out of stock
- **📊 Simple Dashboard** - Clean interface for product management
- **🔧 Scalable Architecture** - Easy to extend with new features

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with Flexbox/Grid
- **Vanilla JavaScript** - Modular, component-based architecture

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite** - Lightweight database
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing

### Development Tools
- **Nodemon** - Development server with hot reload
- **ESLint** - Code linting and quality
- **Morgan** - HTTP request logging

## 📁 Project Structure

```bash
EcoFinds/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic handlers
│   ├── models/          # Database interaction layer
│   ├── routes/          # API endpoint definitions
│   ├── middleware/      # JWT authentication middleware
│   ├── server.js        # Application entry point
│   └── database.sqlite  # SQLite database file
├── frontend/
│   ├── assets/
│   │   ├── css/         # Stylesheets
│   │   └── js/          # Modular JavaScript
│   ├── index.html       # Login/Signup page
│   ├── product.html     # Product listing page
│   └── cart.html        # Shopping cart page
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sreeraksha0123/EcoFinds.git
   cd EcoFinds
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   Create `.env` file in `/backend`:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secure_jwt_secret
   DATABASE_PATH=./backend/database.sqlite
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   Expected output:
   ```bash
   🗄️ SQLite database initialized successfully!
   ✅ Server running on port 5000
   🌐 API: http://localhost:5000
   ```

5. **Launch the frontend**
   - Use Live Server extension in VS Code
   - Right-click `frontend/index.html` → "Open with Live Server"
   - Access at `http://127.0.0.1:5500/frontend/`

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user and return JWT |

### Product Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/products` | Get all products | No |
| `POST` | `/api/products` | Add new product | Yes |
| `DELETE` | `/api/products/:id` | Delete product | Yes |

### Cart Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/cart/add` | Add item to cart | Yes |
| `GET` | `/api/cart/:userId` | Get user's cart | Yes |
| `DELETE` | `/api/cart/:userId/:productId` | Remove item from cart | Yes |

## 🎯 How It Works

1. **User Registration**: Secure signup with bcrypt password hashing
2. **Authentication**: JWT tokens for session management
3. **Product Browsing**: Responsive product catalog with clean UI
4. **Cart Management**: User-specific cart with persistent storage
5. **Admin Operations**: Protected routes for product management

## 🚧 Future Enhancements

- **💳 Payment Integration** - Stripe/PayPal for seamless checkout
- **🖼️ Image Upload** - Cloudinary integration for product images
- **🔍 Advanced Search** - Filters by category, price range, sustainability metrics
- **📊 Seller Dashboard** - Analytics and inventory management
- **🌐 Deployment** - Cloud deployment with CI/CD pipeline
- **📱 PWA** - Progressive Web App capabilities
- **🧪 Testing Suite** - Unit and integration tests

## 🤝 Contributing

We love your input! We want to make contributing to EcoFinds as easy and transparent as possible.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author
**Sree Raksha S P**  
💻 Full Stack Developer & Data Enthusiast

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/sreeraksha0123)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sreeraksha0123)
[![LeetCode](https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=white)](https://leetcode.com/u/sreeraksha0123/)



---
<div align="center">

🌿 **Built with sustainable code practices** 💚

</div>
