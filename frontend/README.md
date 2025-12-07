# EcoFinds - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Git (optional)

### Step 1: Install Dependencies

```bash
cd frontend
npm install next@latest react@latest react-dom@latest
npm install next-auth@latest mongoose@latest bcryptjs@latest
npm install framer-motion lucide-react react-hot-toast
npm install -D @types/node @types/react @types/bcryptjs
npm install -D tailwindcss postcss autoprefixer
npm install typescript @types/react-dom
```

### Step 2: Environment Variables

Create `.env.local` in the `frontend` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecofinds?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-random-secret-key-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000
```

**Get your MongoDB URI:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create free cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database password

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Or visit: https://generate-secret.vercel.app/32

### Step 3: File Structure

Ensure your project has this structure:

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── users/signup/route.ts
│   │   │   ├── products/route.ts
│   │   │   ├── products/[id]/route.ts
│   │   │   ├── orders/route.ts
│   │   │   └── dashboard/route.ts
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── products/page.tsx
│   │   ├── sell/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── cart/MiniCart.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── products/ProductCard.tsx
│   │   └── providers/SessionProviderWrapper.tsx
│   └── lib/
│       ├── models/
│       │   ├── User.ts
│       │   ├── Product.ts
│       │   └── Order.ts
│       └── dbConnect.ts
├── public/
│   └── images/
├── .env.local
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Step 4: Create Missing Config Files

**tailwind.config.ts:**
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
```

**src/app/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Features Checklist

- ✅ User authentication (signup/login)
- ✅ Sell products with quantity tracking
- ✅ Browse available products (Buy page)
- ✅ Shopping cart with localStorage
- ✅ Checkout and order creation
- ✅ Automatic stock management
- ✅ Seller dashboard with stats
- ✅ Revenue tracking

## 🔧 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:** Run `npm install` again and restart dev server

### Issue: MongoDB connection fails
**Solution:** 
- Check your connection string
- Make sure IP is whitelisted in MongoDB Atlas
- Verify username/password are correct

### Issue: NextAuth errors
**Solution:**
- Ensure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### Issue: Images not loading
**Solution:**
- Check `next.config.mjs` has correct remote patterns
- Use absolute URLs for images
- Add placeholder images in `/public/images/`

### Issue: Cart not updating
**Solution:**
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Ensure cart event listeners are working

## 🎯 Testing the Application

1. **Signup:** Go to `/auth/signup` and create an account
2. **Login:** Login with your credentials at `/auth/login`
3. **Sell:** Add a product at `/sell` with quantity
4. **Buy:** Browse products at `/products`
5. **Cart:** Add items to cart, adjust quantities
6. **Checkout:** Complete purchase (requires login)
7. **Dashboard:** View your stats and orders at `/dashboard`

## 📊 Data Flow

1. **Product Creation:**
   - User fills form → POST `/api/products`
   - Product saved with `createdBy`, `quantity`, `inStock`

2. **Adding to Cart:**
   - Click "Add to Cart" → Save to localStorage
   - Dispatch `cart-updated` event → MiniCart updates

3. **Checkout:**
   - POST `/api/orders` with cart items
   - Backend validates stock for each item
   - Decreases product quantity
   - Sets `inStock=false` if quantity ≤ 0
   - Creates Order document

4. **Dashboard:**
   - GET `/api/dashboard`
   - Fetches user's products
   - Calculates revenue from orders

## 🛠️ Customization

### Change Colors
Edit Tailwind classes in components:
- `emerald` → your color (e.g., `blue`, `purple`)
- Update throughout Navbar, buttons, cards

### Add More Fields
1. Update model schema in `src/lib/models/`
2. Update API routes
3. Update forms and displays

### Add Features
- Product categories/filters
- User profiles
- Reviews and ratings
- Search functionality
- Admin panel

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get all in-stock products |
| `/api/products?mine=true` | GET | Get user's products |
| `/api/products` | POST | Create new product |
| `/api/products/[id]` | DELETE | Delete product |
| `/api/orders` | POST | Create order |
| `/api/dashboard` | GET | Get seller stats |
| `/api/users/signup` | POST | Register user |
| `/api/auth/[...nextauth]` | POST | Login |

## 🚨 Important Notes

1. **Cart Storage:** Cart uses localStorage - not persistent across devices
2. **Stock Management:** Automatic - quantity updates on checkout
3. **Authentication:** Required for selling and checkout
4. **Product IDs:** Use MongoDB `_id` (string), not numeric IDs

## 💡 Next Steps

1. Deploy to Vercel
2. Add payment gateway (Stripe/Razorpay)
3. Implement email notifications
4. Add product search
5. Create mobile app version

## 📞 Support

If you encounter issues:
1. Check console for errors
2. Verify all environment variables
3. Ensure MongoDB is connected
4. Review the architecture doc

Good luck with your EcoFinds project! 🌱