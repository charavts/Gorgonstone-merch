# Gorgonstone Admin Guide

## 🔑 Admin Access

### Admin Accounts
The following email addresses have admin privileges:
- `admin@gorgonstone.com`
- `charavits@gmail.com`

### How to Access Admin Panel

1. **Sign Up / Login**
   - Go to `/login` page
   - If you don't have an account, sign up with your admin email
   - If you already have an account, sign in

2. **Access Admin Dashboard**
   - Once logged in with an admin email, you'll see an "Admin" button in the header
   - Click on it or navigate to `/admin`

## 📦 Managing Products

### View Products
- All products are displayed in the admin dashboard
- Each product shows:
  - Image
  - Name
  - Price
  - Available colors (if any)

### Add New Product
1. Click "Νέο Προϊόν" / "New Product" button
2. Fill in the required fields:
   - **Product Name** (required) - e.g., "Black T-shirt Split Stone Face"
   - **Price (€)** (required) - e.g., 28
   - **Image URL** (required) - Full URL to the product image
   - **Stripe URL** (optional) - Stripe payment link
   - **Colors** (optional) - Comma-separated list, e.g., "Black, White"
3. Click "Αποθήκευση" / "Save"

### Edit Product
1. Click the edit icon (pencil) on any product
2. Modify the fields you want to change
3. Click "Αποθήκευση" / "Save"

### Delete Product
1. Click the delete icon (trash) on any product
2. Confirm the deletion

## 💾 Data Storage

All products are stored in the Supabase KV store and will persist across sessions.

## 🌍 Features

- **Multilingual Support**: All admin functionality works in both Greek and English
- **Real-time Updates**: Changes are saved immediately to the database
- **Protected Routes**: Only admin users can access the admin panel
- **Session Management**: Your session persists even after closing the browser

## 🔒 Security Notes

- Only users with admin email addresses can modify products
- All API calls require authentication
- The admin check is performed on the server side for security

## 📝 Future Enhancements

You can extend the admin panel to manage:
- Site settings (contact info, shipping rates, etc.)
- Order management
- Customer management
- Analytics and reports
