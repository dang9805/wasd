// index.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors'); // <-- THÊM DÒNG NÀY

app.use(express.json());
app.use(cors());

// --- MySQL connection (khuyến nghị: chuyển sang POOL & dùng biến môi trường) ---
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'hungnohb123', // -> put into env var in production
  database: process.env.DB_NAME || 'building_management',
  multipleStatements: false
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connect error:', err.message);
    process.exit(1);
  }
  console.log('✅ Kết nối MySQL thành công');
});

// -------- Root --------
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

// -------- US-001: Residents CRUD --------

// GET all residents
app.get('/residents', (req, res) => {
  const sql = `SELECT * FROM residents ORDER BY id`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single resident
app.get('/residents/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM residents WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Resident not found' });
    res.json(results[0]);
  });
});

// POST create resident
app.post('/residents', (req, res) => {
  const { first_name, last_name, phone, apartment_id, cccd, birth_date, role, residency_status, email } = req.body || {};
  if (!first_name || !last_name || !phone || !apartment_id) {
    return res.status(400).json({ error: 'Thiếu trường bắt buộc: first_name, last_name, phone, apartment_id' });
  }

  const full_name = `${first_name.trim()} ${last_name.trim()}`;
  const sql = `INSERT INTO residents 
    (full_name, first_name, last_name, phone, apartment_id, cccd, birth_date, role, residency_status, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [full_name, first_name, last_name, phone, apartment_id, cccd || null, birth_date || null, role || null, residency_status || null, email || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Thêm cư dân thành công', id: result.insertId });
  });
});

// PUT update resident
app.put('/residents/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone, apartment_id, state, cccd, birth_date, role, residency_status, email } = req.body || {};
  if (!id) return res.status(400).json({ error: 'Thiếu id' });

  const full_name = (first_name && last_name) ? `${first_name.trim()} ${last_name.trim()}` : undefined;

  const sql = `
    UPDATE residents
    SET first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        full_name = COALESCE(?, full_name),
        phone = COALESCE(?, phone),
        apartment_id = COALESCE(?, apartment_id),
        state = COALESCE(?, state),
        cccd = COALESCE(?, cccd),
        birth_date = COALESCE(?, birth_date),
        role = COALESCE(?, role),
        residency_status = COALESCE(?, residency_status),
        email = COALESCE(?, email)
    WHERE id = ?
  `;
  db.query(sql, [first_name, last_name, full_name, phone, apartment_id, state, cccd, birth_date, role, residency_status, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy cư dân' });
    res.json({ message: 'Cập nhật thành công' });
  });
});

// DELETE resident
app.delete('/residents/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM residents WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy cư dân' });
    res.json({ message: 'Xóa thành công' });
  });
});

// -------- US-008: Payments --------

// GET mock fees
app.get('/fees', (req, res) => {
  res.json([
    { id: 1, description: 'Phí quản lý tháng 10', amount: 300000 },
    { id: 2, description: 'Phí gửi xe', amount: 100000 }
  ]);
});

// POST create payment (generate transaction_ref)
app.post('/payment', (req, res) => {
  const { resident_id, amount, feetype, payment_form } = req.body || {};
  if (!resident_id || !amount) {
    return res.status(400).json({ error: 'Thiếu resident_id hoặc amount' });
  }

  // transaction ref
  const transactionRef = `TRX_${Date.now()}`;

  const sql = `INSERT INTO payments 
    (resident_id, amount, state, transaction_ref, feetype, payment_date, payment_form)
    VALUES (?, ?, 0, ?, ?, NULL, ?)`;

  db.query(sql, [resident_id, amount, transactionRef, feetype || null, payment_form || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Tạo giao dịch thành công', transaction_ref: transactionRef, payment_id: result.insertId });
  });
});

// POST payment callback (webhook mock)
app.post('/payment/callback', (req, res) => {
  console.log('callback body:', req.body);

  const transaction_ref = String(req.body?.transaction_ref || '').trim();
  const statusRaw = String(req.body?.status || '').trim();
  const status = statusRaw.toLowerCase();

  // Accept 'success' and 'failed'
  const allowed = new Set(['success', 'failed']);
  if (!transaction_ref || !allowed.has(status)) {
    return res.status(400).json({ error: 'transaction_ref hoặc status không hợp lệ' });
  }

  // If success -> set state = 1 (paid). If failed -> state stays 0 (or mark failed; we keep it 0).
  if (status === 'success') {
    const sql = `
      UPDATE payments
      SET state = 1,
          provider_tx_id = COALESCE(?, provider_tx_id),
          payer_account = COALESCE(?, payer_account),
          payer_name = COALESCE(?, payer_name),
          verification_method = 'webhook',
          verified_at = NOW(),
          updated_at = NOW()
      WHERE transaction_ref = ? AND state = 0
    `;
    const { provider_tx_id, payer_account, payer_name } = req.body;
    db.query(sql, [provider_tx_id || null, payer_account || null, payer_name || null, transaction_ref], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(409).json({ error: 'Không cập nhật được: không tìm thấy transaction pending hoặc đã được xác nhận trước đó' });
      }
      return res.json({ message: 'Cập nhật trạng thái giao dịch thành công' });
    });
  } else {
    // failed case: update provider_tx_id and leave state = 0 (pending/failed); we do idempotent update only if state = 0
    const sql = `
      UPDATE payments
      SET provider_tx_id = COALESCE(?, provider_tx_id),
          payer_account = COALESCE(?, payer_account),
          payer_name = COALESCE(?, payer_name),
          verification_method = 'webhook',
          updated_at = NOW()
      WHERE transaction_ref = ? AND state = 0
    `;
    const { provider_tx_id, payer_account, payer_name } = req.body;
    db.query(sql, [provider_tx_id || null, payer_account || null, payer_name || null, transaction_ref], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(409).json({ error: 'Không cập nhật được: không tìm thấy transaction pending hoặc đã được xác nhận trước đó' });
      }
      return res.json({ message: 'Giao dịch đánh dấu failed/ignored (đã ghi provider info)' });
    });
  }
});

// -------- US-009: Payment status (by resident) --------
app.get('/payment-status', (req, res) => {
  const { resident_id } = req.query;
  if (!resident_id) return res.status(400).json({ error: 'Thiếu resident_id' });

  const sql = `SELECT * FROM payments WHERE resident_id = ? ORDER BY created_at DESC`;
  db.query(sql, [resident_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    // map state (0/1) to readable
    const mapped = results.map(r => ({
      ...r,
      is_paid: r.state === 1,
      status_text: r.state === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'
    }));
    res.json(mapped);
  });
});

// -------- Notifications (basic) --------

// GET all notifications (with optional join to owner's name if exists)
app.get('/notifications', (req, res) => {
  const sql = `
    SELECT n.*, r.full_name AS owner_name
    FROM notifications n
    LEFT JOIN residents r
      ON n.apartment_id = r.apartment_id
      AND r.residency_status = 'chủ hộ'
    ORDER BY n.notification_date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST create notification
app.post('/notifications', (req, res) => {
  const { apartment_id, content } = req.body || {};
  if (!apartment_id || !content) {
    return res.status(400).json({ error: 'Thiếu apartment_id hoặc content' });
  }
  const sql = `INSERT INTO notifications (apartment_id, content) VALUES (?, ?)`;
  db.query(sql, [apartment_id, content], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Thông báo được tạo', id: result.insertId });
  });
});

// PATCH mark notification as sent
app.patch('/notifications/:id/send', (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE notifications SET sent_date = NOW() WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Notification marked as sent' });
  });
});

// DELETE notification
app.delete('/notifications/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM notifications WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  });
});

// DELETE resident (soft delete) - chỉ đặt state = 'inactive'
app.delete('/residents/:id', (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Thiếu id' });

  // 1) Kiểm tra resident có tồn tại không
  db.query('SELECT id, state FROM residents WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy cư dân' });
    }

    // Nếu đã inactive rồi thì trả về thông báo tương ứng
    const currentState = rows[0].state;
    if (currentState && String(currentState).toLowerCase() === 'inactive') {
      return res.json({ message: 'Resident đã ở trạng thái inactive (đã xóa mềm trước đó)' });
    }

    // 2) Thực hiện soft delete: set state = 'inactive'
    const sql = `UPDATE residents SET state = 'inactive' WHERE id = ?`;
    db.query(sql, [id], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy cư dân' });
      return res.json({ message: 'Resident soft-deleted (state set to inactive)' });
    });
  });
});
// -------- Payments listing & transaction endpoints --------

// GET all payments (with resident name)
app.get('/payments', (req, res) => {
  const sql = `
    SELECT p.*, r.full_name AS resident_name
    FROM payments p
    LEFT JOIN residents r ON p.resident_id = r.id
    ORDER BY p.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    // convert state 0/1 into readable
    const mapped = results.map(p => ({
      ...p,
      is_paid: p.state === 1,
      status_text: p.state === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'
    }));
    res.json(mapped);
  });
});

// GET payments by resident_id (same as /payment-status but paginated/limited optionally)
app.get('/payments/by-resident/:resident_id', (req, res) => {
  const { resident_id } = req.params;
  const sql = `
    SELECT p.*, r.full_name AS resident_name
    FROM payments p
    LEFT JOIN residents r ON p.resident_id = r.id
    WHERE p.resident_id = ?
    ORDER BY p.created_at DESC
  `;
  db.query(sql, [resident_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const mapped = results.map(p => ({
      ...p,
      is_paid: p.state === 1,
      status_text: p.state === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'
    }));
    res.json(mapped);
  });
});

// GET one payment by id
app.get('/payments/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT p.*, r.full_name AS resident_name
    FROM payments p
    LEFT JOIN residents r ON p.resident_id = r.id
    WHERE p.id = ?
    LIMIT 1
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ error: 'Payment not found' });
    const p = results[0];
    p.is_paid = p.state === 1;
    p.status_text = p.state === 1 ? 'Đã thanh toán' : 'Chưa thanh toán';
    res.json(p);
  });
});




// -------- Helper / health --------
app.get('/health', (req, res) => res.json({ ok: true }));

// Start server
app.listen(port, () => {
  console.log(`🚀 Server chạy tại http://localhost:${port}`);
});

// THÊM API LOGIN MỚI NGAY TẠI ĐÂY ==
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Thiếu username hoặc password' });
  }

  // --- CẢNH BÁO QUAN TRỌNG ---
  // Bảng `residents` của bạn không thấy có trường `username` hay `password`.
  // Bạn cần thêm các trường này vào database.
  // Giả sử bạn dùng `email` làm username và có một trường tên `password`.
  // *** TRONG THỰC TẾ, KHÔNG BAO GIỜ LƯU PASSWORD TRỰC TIẾP, PHẢI HASH NÓ ***

  const sql = `SELECT * FROM residents WHERE email = ? AND password = ? LIMIT 1`;
  
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      // Đăng nhập thất bại
      return res.status(401).json({ error: 'Username hoặc password không đúng' });
    }

    // Đăng nhập thành công
    // Gửi về thông tin user (trừ password)
    const user = results[0];
    delete user.password; // Xóa password trước khi gửi về client
    
    // (Trong dự án thực tế, bạn sẽ tạo và gửi về một JWT Token ở đây)
    res.json({ message: 'Đăng nhập thành công', user: user });
  });
});