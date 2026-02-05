# 🛒 Grocery Store Management System

A comprehensive web-based grocery store management application with admin dashboard, billing system, and AI-powered sales analytics.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [User Roles](#user-roles)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🔐 Authentication System
- **Two User Roles**: Admin and Manager
- Secure role-based login system
- Quick logout functionality
- Session management with local storage

### 📦 Admin Dashboard
- **Inventory Management**: Add products manually or upload via CSV/Excel
- **Product Tracking**: View all products with details (ID, Name, Price, Stock)
- **Bulk Upload**: Support for CSV and Excel (.xlsx) file formats
- **Product Details**: Track product ID, name, price, and sold count
- **Flexible Upload**: Multiple column name variations supported

### 💳 Billing System
- **Product Search**: Quick product lookup by ID or browse from inventory
- **Shopping Cart**: Add products with adjustable quantities
- **Smart Quantity Handling**: Automatically combines duplicate products and increases quantity
- **Customer Information**: Collect customer name and phone number
- **Invoice Generation**: Detailed invoices with items, quantities, prices, and totals
- **Receipt Printing**: Print professional receipts with customer and purchase details
- **Tax Calculation**: Configurable tax rate (default 10%)

### 📊 ML Analytics Dashboard
- **Sales Forecasting**: Neural network model predicts future sales
- **Demand Analysis**: Identify high-demand and low-demand products
- **Product Analytics**: 
  - Demand scoring for each product
  - Sold count tracking
  - Price analysis
- **Sales Trends**: Interactive canvas chart showing sales patterns
- **Real-time Model Training**: ML model trains on transaction history

### 💾 Data Persistence
- **Local Storage**: All data stored in browser's localStorage
- **Automatic Save**: Data saved after every transaction
- **Transaction History**: Complete purchase history for analytics
- **Customer Database**: Track all customer purchases

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Styling**: Gradient UI with smooth animations
- **Quick Navigation**: Navigation widget for easy page switching
- **Intuitive Layout**: Clean and organized interface

---

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Machine Learning**: TensorFlow.js (Neural Network)
- **Data Import**: XLSX.js library for Excel parsing
- **Charting**: HTML5 Canvas for sales trend visualization
- **Storage**: Browser localStorage (no backend required)
- **Deployment**: Netlify, GitHub Pages, Vercel, Firebase, or traditional hosting

---

## 📁 Project Structure

```
grocery_app/
├── index.html              # Main HTML file with all pages
├── style.css               # Complete styling and responsive design
├── script.js               # All JavaScript functionality
├── sample_products.csv     # Sample data for testing
├── README.md              # This file
└── DEPLOYMENT_GUIDE.md    # Detailed deployment instructions
```

### File Descriptions

| File | Purpose |
|------|---------|
| `index.html` | Contains HTML structure for all 4 pages: Login, Admin Dashboard, Billing, ML Analytics |
| `style.css` | Complete styling with responsive breakpoints and animations |
| `script.js` | All logic for authentication, admin, billing, CSV parsing, and ML model |
| `sample_products.csv` | Sample product data to test CSV upload feature |
| `README.md` | Project documentation |
| `DEPLOYMENT_GUIDE.md` | Complete deployment instructions for multiple platforms |

---

## 🚀 Installation

### Local Setup (No Installation Required)
This is a client-side web application with no backend dependencies. Simply:

1. **Download or Clone** the repository
```bash
git clone https://github.com/yourusername/grocery_app.git
cd grocery_app
```

2. **Open in Browser**
   - Double-click `index.html` to open locally
   - Or use a local server (Python):
   ```bash
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

3. **Ready to Use!**
   - No installation, no dependencies to install
   - All features work offline

---

## 📖 Usage

### Getting Started

#### Login Page
1. Open the application
2. Choose your role:
   - **Admin**: Manage inventory and view analytics
   - **Manager**: Handle customer billing and sales

#### Admin Dashboard
1. **Upload Products**:
   - Click "Choose File" button
   - Select CSV or Excel file with columns: Product ID, Product Name, Price
   - File auto-parses and loads products

2. **Add Product Manually**:
   - Enter Product ID, Name, and Price
   - Click "Add Product"

3. **View Inventory**:
   - See all products in the sidebar
   - Shows product ID, name, price, and sold count

#### Billing Page
1. **Add Products to Cart**:
   - Enter Product ID and click "Add to Cart"
   - Or click product from sidebar
   - **Same product added multiple times?** Quantity automatically increases in cart

2. **Manage Cart**:
   - Adjust quantity using input field
   - Remove items with delete button
   - View total price with tax

3. **Complete Purchase**:
   - Enter customer name and phone
   - Click "Complete Purchase"
   - View and print receipt

#### ML Analytics
- View sales forecasting predictions
- Analyze product demand scores
- See sales trends in interactive chart
- Model improves as more transactions are recorded

---

## 👥 User Roles

### Admin Role
- **Access**: Admin Dashboard only
- **Permissions**:
  - Upload product inventory (CSV/Excel)
  - Add products manually
  - View all products
  - View sales statistics (ML page)

### Manager Role
- **Access**: Billing Page
- **Permissions**:
  - View product inventory
  - Add products to cart
  - Process customer purchases
  - Generate and print receipts
  - Adjust quantities on the fly

---

## 🚀 Deployment

### Quick Deploy (Netlify) - Recommended
Takes 2-3 minutes:

1. Push code to GitHub
2. Connect to Netlify
3. Get your live URL

See `DEPLOYMENT_GUIDE.md` for detailed instructions on:
- ✅ **Netlify** (Fastest, Recommended)
- ✅ **GitHub Pages** (Free)
- ✅ **Vercel** (High Performance)
- ✅ **Firebase** (Google Platform)
- ✅ **Traditional Hosting** (Paid Options)
- ✅ **Local Testing** (Python Server)

---

## 📸 Features Overview

### Login System
- Clean login interface
- Two distinct roles (Admin, Manager)
- Session management

### Admin Dashboard
- CSV/Excel file upload
- Product management interface
- Real-time inventory updates
- Product sidebar with sold tracking

### Billing Interface
- Product search and selection
- Shopping cart with quantity management
- Automatic duplicate product combination
- Customer information collection
- Tax calculation
- Professional receipt generation

### ML Analytics
- Sales forecasting neural network
- Product demand analysis
- Sales trend visualization
- Real-time model updates

---

## 💡 Key Features Explained

### Smart Cart System
When a customer wants to buy the same product multiple times:
- **First time**: Product added to cart with Qty: 1
- **Second time**: Quantity increases to 2 (shown as one line item)
- **Result**: Clean cart view with combined quantities

### CSV Upload Format
Required columns (case-insensitive):
```
Product ID, Product Name, Price
P001, Apple, 2.50
P002, Banana, 1.75
P003, Orange, 3.00
```

### Receipt Features
- Customer details (Name, Phone)
- Itemized purchase list
- Unit prices and quantities
- Subtotal and tax breakdown
- Final amount
- Print-ready formatting

### ML Predictions
- Analyzes historical sales
- Predicts future demand
- Identifies trending products
- Improves accuracy with more data

---

## 🎯 Data Storage

### Where Data is Stored
- **Browser LocalStorage**: All data persists in the user's browser
- **No Cloud Sync**: Data doesn't sync across devices/browsers
- **Clear Cache**: Clearing browser cache will clear all data

### Data Backed Up in:
- Products Array (allProducts)
- Customer Database (customers)
- Sales History (salesHistory)
- ML Training Data

---

## 🔧 Customization

### Change Tax Rate
Edit in `script.js`:
```javascript
const taxRate = 0.10; // Change 0.10 to your desired rate (e.g., 0.18 for 18%)
```

### Change Color Scheme
Edit in `style.css`:
```css
/* Primary gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Modify these hex codes to your preferred colors */
```

### Add More Columns to Products
Edit the CSV parser in `script.js` to handle additional product attributes.

---

## ⚠️ Limitations

- **No Backend**: All data stored locally in browser
- **No Multi-User**: Each browser has separate data
- **No Cloud Sync**: Data doesn't backup to cloud
- **No Database**: Uses browser localStorage only

**For Production Use**: Consider adding a backend database (Firebase, MongoDB, PostgreSQL) for multi-user support and cloud backup.

---

## 🐛 Troubleshooting

### CSV Upload Not Working?
- ✅ Check column headers (should match: Product ID, Product Name, Price)
- ✅ Ensure no blank rows in CSV
- ✅ Use .csv or .xlsx file format
- ✅ Open browser console (F12) to see error messages

### Cart Items Not Combining?
- ✅ Verify Product IDs are identical
- ✅ Check that you're using the same product
- ✅ Refresh the page and try again

### Data Lost After Refresh?
- ✅ Normal behavior - localStorage cleared
- ✅ Keep your CSV backup file
- ✅ Re-upload products when needed

### ML Analytics Not Showing?
- ✅ Need at least 5-10 transactions
- ✅ ML model improves with more data
- ✅ Check browser console for errors

---

## 📝 Sample CSV Format

```csv
Product ID,Product Name,Price
P001,Apple,2.50
P002,Banana,1.75
P003,Orange,3.00
P004,Mango,4.00
P005,Grapes,5.50
P006,Milk,3.20
P007,Bread,2.00
P008,Butter,4.50
P009,Cheese,6.00
P010,Yogurt,2.80
```

Download the included `sample_products.csv` to see the exact format.

---

## 🚀 Future Enhancements

Potential features for next versions:
- Backend API integration (Node.js, Python)
- Database support (MongoDB, PostgreSQL)
- Multi-user with authentication
- Cloud data backup
- Advanced analytics dashboard
- Barcode scanner integration
- Inventory alerts and reorder points
- Customer loyalty program
- More payment methods
- Email receipt delivery
- Multi-language support

---

## 📄 License

This project is open source and available under the MIT License. See the LICENSE file for more details.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the DEPLOYMENT_GUIDE.md for deployment help

---

## 🎓 Learning Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [JavaScript LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Responsive Web Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

## 🙏 Acknowledgments

- Built with HTML5, CSS3, and vanilla JavaScript
- ML capabilities powered by TensorFlow.js
- Excel parsing via XLSX.js library
- Inspired by real-world grocery management needs

---

## 📊 Project Statistics

- **Lines of Code**: 1000+
- **CSS Styling**: 600+ lines
- **JavaScript Logic**: 400+ lines
- **Features**: 20+ major features
- **User Roles**: 2
- **Pages**: 4 complete pages
- **Responsive Breakpoints**: 4 (Desktop, Tablet, Mobile)

---

## 🎯 Quick Links

- [View Live Demo](#deployment) (after deployment)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Quick Deploy to Netlify](QUICK_DEPLOY.md)
- [GitHub Repository](https://github.com/yourusername/grocery_app)

---

**Made with ❤️ for grocery store management**

Last Updated: February 2026
