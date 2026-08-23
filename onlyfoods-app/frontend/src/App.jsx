import React, { useState, useEffect } from 'react';

// ==========================================
// MOCK DATABASE & INITIAL STATES
// ==========================================
const INITIAL_STORES = [
  { id: 1, name: 'ร้านกะเพราถาด KMITL', category: 'อาหารตามสั่ง', status: 'Open', rating: 5.0, totalSales: 15400, ownerUsername: 'owner01', isSuspended: false },
  { id: 2, name: 'ร้านก๋วยเตี๋ยวเรือรสเด็ด', category: 'ก๋วยเตี๋ยว', status: 'Open', rating: 5.0, totalSales: 12100, ownerUsername: 'owner02', isSuspended: false },
  { id: 3, name: 'ร้านชาดี ชาไทย', category: 'เครื่องดื่ม', status: 'Open', rating: 5.0, totalSales: 8900, ownerUsername: 'owner03', isSuspended: false }
];

const INITIAL_PRODUCTS = [
  { id: 101, storeId: 1, name: 'ข้าวผัดกะเพราหมูกรอบ', price: 50, isOutOfStock: false, img: '🍲' },
  { id: 102, storeId: 1, name: 'ข้าวผัดพริกแกงไก่ + ไข่ดาว', price: 55, isOutOfStock: false, img: '🍳' },
  { id: 201, storeId: 2, name: 'ก๋วยเตี๋ยวเรือน้ำตกเนื้อเปื่อย', price: 50, isOutOfStock: false, img: '🍜' },
  { id: 301, storeId: 3, name: 'ชาไทยเย็นเข้มข้น', price: 30, isOutOfStock: false, img: '🧋' }
];

const INITIAL_USERS = [
  { id: 1, username: 'uefa01', password: '123', role: 'Customer', name: 'คุณยูฟ่า (ลูกค้า)' },
  { id: 2, username: 'kitchen01', password: '123', role: 'Kitchen', name: 'เชฟสมศักดิ์ (ครัว)', storeId: 1 },
  { id: 3, username: 'front01', password: '123', role: 'Front', name: 'ผู้จัดการฟร้อนท์ 01', storeId: 1 },
  { id: 4, username: 'owner01', password: '123', role: 'Owner', name: 'เจ้าของร้านกะเพราถาด', storeId: 1 },
  { id: 5, username: 'acc01', password: '123', role: 'Accountant', name: 'เจ้าหน้าที่บัญชี' },
  { id: 6, username: 'exec01', password: '123', role: 'Executive', name: 'ผู้บริหารศูนย์อาหาร' }
];

export default function App() {
  // Global States
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [stores, setStores] = useState(INITIAL_STORES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [cancellationLogs, setCancellationLogs] = useState([]);
  const [foodCourtOpen, setFoodCourtOpen] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const [pushNotifications, setPushNotifications] = useState([]);

  // Auth Form State
  const [authTab, setAuthTab] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '', role: 'Customer', name: '' });
  const [authError, setAuthError] = useState('');

  // Handle Login & Register
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (authTab === 'login') {
      const user = users.find(u => u.username === authForm.username && u.password === authForm.password);
      if (user) {
        setCurrentUser(user);
        setAuthForm({ username: '', password: '', role: 'Customer', name: '' });
      } else {
        setAuthError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } else {
      if (users.some(u => u.username === authForm.username)) {
        setAuthError('ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว');
        return;
      }
      const newUser = { id: users.length + 1, ...authForm };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      alert('ลงทะเบียนสำเร็จ!');
    }
  };

  const addNotification = (userId, message) => {
    setPushNotifications(prev => [{ id: Date.now(), userId, message, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '15px', background: '#f4f6f9', minHeight: '100vh' }}>
      {/* Central Announcement Banner */}
      {announcement && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontWeight: 'bold' }}>
          📢 ประกาศจากศูนย์อาหาร: {announcement}
        </div>
      )}

      {/* Main Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#007bff' }}>🍽️ Only Foods KMITL System</h2>
          <small style={{ color: foodCourtOpen ? 'green' : 'red', fontWeight: 'bold' }}>
            สถานะศูนย์อาหาร: {foodCourtOpen ? '🟢 เปิดให้บริการ' : '🔴 ปิดให้บริการชั่วคราว'}
          </small>
        </div>
        {currentUser && (
          <div style={{ textAlign: 'right' }}>
            <span style={{ marginRight: '10px' }}>👤 {currentUser.name} (<strong>{currentUser.role}</strong>)</span>
            <button onClick={() => setCurrentUser(null)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>ออกจากระบบ</button>
          </div>
        )}
      </header>

      {/* Auth Screen */}
      {!currentUser ? (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', maxWidth: '420px', margin: '40px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '2px solid #eee' }}>
            <button onClick={() => { setAuthTab('login'); setAuthError(''); }} style={{ flex: 1, padding: '10px', background: 'none', border: 'none', fontWeight: authTab === 'login' ? 'bold' : 'normal', borderBottom: authTab === 'login' ? '3px solid #007bff' : 'none', cursor: 'pointer' }}>เข้าสู่ระบบ</button>
            <button onClick={() => { setAuthTab('register'); setAuthError(''); }} style={{ flex: 1, padding: '10px', background: 'none', border: 'none', fontWeight: authTab === 'register' ? 'bold' : 'normal', borderBottom: authTab === 'register' ? '3px solid #007bff' : 'none', cursor: 'pointer' }}>ลงทะเบียนลูกค้าใหม่</button>
          </div>

          {authError && <div style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>{authError}</div>}

          <form onSubmit={handleAuthSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>Username</label>
              <input type="text" required value={authForm.username} onChange={e => setAuthForm({ ...authForm, username: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>Password</label>
              <input type="password" required value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            {authTab === 'register' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>ชื่อ-นามสกุล</label>
                <input type="text" required value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
            )}

            <button type="submit" style={{ width: '100%', background: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              {authTab === 'login' ? '🔑 เข้าสู่ระบบ' : '📝 ยืนยันการลงทะเบียน'}
            </button>
          </form>

          <div style={{ marginTop: '20px', padding: '10px', background: '#e9ecef', borderRadius: '4px', fontSize: '11px', color: '#333' }}>
            <strong>💡 บัญชีสำหรับทดสอบบทบาทต่างๆ (Password: 123)</strong>
            <ul style={{ paddingLeft: '15px', margin: '5px 0 0 0' }}>
              <li>ลูกค้า: <code>uefa01</code></li>
              <li>ครัว: <code>kitchen01</code> | ฟร้อนท์: <code>front01</code></li>
              <li>เจ้าของร้าน: <code>owner01</code></li>
              <li>บัญชี: <code>acc01</code> | ผู้บริหาร: <code>exec01</code></li>
            </ul>
          </div>
        </div>
      ) : (
        /* Render Views according to Role */
        <div>
          {currentUser.role === 'Customer' && (
            <CustomerView currentUser={currentUser} stores={stores} products={products} orders={orders} setOrders={setOrders} foodCourtOpen={foodCourtOpen} pushNotifications={pushNotifications.filter(n => n.userId === currentUser.id)} />
          )}
          {currentUser.role === 'Kitchen' && (
            <KitchenView currentUser={currentUser} orders={orders} setOrders={setOrders} products={products} setProducts={setProducts} />
          )}
          {currentUser.role === 'Front' && (
            <FrontStaffView currentUser={currentUser} orders={orders} setOrders={setOrders} products={products} setProducts={setProducts} setCancellationLogs={setCancellationLogs} addNotification={addNotification} />
          )}
          {currentUser.role === 'Owner' && (
            <ShopOwnerView currentUser={currentUser} stores={stores} setStores={setStores} products={products} setProducts={setProducts} orders={orders} />
          )}
          {currentUser.role === 'Accountant' && (
            <AccountantView orders={orders} stores={stores} cancellationLogs={cancellationLogs} />
          )}
          {currentUser.role === 'Executive' && (
            <ExecutiveView
              stores={stores}
              setStores={setStores}
              users={users}
              setUsers={setUsers}
              foodCourtOpen={foodCourtOpen}
              setFoodCourtOpen={setFoodCourtOpen}
              setAnnouncement={setAnnouncement}
              orders={orders}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 1. CUSTOMER VIEW
// ==========================================
function CustomerView({ currentUser, stores, products, orders, setOrders, foodCourtOpen, pushNotifications }) {
  const [tab, setTab] = useState('stores');
  const [selectedStore, setSelectedStore] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState({});

  const userOrders = orders.filter(o => o.customerId === currentUser.id);

  const addToCart = (product) => {
    if (!foodCourtOpen) return alert('ศูนย์อาหารปิดให้บริการชั่วคราว');
    if (selectedStore.isSuspended) return alert('ร้านค้านี้โดนระงับสิทธิ์บริการ');
    if (selectedStore.status === 'Closed') return alert('ร้านค้านี้ปิดให้บริการ');
    if (product.isOutOfStock) return alert('เมนูนี้ของหมด');

    const note = selectedNotes[product.id] || '';
    setCart([...cart, { ...product, storeName: selectedStore.name, note }]);
    setSelectedNotes({ ...selectedNotes, [product.id]: '' });
    alert(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว!`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: Date.now(),
      queueNo: orders.length + 101,
      customerId: currentUser.id,
      customerName: currentUser.name,
      storeId: cart[0].storeId,
      storeName: cart[0].storeName,
      items: cart,
      totalPrice: cart.reduce((s, i) => s + i.price, 0),
      status: 'Pending',
      createdAt: new Date(),
      outOfStockAlert: false,
      estimatedMinutes: 15,
      review: null
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setTab('queue');
    alert('💳 ยืนยันชำระเงินออนไลน์สำเร็จ! ได้รับหมายเลขคิวแล้ว');
  };

  const handleCancelOutOfStock = (orderId) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled', cancelReason: 'วัตถุดิบหมด (ลูกค้ายกเลิก)' } : o));
    alert('ยกเลิกออเดอร์เรียบร้อย');
  };

  const handleAddReview = (orderId, rating, comment) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, review: { rating, comment } } : o));
    alert('ขอบคุณสำหรับรีวิวครับ!');
  };

  return (
    <div>
      {pushNotifications.length > 0 && (
        <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', color: '#155724', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
          🔔 <strong>การแจ้งเตือนเตือนด่วน:</strong>
          {pushNotifications.map(n => (
            <div key={n.id}>- {n.message} ({n.time})</div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <button onClick={() => setTab('stores')} style={{ flex: 1, padding: '10px', background: tab === 'stores' ? '#007bff' : '#fff', color: tab === 'stores' ? '#fff' : '#000', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>🏪 หน้าร้านค้า</button>
        <button onClick={() => setTab('cart')} style={{ flex: 1, padding: '10px', background: tab === 'cart' ? '#007bff' : '#fff', color: tab === 'cart' ? '#fff' : '#000', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>🛒 ตะกร้า ({cart.length})</button>
        <button onClick={() => setTab('queue')} style={{ flex: 1, padding: '10px', background: tab === 'queue' ? '#007bff' : '#fff', color: tab === 'queue' ? '#fff' : '#000', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>🔢 ติดตามคิวคำสั่งซื้อ</button>
        <button onClick={() => setTab('history')} style={{ flex: 1, padding: '10px', background: tab === 'history' ? '#007bff' : '#fff', color: tab === 'history' ? '#fff' : '#000', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>📜 ประวัติ & รีวิว</button>
      </div>

      {tab === 'stores' && (
        <div>
          {!selectedStore ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              {stores.map(s => (
                <div key={s.id} style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{s.name} {s.isSuspended && <span style={{ color: 'red' }}>(ถูกระงับ)</span>}</h3>
                    <span style={{ fontSize: '13px', color: '#666' }}>หมวดหมู่: {s.category} | Rating: ⭐ {s.rating}</span>
                    <div><small style={{ color: s.status === 'Open' ? 'green' : 'red' }}>สถานะร้าน: {s.status === 'Open' ? 'เปิด' : 'ปิด'}</small></div>
                  </div>
                  <button disabled={s.status === 'Closed' || s.isSuspended} onClick={() => setSelectedStore(s)} style={{ background: s.status === 'Open' && !s.isSuspended ? '#28a745' : '#ccc', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                    ดูเมนูอาหาร ➡️
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <button onClick={() => setSelectedStore(null)} style={{ marginBottom: '15px', background: '#6c757d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>⬅️ เลือกร้านอื่น</button>
              <h3>ร้าน: {selectedStore.name}</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {products.filter(p => p.storeId === selectedStore.id).map(p => (
                  <div key={p.id} style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{p.img} {p.name} {p.isOutOfStock && <span style={{ color: 'red' }}>(วัตถุดิบหมด)</span>}</span>
                      <span style={{ color: '#28a745', fontWeight: 'bold' }}>{p.price} บาท</span>
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="รายละเอียดพิเศษ (เช่น เผ็ดน้อย, ไม่ใส่ผัก)..."
                        value={selectedNotes[p.id] || ''}
                        onChange={e => setSelectedNotes({ ...selectedNotes, [p.id]: e.target.value })}
                        disabled={p.isOutOfStock}
                        style={{ flex: 1, padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                      <button disabled={p.isOutOfStock} onClick={() => addToCart(p)} style={{ background: p.isOutOfStock ? '#ccc' : '#007bff', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                        + เลือกใส่ตะกร้า
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'cart' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3>🛒 รายการอาหารล่วงหน้าในตะกร้า</h3>
          {cart.length === 0 ? <p>ไม่มีรายการอาหารในตะกร้า</p> : (
            <div>
              {cart.map((item, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{item.name}</strong> ({item.storeName})
                    {item.note && <div style={{ fontSize: '12px', color: '#666' }}>รายละเอียด: {item.note}</div>}
                  </div>
                  <div>{item.price} บาท</div>
                </div>
              ))}
              <hr />
              <div style={{ background: '#e9ecef', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                💳 <strong>ชำระเงิน:</strong> ระบบรองรับเฉพาะการชำระเงินออนไลน์เท่านั้น (PromptPay / Mobile Banking)
              </div>
              <h3 style={{ textAlign: 'right', color: '#28a745' }}>ยอดรวมสุทธิ: {cart.reduce((s, i) => s + i.price, 0)} บาท</h3>
              <button onClick={handleCheckout} style={{ width: '100%', background: '#28a745', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                📲 ชำระเงินออนไลน์ & ยืนยันออเดอร์
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'queue' && (
        <div>
          <h3>🔢 ติดตามคิวคำสั่งซื้อปัจจุบัน</h3>
          {userOrders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length === 0 ? <p>ไม่มีคิวอาหารที่กำลังรอดำเนินการ</p> : (
            userOrders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').map(o => (
              <div key={o.id} style={{ background: '#fff', borderLeft: '6px solid #007bff', padding: '15px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #ccc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>หมายเลขคิว: #{o.queueNo} (ออเดอร์ #{o.id})</h4>
                  <span style={{ background: '#e2e3e5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>เวลารอประมาณ: ~{o.estimatedMinutes} นาที</span>
                </div>
                <div>ร้านค้า: <strong>{o.storeName}</strong></div>
                <div>สถานะปัจจุบัน: <strong style={{ color: o.status === 'Ready' ? '#28a745' : '#ff9800' }}>{getStatusLabel(o.status)}</strong></div>

                {o.outOfStockAlert && (
                  <div style={{ background: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
                    ⚠️ <strong>แจ้งเตือน:</strong> มีรายการอาหารในออเดอร์นี้ของหมด! กรุณาเปลี่ยนเมนูหรือยกเลิกภายใน 30 นาที
                    <div style={{ marginTop: '8px' }}>
                      <button onClick={() => handleCancelOutOfStock(o.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>กดยกเลิกออเดอร์</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'history' && (
        <div>
          <h3>📜 ประวัติการสั่งซื้อย้อนหลัง</h3>
          {userOrders.map(o => (
            <div key={o.id} style={{ background: '#fff', padding: '15px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #ddd' }}>
              <div style={{ fontWeight: 'bold' }}>ออเดอร์ #{o.id} - คิว #{o.queueNo} ({o.storeName})</div>
              <div>ราคารวม: {o.totalPrice} บาท | สถานะ: {getStatusLabel(o.status)}</div>

              {o.status === 'Completed' && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ccc' }}>
                  {!o.review ? (
                    <ReviewForm onSubmit={(rating, comment) => handleAddReview(o.id, rating, comment)} />
                  ) : (
                    <div style={{ color: '#856404', background: '#fff3cd', padding: '8px', borderRadius: '4px' }}>
                      ⭐ คะแนนรีวิวของคุณ: {o.review.rating}/5 ดาว | "{o.review.comment}"
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  return (
    <div>
      <small style={{ fontWeight: 'bold' }}>✍️ เขียนรีวิวและให้คะแนนอาหาร:</small>
      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
        <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ padding: '4px' }}>
          <option value={5}>5 ดาว ⭐⭐⭐⭐⭐</option>
          <option value={4}>4 ดาว ⭐⭐⭐⭐</option>
          <option value={3}>3 ดาว ⭐⭐⭐</option>
          <option value={2}>2 ดาว ⭐⭐</option>
          <option value={1}>1 ดาว ⭐</option>
        </select>
        <input type="text" placeholder="ความคิดเห็นเกี่ยวกับรสชาติ..." value={comment} onChange={e => setComment(e.target.value)} style={{ flex: 1, padding: '4px' }} />
        <button onClick={() => onSubmit(rating, comment)} style={{ background: '#007bff', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>ส่งรีวิว</button>
      </div>
    </div>
  );
}

// ==========================================
// 2. KITCHEN STAFF VIEW
// ==========================================
function KitchenView({ currentUser, orders, setOrders, products, setProducts }) {
  const kitchenOrders = orders.filter(o => o.storeId === (currentUser.storeId || 1) && o.status !== 'Completed' && o.status !== 'Cancelled');

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const reportOutOfStock = (productId) => {
    setProducts(products.map(p => p.id === productId ? { ...p, isOutOfStock: true } : p));
    alert('แจ้งวัตถุดิบหมดไปยังพนักงานหน้าร้านเรียบร้อยแล้ว!');
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h3>👨‍🍳 จอแสดงรายการออเดอร์ในครัว (เรียงตามคิว)</h3>
      <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>
        <strong>📦 ตรวจสอบวัตถุดิบเมนูในร้าน:</strong>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
          {products.filter(p => p.storeId === (currentUser.storeId || 1)).map(p => (
            <button key={p.id} onClick={() => reportOutOfStock(p.id)} style={{ background: p.isOutOfStock ? '#dc3545' : '#ffc107', color: p.isOutOfStock ? '#fff' : '#000', border: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
              {p.name} {p.isOutOfStock ? '(แจ้งหมดแล้ว)' : '⚠️ กดแจ้งของหมด'}
            </button>
          ))}
        </div>
      </div>

      {kitchenOrders.length === 0 ? <p>ไม่มีรายการออเดอร์ที่ต้องปรุงขณะนี้</p> : (
        kitchenOrders.map(o => (
          <div key={o.id} style={{ border: '2px solid #ff9800', background: '#fff9e6', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>คิว #{o.queueNo} (ออเดอร์ #{o.id})</h4>
              <span>สถานะ: <strong>{getStatusLabel(o.status)}</strong></span>
            </div>
            <div><strong>รายการอาหาร & หมายเหตุพิเศษ:</strong></div>
            <ul style={{ margin: '5px 0' }}>
              {o.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} {item.note && <span style={{ color: 'red', fontWeight: 'bold' }}>(หมายเหตุ: {item.note})</span>}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => updateOrderStatus(o.id, 'Cooking')} style={{ background: '#17a2b8', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer' }}>🍳 เริ่มทำอาหาร</button>
              <button onClick={() => updateOrderStatus(o.id, 'Ready')} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer' }}>✅ ปรุงเสร็จแล้ว</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ==========================================
// 3. FRONT STAFF MANAGER VIEW
// ==========================================
function FrontStaffView({ currentUser, orders, setOrders, products, setProducts, setCancellationLogs, addNotification }) {
  const storeOrders = orders.filter(o => o.storeId === (currentUser.storeId || 1));

  const handleCallQueue = (order) => {
    addNotification(order.customerId, `🔔 คิว #${order.queueNo} (${order.storeName}) อาหารปรุงเสร็จแล้ว พร้อมรับที่หน้าร้าน!`);
    alert(`ส่ง Push Notification เรียกคิว #${order.queueNo} เรียบร้อยแล้ว`);
  };

  const handleDeliver = (orderId) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Completed' } : o));
    alert('ส่งมอบอาหารเรียบร้อย ย้ายข้อมูลไปประวัติการขาย');
  };

  const handleUnclaimed = (order) => {
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'Cancelled', cancelReason: 'ลูกค้าไม่มารับอาหารเกิน 60 นาที' } : o));
    setCancellationLogs(prev => [...prev, { id: Date.now(), orderId: order.id, storeName: order.storeName, reason: 'ลูกค้าไม่มารับอาหารเกิน 60 นาที', amount: order.totalPrice, time: new Date().toLocaleString() }]);
    alert('บันทึกสถานะ "ลูกค้าไม่มารับอาหาร" เรียบร้อยแล้ว');
  };

  const handleNotifyOutOfStockOrder = (order) => {
    setOrders(orders.map(o => o.id === order.id ? { ...o, outOfStockAlert: true } : o));
    addNotification(order.customerId, `⚠️ ออเดอร์ #${order.queueNo} วัตถุดิบหมด กรุณายกเลิกหรือเปลี่ยนเมนูภายใน 30 นาที`);
    alert('ส่งการแจ้งเตือนเปลี่ยน/ยกเลิกเมนูให้ลูกค้าแล้ว');
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h3>💁 จอผู้จัดการฝ่ายบริการหน้าร้าน</h3>
      <h4>📢 คิวอาหารรอส่งมอบ & เรียกคิว</h4>
      {storeOrders.filter(o => o.status === 'Ready').length === 0 ? <p style={{ fontSize: '13px', color: '#666' }}>ไม่มีรายการคิวที่ปรุงเสร็จแล้วขณะนี้</p> : (
        storeOrders.filter(o => o.status === 'Ready').map(o => (
          <div key={o.id} style={{ border: '2px solid #28a745', background: '#eafaf1', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
            <h4>🔔 คิว #{o.queueNo} - {o.customerName}</h4>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => handleCallQueue(o)} style={{ background: '#ff9800', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>📢 เรียกคิว</button>
              <button onClick={() => handleDeliver(o.id)} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>✅ ส่งมอบแล้ว</button>
              <button onClick={() => handleUnclaimed(o)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer' }}>⚠️ ลูกค้าไม่มารับ (&gt;60 นาที)</button>
            </div>
          </div>
        ))
      )}
      <hr />
      <h4>⚠️ จัดการกรณีวัตถุดิบหมด และแจ้งเตือนลูกค้า</h4>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {storeOrders.filter(o => o.status === 'Pending').map(o => (
          <div key={o.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px', background: '#f8f9fa' }}>
            <span>คิว #{o.queueNo} ({o.customerName})</span>
            <button onClick={() => handleNotifyOutOfStockOrder(o)} style={{ marginLeft: '10px', background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
              แจ้งของหมด
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. SHOP OWNER VIEW
// ==========================================
function ShopOwnerView({ currentUser, stores, setStores, products, setProducts, orders }) {
  const myStore = stores.find(s => s.id === (currentUser.storeId || 1)) || stores[0];
  const myProducts = products.filter(p => p.storeId === myStore.id);
  const myOrders = orders.filter(o => o.storeId === myStore.id && o.status === 'Completed');

  const [newMenu, setNewMenu] = useState({ name: '', price: '', img: '🍲' });

  const toggleStoreStatus = () => {
    setStores(stores.map(s => s.id === myStore.id ? { ...s, status: s.status === 'Open' ? 'Closed' : 'Open' } : s));
  };

  const handleAddMenu = (e) => {
    e.preventDefault();
    if (!newMenu.name || !newMenu.price) return;
    const p = { id: Date.now(), storeId: myStore.id, name: newMenu.name, price: Number(newMenu.price), isOutOfStock: false, img: newMenu.img };
    setProducts([...products, p]);
    setNewMenu({ name: '', price: '', img: '🍲' });
    alert('เพิ่มเมนูอาหารเรียบร้อยแล้ว!');
  };

  const handleDeleteMenu = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const totalSales = myOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>🏪 แผงควบคุมเจ้าของร้าน: {myStore.name}</h3>
        <button onClick={toggleStoreStatus} style={{ background: myStore.status === 'Open' ? '#dc3545' : '#28a745', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {myStore.status === 'Open' ? '🔴 กดปิดรับออเดอร์ร้าน' : '🟢 กดเปิดรับออเดอร์ร้าน'}
        </button>
      </div>

      <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
        📊 <strong>ยอดขายรวมวันนี้: {totalSales} บาท</strong> (จากออเดอร์เสร็จสิ้น {myOrders.length} รายการ)
      </div>

      <h4>➕ เพิ่ม/แก้ไขเมนูอาหาร</h4>
      <form onSubmit={handleAddMenu} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="ชื่อเมนู" value={newMenu.name} onChange={e => setNewMenu({ ...newMenu, name: e.target.value })} style={{ flex: 2, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        <input type="number" placeholder="ราคา (บาท)" value={newMenu.price} onChange={e => setNewMenu({ ...newMenu, price: e.target.value })} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        <button type="submit" style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>บันทึกเมนู</button>
      </form>

      <h4>📋 รายการเมนูทั้งหมดของร้าน</h4>
      <div style={{ display: 'grid', gap: '10px' }}>
        {myProducts.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
            <span>{p.img} <strong>{p.name}</strong> - {p.price} บาท {p.isOutOfStock && <span style={{ color: 'red' }}>(ของหมด)</span>}</span>
            <button onClick={() => handleDeleteMenu(p.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>ลบเมนู</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. ACCOUNTANT VIEW
// ==========================================
function AccountantView({ orders, stores, cancellationLogs }) {
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  const handleExportReport = () => {
    alert('📥 ส่งออกรายงานทางการเงิน เรียบร้อยแล้ว!');
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>📊 ระบบตรวจสอบบัญชีและการเงิน (สถาบัน KMITL)</h3>
        <button onClick={handleExportReport} style={{ background: '#17a2b8', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          📥 ส่งออกรายงานทางการเงิน
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div style={{ background: '#f8f9fa', padding: '15px', border: '1px solid #ccc', borderRadius: '6px', textAlign: 'center' }}>
          <small style={{ color: '#666' }}>รายได้รวมศูนย์อาหาร</small>
          <h2 style={{ color: '#28a745', margin: '5px 0' }}>฿{totalRevenue}</h2>
        </div>
        <div style={{ background: '#f8f9fa', padding: '15px', border: '1px solid #ccc', borderRadius: '6px', textAlign: 'center' }}>
          <small style={{ color: '#666' }}>ออเดอร์ที่สำเร็จ</small>
          <h2 style={{ color: '#007bff', margin: '5px 0' }}>{completedOrders.length} รายการ</h2>
        </div>
        <div style={{ background: '#f8f9fa', padding: '15px', border: '1px solid #ccc', borderRadius: '6px', textAlign: 'center' }}>
          <small style={{ color: '#666' }}>การยกเลิกออเดอร์รวม</small>
          <h2 style={{ color: '#dc3545', margin: '5px 0' }}>{cancellationLogs.length} รายการ</h2>
        </div>
      </div>

      <h4>🏢 สรุปยอดขายรายร้านค้าประจำเดือน (คำนวณค่าเช่า)</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ background: '#f1f1f1', textAlign: 'left' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ร้านค้า</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ยอดขายรวม (บาท)</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ค่าเช่าประมาณการ (10%)</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(s => {
            const storeSales = completedOrders.filter(o => o.storeId === s.id).reduce((sum, o) => sum + o.totalPrice, 0);
            return (
              <tr key={s.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>฿{storeSales}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', color: '#28a745' }}>฿{(storeSales * 0.1).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h4>🔒 ประวัติการยกเลิกออเดอร์ (Audit Trail)</h4>
      {cancellationLogs.length === 0 ? <p style={{ fontSize: '13px', color: '#666' }}>ไม่มีประวัติการยกเลิกออเดอร์</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fff0f0', textAlign: 'left' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>เวลา</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>ร้านค้า</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>เหตุผลการยกเลิก</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>มูลค่า</th>
            </tr>
          </thead>
          <tbody>
            {cancellationLogs.map(log => (
              <tr key={log.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{log.time}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{log.storeName}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', color: 'red' }}>{log.reason}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>฿{log.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ==========================================
// 6. EXECUTIVE VIEW (ปรับแก้ไขเพิ่มฟังก์ชันสร้างร้านและบัญชีพนักงาน)
// ==========================================
function ExecutiveView({ stores, setStores, users, setUsers, foodCourtOpen, setFoodCourtOpen, setAnnouncement, orders }) {
  const [broadcastText, setBroadcastText] = useState('');

  // States สำหรับฟอร์มเพิ่มร้านค้าใหม่
  const [newStore, setNewStore] = useState({ name: '', category: 'อาหารตามสั่ง' });

  // States สำหรับฟอร์มออกบัญชีพนักงาน
  const [newStaff, setNewStaff] = useState({ username: '', password: '', name: '', role: 'Kitchen', storeId: stores[0]?.id || 1 });

  const toggleCentralFoodCourt = () => {
    setFoodCourtOpen(!foodCourtOpen);
    alert(`สั่งการเปลี่ยนสถานะศูนย์อาหารส่วนกลางเป็น: ${!foodCourtOpen ? 'เปิด' : 'ปิด'}`);
  };

  const handleSendAnnouncement = (e) => {
    e.preventDefault();
    setAnnouncement(broadcastText);
    alert('ส่งประกาศแจ้งเตือนไปยังผู้ใช้บริการทุกคนเรียบร้อย!');
    setBroadcastText('');
  };

  const toggleSuspendStore = (storeId) => {
    setStores(stores.map(s => s.id === storeId ? { ...s, isSuspended: !s.isSuspended } : s));
  };

  // ฟังก์ชันสร้างร้านค้าใหม่
  const handleAddStore = (e) => {
    e.preventDefault();
    if (!newStore.name) return alert('กรุณาระบุชื่อร้านค้า');
    
    const createdStore = {
      id: stores.length > 0 ? Math.max(...stores.map(s => s.id)) + 1 : 1,
      name: newStore.name,
      category: newStore.category,
      status: 'Open',
      rating: 5.0,
      totalSales: 0,
      ownerUsername: '',
      isSuspended: false
    };

    setStores([...stores, createdStore]);
    setNewStore({ name: '', category: 'อาหารตามสั่ง' });
    
    // ตั้งค่า default storeId ให้ฟอร์มสร้างพนักงานเป็นร้านใหม่ทันที
    setNewStaff(prev => ({ ...prev, storeId: createdStore.id }));
    alert(`🏪 สร้างร้าน "${createdStore.name}" สำเร็จ!`);
  };

  // ฟังก์ชันสร้างบัญชีพนักงานประจำร้าน
  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.username || !newStaff.password || !newStaff.name) {
      return alert('กรุณากรอกข้อมูลพนักงานให้ครบถ้วน');
    }
    if (users.some(u => u.username === newStaff.username)) {
      return alert('Username นี้มีผู้ใช้งานอยู่ในระบบแล้ว');
    }

    const createdUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username: newStaff.username,
      password: newStaff.password,
      role: newStaff.role,
      name: newStaff.name,
      storeId: Number(newStaff.storeId)
    };

    setUsers([...users, createdUser]);
    setNewStaff({ username: '', password: '', name: '', role: 'Kitchen', storeId: stores[0]?.id || 1 });
    alert(`👤 เพิ่มบัญชี ${createdUser.role} สำหรับผู้ใช้ "${createdUser.name}" เรียบร้อยแล้ว!`);
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h3>👔 แดชบอร์ดผู้บริหารศูนย์อาหาร (Executive View)</h3>

      {/* Central System Toggle & Announcements */}
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
        <h4>⚙️ ตั้งค่าระบบส่วนกลาง</h4>
        <button onClick={toggleCentralFoodCourt} style={{ background: foodCourtOpen ? '#dc3545' : '#28a745', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {foodCourtOpen ? '🛑 สั่งปิดศูนย์อาหารส่วนกลาง' : '🟢 สั่งเปิดศูนย์อาหารส่วนกลาง'}
        </button>

        <form onSubmit={handleSendAnnouncement} style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="ระบุข้อความประกาศแจ้งเตือนส่วนกลาง..." value={broadcastText} onChange={e => setBroadcastText(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>📢 ส่งประกาศ</button>
        </form>
      </div>

      {/* ส่วนที่เพิ่มใหม่ 1: ฟอร์มสร้างร้านค้าใหม่ */}
      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #e9ecef' }}>
        <h4>🏪 เพิ่มร้านค้าใหม่ในศูนย์อาหาร</h4>
        <form onSubmit={handleAddStore} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
          <input type="text" placeholder="ชื่อร้านค้า" required value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          <select value={newStore.category} onChange={e => setNewStore({ ...newStore, category: e.target.value })} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option value="อาหารตามสั่ง">อาหารตามสั่ง</option>
            <option value="ก๋วยเตี๋ยว">ก๋วยเตี๋ยว</option>
            <option value="เครื่องดื่ม">เครื่องดื่ม</option>
            <option value="ของหวาน">ของหวาน</option>
            <option value="อาหารทานเล่น">อาหารทานเล่น</option>
          </select>
          <button type="submit" style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            ➕ สร้างร้านค้า
          </button>
        </form>
      </div>

      {/* ส่วนที่เพิ่มใหม่ 2: ฟอร์มออกบัญชีพนักงานประจำร้าน */}
      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #e9ecef' }}>
        <h4>👤 ออกบัญชีพนักงาน / เจ้าของร้านใหม่</h4>
        <form onSubmit={handleAddStaff} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
          <input type="text" placeholder="ชื่อ-นามสกุล" required value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          <input type="text" placeholder="Username" required value={newStaff.username} onChange={e => setNewStaff({ ...newStaff, username: e.target.value })} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          <input type="password" placeholder="Password" required value={newStaff.password} onChange={e => setNewStaff({ ...newStaff, password: e.target.value })} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          
          <select value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option value="Kitchen">พนักงานครัว (Kitchen)</option>
            <option value="Front">พนักงานฟร้อนท์ (Front)</option>
            <option value="Owner">เจ้าของร้าน (Owner)</option>
          </select>

          <select value={newStaff.storeId} onChange={e => setNewStaff({ ...newStaff, storeId: e.target.value })} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
            {stores.map(s => (
              <option key={s.id} value={s.id}>ผูกกับ: {s.name}</option>
            ))}
          </select>

          <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            🔑 สร้างบัญชี
          </button>
        </form>
      </div>

      {/* Store Rights Management */}
      <h4>🛡️ จัดการข้อมูลสิทธิ์และรายการร้านค้า</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ background: '#f1f1f1', textAlign: 'left' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ชื่อร้านค้า</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>หมวดหมู่</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>สถานะสิทธิ์</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>#{s.id}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}><strong>{s.name}</strong></td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s.category}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', color: s.isSuspended ? 'red' : 'green', fontWeight: 'bold' }}>
                {s.isSuspended ? 'ถูกระงับสิทธิ์' : 'ปกติ'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <button onClick={() => toggleSuspendStore(s.id)} style={{ background: s.isSuspended ? '#28a745' : '#dc3545', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                  {s.isSuspended ? 'ปลดระงับสิทธิ์' : 'ระงับสิทธิ์ร้านค้า'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* รายชื่อพนักงานในระบบ */}
      <h4>👥 รายชื่อพนักงานประจำร้านค้าในระบบ</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f1f1', textAlign: 'left' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ชื่อ-นามสกุล</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Username</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>บทบาท (Role)</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ร้านค้าที่สังกัด</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(u => ['Kitchen', 'Front', 'Owner'].includes(u.role)).map(u => {
            const store = stores.find(s => s.id === u.storeId);
            return (
              <tr key={u.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{u.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}><code>{u.username}</code></td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}><strong>{u.role}</strong></td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{store ? store.name : 'ไม่ระบุ'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================
function getStatusLabel(status) {
  switch (status) {
    case 'Pending': return 'รับออเดอร์แล้ว (รอเข้าครัว)';
    case 'Cooking': return 'กำลังปรุงอาหาร';
    case 'Ready': return 'ปรุงเสร็จแล้ว (รอรับที่หน้าร้าน)';
    case 'Completed': return 'รับอาหารสำเร็จ';
    case 'Cancelled': return 'ยกเลิกออเดอร์';
    default: return status;
  }
}