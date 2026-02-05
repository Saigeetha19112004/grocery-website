// Global Data Storage
let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
let currentUser = null;
let currentCart = [];
let mlModel = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    showLoginPage();
    initializeMLModel();
});

// ============================================
// LOGIN SYSTEM
// ============================================

function loginAsAdmin() {
    currentUser = 'admin';
    showAdminPage();
}

function loginAsManager() {
    currentUser = 'manager';
    renderBillingProducts();
    showBillingPage();
}

function logout() {
    currentUser = null;
    currentCart = [];
    showLoginPage();
}

function showLoginPage() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('adminPage').classList.remove('active');
    document.getElementById('billingPage').classList.remove('active');
    document.getElementById('mlAnalyticsPage').classList.remove('active');
}

function showAdminPage() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('adminPage').classList.add('active');
    document.getElementById('billingPage').classList.remove('active');
    document.getElementById('mlAnalyticsPage').classList.remove('active');
    updateAdminDashboard();
}

function showBillingPage() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('adminPage').classList.remove('active');
    document.getElementById('billingPage').classList.add('active');
    document.getElementById('mlAnalyticsPage').classList.remove('active');
    renderBillingProducts();
}

function showMLAnalyticsPage() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('adminPage').classList.remove('active');
    document.getElementById('billingPage').classList.remove('active');
    document.getElementById('mlAnalyticsPage').classList.add('active');
    updateMLAnalytics();
}

function goBackToAdmin() {
    showAdminPage();
}

// ============================================
// ADMIN FUNCTIONS - EXCEL UPLOAD
// ============================================

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        showNotification('❌ Please select a file');
        return;
    }

    console.log('File selected:', file.name, file.type, file.size);

    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const fileContent = e.target.result;
            console.log('File content type:', typeof fileContent);
            
            let jsonData = [];

            // Check if it's an Excel file or CSV
            if (file.name.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
                // Parse as CSV (plain text)
                console.log('Parsing as CSV file');
                jsonData = parseCSV(fileContent);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                // Parse as Excel
                console.log('Parsing as Excel file');
                if (typeof XLSX === 'undefined') {
                    showNotification('❌ XLSX library not loaded. Try using CSV format instead.');
                    return;
                }
                const workbook = XLSX.read(fileContent, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                jsonData = XLSX.utils.sheet_to_json(firstSheet);
            } else {
                showNotification('❌ Please upload .csv or .xlsx file only');
                return;
            }

            console.log('Parsed data rows:', jsonData.length);
            console.log('Sample row:', jsonData[0]);

            // Parse and validate products
            allProducts = [];
            jsonData.forEach((row, index) => {
                // Try multiple column name variations (case-insensitive)
                let productId = '';
                let productName = '';
                let price = 0;

                // Find Product ID
                for (let key in row) {
                    const lowerKey = key.toLowerCase().trim();
                    if (lowerKey.includes('product id') || lowerKey === 'id' || lowerKey === 'productid' || lowerKey === 'product_id') {
                        productId = row[key];
                        break;
                    }
                }

                // Find Product Name
                for (let key in row) {
                    const lowerKey = key.toLowerCase().trim();
                    if (lowerKey.includes('product name') || lowerKey === 'name' || lowerKey === 'productname' || lowerKey === 'product_name') {
                        productName = row[key];
                        break;
                    }
                }

                // Find Price
                for (let key in row) {
                    const lowerKey = key.toLowerCase().trim();
                    if (lowerKey === 'price' || lowerKey === 'rate' || lowerKey === 'cost' || lowerKey === 'amount') {
                        price = parseFloat(row[key]);
                        break;
                    }
                }

                console.log(`Row ${index}:`, { productId, productName, price });

                // Validate and add product
                if (productId && productName && price > 0) {
                    allProducts.push({
                        id: productId.toString().trim(),
                        name: productName.toString().trim(),
                        price: parseFloat(price),
                        sold: 0
                    });
                }
            });

            console.log('Total products added:', allProducts.length);
            console.log('Products array:', allProducts);

            saveData();
            updateAdminDashboard();
            renderBillingProducts();
            
            if (allProducts.length > 0) {
                showNotification(`✓ Successfully uploaded ${allProducts.length} products!`);
                console.log('Upload successful');
            } else {
                showNotification('⚠️ No products found. Check your file format.\nColumns should be: "Product ID", "Product Name", "Price"');
                console.log('No valid products found');
            }
        } catch (error) {
            console.error('Error details:', error);
            showNotification(`❌ Error: ${error.message || 'Failed to read file. Please check the format.'}`);
        }
    };

    reader.onerror = (error) => {
        console.error('File read error:', error);
        showNotification('❌ Error reading file. Please try again.');
    };

    // Read file as text for CSV, or as array buffer for Excel
    if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
    
    // Reset input
    event.target.value = '';
}

// CSV Parser Function
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        console.log('CSV has no data rows');
        return [];
    }

    // Parse header
    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => h.trim());
    console.log('Headers:', headers);

    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        const values = line.split(',').map(v => v.trim());
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });

        data.push(row);
    }

    console.log('Parsed CSV rows:', data.length);
    return data;
}

function addProductManually() {
    const id = document.getElementById('adminProductId').value.trim();
    const name = document.getElementById('adminProductName').value.trim();
    const price = parseFloat(document.getElementById('adminProductPrice').value);

    if (!id || !name || price <= 0) {
        showNotification('❌ Please fill all fields with valid data');
        return;
    }

    // Check if product ID already exists
    if (allProducts.some(p => p.id === id)) {
        showNotification('❌ Product ID already exists');
        return;
    }

    allProducts.push({
        id: id,
        name: name,
        price: price,
        sold: 0
    });

    saveData();
    updateAdminDashboard();
    
    document.getElementById('adminProductId').value = '';
    document.getElementById('adminProductName').value = '';
    document.getElementById('adminProductPrice').value = '';

    showNotification(`✓ Product "${name}" added successfully!`);
}

function updateAdminDashboard() {
    // Update inventory list
    const inventoryContainer = document.getElementById('inventoryItems');
    const emptyMsg = document.getElementById('emptyInventory');

    if (allProducts.length === 0) {
        inventoryContainer.innerHTML = '';
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        inventoryContainer.innerHTML = allProducts.map(product => `
            <div class="inventory-item">
                <div class="inventory-item-id">ID: ${product.id}</div>
                <div class="inventory-item-name">${product.name}</div>
                <div class="inventory-item-price">₹${product.price.toFixed(2)}</div>
                <div style="font-size: 0.85em; color: #666; margin-top: 5px;">Sold: ${product.sold}</div>
            </div>
        `).join('');
    }

    // Update statistics
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalAmount, 0);
    const avgOrder = customers.length > 0 ? totalRevenue / customers.length : 0;

    document.getElementById('adminTotalProducts').textContent = allProducts.length;
    document.getElementById('adminTotalCustomers').textContent = customers.length;
    document.getElementById('adminTotalRevenue').textContent = totalRevenue.toFixed(2);
    document.getElementById('adminAvgOrder').textContent = avgOrder.toFixed(2);

    // Update transaction table
    updateTransactionTable();
}

function updateTransactionTable() {
    const tableBody = document.getElementById('transactionTableBody');
    const emptyMsg = document.getElementById('emptyTransactions');

    if (customers.length === 0) {
        tableBody.innerHTML = '';
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        tableBody.innerHTML = customers.map(customer => `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.items.length}</td>
                <td>₹${customer.totalAmount.toFixed(2)}</td>
                <td>${new Date(customer.timestamp).toLocaleString()}</td>
            </tr>
        `).join('');
    }
}

// ============================================
// BILLING FUNCTIONS
// ============================================

function renderBillingProducts() {
    const container = document.getElementById('billingProductsList');
    const emptyMsg = document.getElementById('emptyBillingProducts');

    if (allProducts.length === 0) {
        container.innerHTML = '';
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        container.innerHTML = allProducts.map((product, index) => `
            <div class="product-item" onclick="selectProductForBilling(${index})">
                <div class="product-item-id">ID: ${product.id}</div>
                <div class="product-item-name">${product.name}</div>
                <div class="product-item-price">₹${product.price.toFixed(2)}</div>
            </div>
        `).join('');
    }
}

function searchProductById() {
    const searchTerm = document.getElementById('productIdSearch').value.trim().toLowerCase();
    const container = document.getElementById('billingProductsList');

    if (!searchTerm) {
        renderBillingProducts();
        return;
    }

    const filtered = allProducts.filter(p => p.id.toLowerCase().includes(searchTerm));
    
    if (filtered.length === 0) {
        container.innerHTML = '<div style="color: #999; padding: 20px; text-align: center;">No products found</div>';
    } else {
        container.innerHTML = filtered.map((product, index) => `
            <div class="product-item" onclick="selectProductForBilling(${allProducts.indexOf(product)})">
                <div class="product-item-id">ID: ${product.id}</div>
                <div class="product-item-name">${product.name}</div>
                <div class="product-item-price">₹${product.price.toFixed(2)}</div>
            </div>
        `).join('');
    }
}

function selectProductForBilling(index) {
    const product = allProducts[index];
    
    // Check if product already in cart
    const existingItem = currentCart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        currentCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    document.getElementById('productIdSearch').value = '';
    renderBillingProducts();
    updateCart();
    showNotification(`✓ Added "${product.name}" to cart`);
}

function addProductToCart() {
    const productId = document.getElementById('productIdSearch').value.trim();
    const product = allProducts.find(p => p.id === productId);

    if (!product) {
        showNotification('❌ Product ID not found');
        return;
    }

    selectProductForBilling(allProducts.indexOf(product));
}

function updateCart() {
    const container = document.getElementById('cartItemsContainer');
    const emptyMsg = document.getElementById('emptyCart');
    const cartTable = document.getElementById('cartTable');
    const cartBody = document.getElementById('cartTableBody');

    if (currentCart.length === 0) {
        emptyMsg.style.display = 'block';
        cartTable.style.display = 'none';
    } else {
        emptyMsg.style.display = 'none';
        cartTable.style.display = 'table';
        
        cartBody.innerHTML = currentCart.map((item, index) => `
            <tr>
                <td>${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" class="cart-qty-input" value="${item.quantity}" 
                           onchange="updateCartQuantity(${index}, this.value)">
                </td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-small" onclick="removeFromCart(${index})">Remove</button>
                </td>
            </tr>
        `).join('');
    }

    updateInvoiceTotal();
}

function updateCartQuantity(index, newQty) {
    const qty = parseInt(newQty);
    if (qty < 1) {
        removeFromCart(index);
    } else {
        currentCart[index].quantity = qty;
        updateCart();
    }
}

function removeFromCart(index) {
    currentCart.splice(index, 1);
    updateCart();
}

function updateInvoiceTotal() {
    const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('totalAmount').textContent = total.toFixed(2);
}

function clearCart() {
    if (confirm('Clear all items from cart?')) {
        currentCart = [];
        updateCart();
        showNotification('✓ Cart cleared');
    }
}

function completePurchase() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();

    if (!customerName) {
        showNotification('❌ Please enter customer name');
        return;
    }

    if (!customerPhone) {
        showNotification('❌ Please enter phone number');
        return;
    }

    if (currentCart.length === 0) {
        showNotification('❌ Cart is empty');
        return;
    }

    // Calculate total
    const totalAmount = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create customer record
    const customer = {
        id: Date.now(),
        name: customerName,
        phone: customerPhone,
        items: [...currentCart],
        totalAmount: totalAmount,
        timestamp: new Date().toISOString()
    };

    // Update product sold count
    currentCart.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (product) {
            product.sold += item.quantity;
        }
    });

    // Store customer data
    customers.push(customer);
    salesHistory.push({
        date: new Date().toISOString(),
        totalSales: totalAmount,
        itemsSold: currentCart.reduce((sum, item) => sum + item.quantity, 0)
    });

    saveData();

    // Clear form
    currentCart = [];
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    updateCart();

    showNotification(`✓ Purchase completed! Total: ₹${totalAmount.toFixed(2)}`);
    
    // Print receipt
    printReceipt(customer);
}

function printReceipt(customer) {
    const receiptWindow = window.open('', '', 'height=500,width=500');
    const html = `
        <html>
            <head>
                <title>Receipt</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    h1 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background: #667eea; color: white; }
                    .total { font-weight: bold; font-size: 1.2em; }
                    .footer { text-align: center; margin-top: 20px; color: #666; }
                </style>
            </head>
            <body>
                <h1>🛒 Receipt</h1>
                <p><strong>Customer:</strong> ${customer.name}</p>
                <p><strong>Phone:</strong> ${customer.phone}</p>
                <p><strong>Date:</strong> ${new Date(customer.timestamp).toLocaleString()}</p>
                
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${customer.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>₹${item.price.toFixed(2)}</td>
                                <td>${item.quantity}</td>
                                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="total">Total Amount: ₹${customer.totalAmount.toFixed(2)}</div>
                <div class="footer">Thank you for your purchase!</div>
            </body>
        </html>
    `;
    receiptWindow.document.write(html);
    receiptWindow.document.close();
    receiptWindow.print();
}

// ============================================
// ML ANALYTICS FUNCTIONS
// ============================================

function initializeMLModel() {
    try {
        mlModel = tf.sequential({
            layers: [
                tf.layers.dense({ units: 32, activation: 'relu', inputShape: [1] }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({ units: 16, activation: 'relu' }),
                tf.layers.dense({ units: 1 })
            ]
        });

        mlModel.compile({
            optimizer: tf.train.adam(0.01),
            loss: 'meanSquaredError'
        });
    } catch (error) {
        console.error('Error initializing ML model:', error);
    }
}

async function trainMLModel() {
    if (salesHistory.length < 2) return;

    try {
        const xs = tf.tensor2d(
            salesHistory.map((_, i) => [i]),
            [salesHistory.length, 1]
        );

        const ys = tf.tensor2d(
            salesHistory.map(d => [d.totalSales]),
            [salesHistory.length, 1]
        );

        await mlModel.fit(xs, ys, {
            epochs: 50,
            verbose: 0,
            shuffle: true
        });

        xs.dispose();
        ys.dispose();
    } catch (error) {
        console.error('Error training model:', error);
    }
}

function predictSales(daysAhead = 1) {
    try {
        if (!mlModel || salesHistory.length === 0) return 0;
        const lastIndex = salesHistory.length;
        const prediction = mlModel.predict(tf.tensor2d([[lastIndex + daysAhead - 1]], [1, 1]));
        const result = prediction.dataSync()[0];
        prediction.dispose();
        return Math.max(0, result);
    } catch (error) {
        return 0;
    }
}

function updateMLAnalytics() {
    if (!mlModel) initializeMLModel();
    trainMLModel();

    const tomorrowForecast = predictSales(1);
    const weeklyForecast = Array.from({ length: 7 }, (_, i) => predictSales(i + 1))
        .reduce((sum, val) => sum + val, 0);

    const bestProduct = allProducts.reduce((max, p) => 
        p.sold > (max.sold || 0) ? p : max, 
        {}
    );

    const avgOrderValue = customers.length > 0 
        ? customers.reduce((sum, c) => sum + c.totalAmount, 0) / customers.length 
        : 0;

    const totalSales = customers.reduce((sum, c) => sum + c.totalAmount, 0);
    const avgDailySales = salesHistory.length > 0 
        ? totalSales / salesHistory.length 
        : 0;

    document.getElementById('mlSalesForecast').textContent = tomorrowForecast.toFixed(2);
    document.getElementById('mlWeeklyForecast').textContent = weeklyForecast.toFixed(2);
    document.getElementById('mlDemandProduct').textContent = bestProduct.name || 'N/A';
    document.getElementById('mlAvgOrderValue').textContent = avgOrderValue.toFixed(2);
    document.getElementById('mlTrend').textContent = avgDailySales > avgOrderValue ? '📈 Growing' : avgDailySales < avgOrderValue ? '📉 Declining' : '→ Stable';

    updateMLProductTable();
    drawSalesTrendChart();
}

function updateMLProductTable() {
    const tableBody = document.getElementById('mlProductTableBody');
    const emptyMsg = document.getElementById('emptyMLProducts');

    const sortedProducts = [...allProducts].sort((a, b) => b.sold - a.sold);

    if (sortedProducts.length === 0) {
        tableBody.innerHTML = '';
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        tableBody.innerHTML = sortedProducts.map(product => {
            const revenue = product.price * product.sold;
            const totalItems = customers.reduce((sum, c) => sum + c.items.length, 0);
            const demand = totalItems > 0 
                ? Math.round((product.sold / totalItems) * 100) 
                : 0;

            return `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.sold}</td>
                    <td>₹${revenue.toFixed(2)}</td>
                    <td>${demand}%</td>
                </tr>
            `;
        }).join('');
    }
}

function drawSalesTrendChart() {
    const canvas = document.getElementById('mlTrendCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (salesHistory.length === 0) {
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.fillText('No sales data yet', canvas.width / 2 - 60, canvas.height / 2);
        return;
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    const padding = 50;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    const maxSales = Math.max(...salesHistory.map(d => d.totalSales), 100);
    const minSales = 0;

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw data points and lines
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#667eea';

    ctx.beginPath();
    salesHistory.forEach((data, index) => {
        const x = padding + (width / (salesHistory.length - 1 || 1)) * index;
        const y = canvas.height - padding - ((data.totalSales - minSales) / (maxSales - minSales)) * height;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw points
    salesHistory.forEach((data, index) => {
        const x = padding + (width / (salesHistory.length - 1 || 1)) * index;
        const y = canvas.height - padding - ((data.totalSales - minSales) / (maxSales - minSales)) * height;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function saveData() {
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-in-out;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
