# 💳 Payment System Documentation

## Overview
Sistem pembayaran terintegrasi untuk Warung Makan Sederhana yang memungkinkan konfirmasi pembayaran setelah pembuatan pesanan.

## Flow Diagram
```
Customer: Add to Cart → Apply Promo (Optional) → Submit Order
   ↓
System: Create Order Record
   ↓
Customer: See Payment Confirmation Modal
   ↓
Customer: Select Payment Method → Add Notes → Confirm
   ↓
System: Create Payment Record (status: pending)
   ↓
Customer: Upload Payment Proof (for non-cash methods)
   ↓
Admin: Review Payment → Confirm/Reject
   ↓
System: Update Order Status → Update Payment Status
```

## Database Schema

### Payments Table
```sql
id                  BIGINT AUTO_INCREMENT PRIMARY KEY
order_id            BIGINT (FK to orders.id, CASCADE DELETE)
user_id             BIGINT (FK to users.id, CASCADE DELETE)
amount              DECIMAL(10,2)
payment_method      ENUM('cash', 'transfer', 'ewallet', 'qris')
payment_status      ENUM('pending', 'confirmed', 'failed')
payment_proof       VARCHAR(255) NULLABLE (file path)
notes               TEXT NULLABLE
paid_at             TIMESTAMP NULLABLE
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### Relationships
- `payments.order_id` → `orders.id` (belongsTo)
- `payments.user_id` → `users.id` (belongsTo)

## Payment Methods

### 1. 💵 Cash (Tunai)
- **Description**: Bayar tunai saat pengambilan pesanan
- **Process**:
  - Customer selects "cash"
  - Payment record created with status "pending"
  - Customer pays at cashier when picking up order
  - Admin confirms payment manually

### 2. 🏦 Transfer Bank
- **Description**: Transfer bank ke rekening warung
- **Bank Details**: BCA 1234567890 a.n. Warung Sederhana
- **Process**:
  - Customer selects "transfer"
  - Customer transfers to bank account
  - Customer uploads payment proof
  - Admin verifies and confirms

### 3. 📱 E-Wallet (GoPay/OVO/Dana)
- **Description**: Transfer via e-wallet apps
- **Account**: 081234567890
- **Process**:
  - Customer selects "ewallet"
  - Customer transfers via GoPay/OVO/Dana
  - Customer uploads payment proof
  - Admin verifies and confirms

### 4. 📲 QRIS
- **Description**: Scan QRIS code for payment
- **Process**:
  - Customer selects "qris"
  - Customer scans QRIS at cashier or uploaded image
  - Customer uploads payment proof
  - Admin verifies and confirms

## API Endpoints

### Payment Management

#### 1. Get All Payments
```http
GET /api/payments
GET /api/payments?user_id={userId}
```
**Response:**
```json
[
  {
    "id": 1,
    "order_id": 5,
    "user_id": 2,
    "amount": 25000,
    "payment_method": "transfer",
    "payment_status": "pending",
    "payment_proof": "payments/proof_123.jpg",
    "notes": "Transfer BCA",
    "paid_at": null,
    "created_at": "2025-12-19T10:30:00",
    "order": { /* order details */ },
    "user": { /* user details */ }
  }
]
```

#### 2. Get Payment by Order ID
```http
GET /api/payments/order/{orderId}
```

#### 3. Create Payment
```http
POST /api/payments
Content-Type: application/json

{
  "order_id": 5,
  "user_id": 2,
  "amount": 25000,
  "payment_method": "cash",
  "notes": "Bayar saat ambil pesanan"
}
```

**Validation:**
- `order_id`: required, must exist
- `user_id`: required, must exist
- `amount`: required, numeric, min 0
- `payment_method`: required, one of: cash, transfer, ewallet, qris
- `notes`: optional, string
- Each order can only have ONE payment record

#### 4. Upload Payment Proof
```http
POST /api/payments/{id}/upload-proof
Content-Type: multipart/form-data

payment_proof: [file]
```

**Validation:**
- File must be image (jpg, jpeg, png, gif)
- Max size: 2MB
- Old payment proof will be deleted automatically

#### 5. Confirm Payment (Admin Only)
```http
POST /api/payments/{id}/confirm
```

**Actions:**
- Sets `payment_status` to "confirmed"
- Sets `paid_at` to current timestamp
- Updates related order status to "processing"

#### 6. Mark Payment as Failed (Admin Only)
```http
POST /api/payments/{id}/fail
```

**Actions:**
- Sets `payment_status` to "failed"

#### 7. Delete Payment
```http
DELETE /api/payments/{id}
```

**Actions:**
- Deletes payment record
- Deletes payment proof file if exists

## Frontend Implementation

### Payment Confirmation Modal
Location: `resources/views/warteg.blade.php`

**Elements:**
- Order summary (subtotal, discount, final amount)
- Payment method selector
- Dynamic payment instructions
- Notes textarea
- Confirm/Cancel buttons

### JavaScript Functions

#### 1. `showPaymentModal(orderId, subtotal, discount, total)`
Opens payment modal and populates order details.

#### 2. `closePaymentModal()`
Closes modal and clears form.

#### 3. `updatePaymentInstructions(method)`
Updates instruction text based on selected payment method.

#### 4. `confirmPayment()`
Creates payment record via API and handles success/error.

### User Experience Flow

1. **Add Items to Cart**
   - Select menu items
   - Apply promo code (optional)

2. **Submit Order**
   - Click "Pesan Sekarang"
   - Order is created in database
   - Payment modal appears automatically

3. **Select Payment Method**
   - Choose from 4 options
   - See specific instructions for selected method
   - Add optional notes

4. **Confirm Payment**
   - Click "Konfirmasi"
   - Payment record created with "pending" status
   - Success message shown
   - Cart cleared
   - Redirected to Ongoing Orders (if on that tab)

5. **Upload Proof (Non-Cash Methods)**
   - Go to Ongoing Orders
   - Upload payment proof image
   - Wait for admin confirmation

6. **Admin Confirmation**
   - Admin reviews payment
   - Admin confirms/rejects payment
   - Order status updated accordingly

## Payment Status Workflow

```
PENDING → CONFIRMED (Admin Action) → Order Status: PROCESSING
   ↓
  FAILED (Admin Action) → Order remains PENDING
```

## Security Considerations

1. **Validation**: All inputs validated server-side
2. **File Upload**:
   - Type validation (images only)
   - Size limit (2MB)
   - Unique filename generation
3. **Payment Integrity**:
   - One payment per order (database constraint)
   - Amount verification
   - Admin-only confirmation

## Error Handling

### Common Errors

1. **Duplicate Payment**
```json
{
  "error": "Order already has a payment record"
}
```

2. **Invalid Order**
```json
{
  "error": "Order not found"
}
```

3. **Invalid Payment Method**
```json
{
  "errors": {
    "payment_method": ["The selected payment method is invalid."]
  }
}
```

4. **File Too Large**
```json
{
  "error": "File size must be less than 2MB"
}
```

## Testing with Postman

### Prerequisites
1. Import `Warung_Makan_Sederhana_v2.postman_collection.json`
2. Set `base_url` to `http://127.0.0.1:8000`
3. Login as Admin or User to set `user_id`

### Test Sequence

1. **Login User**
   ```
   POST {{base_url}}/api/login
   ```

2. **Create Order**
   ```
   POST {{base_url}}/api/orders
   ```

3. **Create Payment**
   ```
   POST {{base_url}}/api/payments
   Body: { order_id, user_id, amount, payment_method, notes }
   ```

4. **Upload Proof** (optional)
   ```
   POST {{base_url}}/api/payments/1/upload-proof
   Body: payment_proof file
   ```

5. **Confirm Payment** (as Admin)
   ```
   POST {{base_url}}/api/payments/1/confirm
   ```

6. **Get Payment Details**
   ```
   GET {{base_url}}/api/payments/order/1
   ```

## Future Enhancements

1. **Payment Gateway Integration**
   - Midtrans API
   - Xendit API
   - Payment gateway webhook handling

2. **Automatic QRIS Generation**
   - Dynamic QRIS per transaction
   - Amount validation

3. **Payment Reminders**
   - Email notifications
   - SMS notifications

4. **Payment Analytics**
   - Payment method statistics
   - Revenue reports
   - Payment success rate

5. **Refund System**
   - Partial refunds
   - Full refunds
   - Refund tracking

## Troubleshooting

### Payment Modal Not Appearing
- Check browser console for errors
- Verify `submitOrder()` function calls `showPaymentModal()`
- Ensure modal HTML exists in blade template

### Payment Creation Failed
- Verify order exists in database
- Check amount is positive number
- Ensure payment_method is valid enum value
- Confirm order doesn't already have payment

### File Upload Failed
- Check file size (max 2MB)
- Verify file is image type
- Ensure storage/app/public/payments directory exists
- Run `php artisan storage:link`

### Payment Not Confirmed
- Verify user has admin role
- Check payment exists
- Ensure payment status is "pending"

## Support

For issues or questions:
1. Check error logs: `storage/logs/laravel.log`
2. Review this documentation
3. Test with Postman collection
4. Contact system administrator

---
**Version**: 1.0
**Last Updated**: December 19, 2025
**Author**: GitHub Copilot
