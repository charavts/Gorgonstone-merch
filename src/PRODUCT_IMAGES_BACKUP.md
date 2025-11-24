# Gorgonstone Product Images Backup

## Current Placeholder Images (Unsplash)

Αυτά τα images χρησιμοποιούνται ως placeholders μέχρι να ανεβάσεις τις πραγματικές εικόνες μέσω του Admin Dashboard.

---

### 1. Black T-shirt Split Stone Face
- **Product ID**: 1
- **Image URL**: 
```
https://images.unsplash.com/photo-1711641066085-5236bf7afcd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHQtc2hpcnR8ZW58MXx8fHwxNzYzOTcyNDMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral
```
- **Alt Text**: Black T-shirt

---

### 2. Medusa Mask T-shirt
- **Product ID**: 2
- **Image URL**:
```
https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHQtc2hpcnR8ZW58MXx8fHwxNzYzOTUwMzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral
```
- **Alt Text**: White T-shirt

---

### 3. Ammon Horns Medusa Hoodie (Black variant)
- **Product ID**: 3
- **Color**: Black
- **Image URL**:
```
https://images.unsplash.com/photo-1647797819874-f51a8a8fc5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZXxlbnwxfHx8fDE3NjM5NTI0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral
```
- **Alt Text**: Black Hoodie

---

### 4. Ammon Horns Medusa Hoodie (White variant)
- **Product ID**: 3
- **Color**: White
- **Image URL**:
```
https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080
```
- **Alt Text**: White Hoodie

---

### 5. Gorgonstone Sweatshirt
- **Product ID**: 5
- **Image URL**:
```
https://images.unsplash.com/photo-1614173968962-0e61c5ed196f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN3ZWF0c2hpcnR8ZW58MXx8fHwxNzYzOTk5OTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral
```
- **Alt Text**: Black Sweatshirt

---

## Logo Image

### Gorgonstone Logo (Main)
- **Current URL**: Fetched from backend (`/make-server-deab0cbd/logo`)
- **Fallback**: Transparent/Hidden until loaded
- **Note**: Upload your actual logo via Admin Dashboard → Settings

---

## Πώς να Αντικαταστήσεις τις Εικόνες

1. **Login στο Admin Dashboard**: `/admin`
2. **Επέλεξε "Products"** ή **"Settings"** για logo
3. **Κάνε Upload τις πραγματικές σου εικόνες**
4. Τα placeholder images θα αντικατασταθούν αυτόματα!

---

## Technical Details

- **Image Storage**: Supabase Storage (private buckets)
- **Bucket Name**: `make-deab0cbd-product-images`
- **Access**: Signed URLs με 1 hour expiration
- **Max Size**: Varies by endpoint
- **Supported Formats**: JPEG, PNG, WebP

---

## Backend Endpoints

- **GET** `/products` - Fetch all products with images
- **POST** `/admin/upload-product-image` - Upload product image
- **POST** `/admin/upload-logo` - Upload logo
- **GET** `/logo` - Get current logo URL

---

**Last Updated**: November 24, 2024
**Status**: ✅ All placeholder images working
**GitHub URL Errors**: ❌ Fixed (force-reset system implemented)
