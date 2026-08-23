import React, { useState, useEffect } from 'react';

export default function KitchenView({ user, apiBase }) {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = () => {
    fetch(`${apiBase}/api/orders?store_id=${user.StoreId}`).then(r => r.json()).then(data => {
      setOrders(data.filter(o => o.Status === 'Pending' || o.Status === 'Cooking'));
    });
    fetch(`${apiBase}/api/orders/kitchen-summary?store_id=${user.StoreId}`).then(r => r.json()).then(setSummary);
  };

  const updateStatus = (id, status) => {
    fetch(`${apiBase}/api/orders/${id}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, user_role: 'Kitchen Staff' })
    }).then(fetchData);
  };

  return (
    <div style={{ background: '#0f172a', color: 'white', padding: '25px', borderRadius: '12px' }}>
      <h2>🍳 จอห้องครัว (Kitchen Display System - KDS)</h2>
      <div style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #0284c7' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>📊 ยอดรวมวัตถุดิบที่ต้องทำตอนนี้:</h4>
        {summary.length === 0 ? <span>ไม่มีรายการค้างปรุง</span> : summary.map((s, i) => (
          <span key={i} style={{ background: '#0284c7', padding: '6px 12px', borderRadius: '20px', marginRight: '10px', fontSize: '14px', fontWeight: 'bold' }}>
            {s.ProductName}: {s.TotalQty} จาน
          </span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '15px' }}>
        {orders.map(o => (
          <div key={o.OrderID} style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', borderTop: o.Status === 'Cooking' ? '4px solid #eab308' : '4px solid #3b82f6' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc' }}>คิว: {o.QueueNo}</h3>
            <ul style={{ paddingLeft: '20px', margin: '0 0 15px 0' }}>
              {o.items.map(i => <li key={i.DetailID}>{i.ProductName} <b>x{i.Qty}</b></li>)}
            </ul>
            {o.Status === 'Pending' ? (
              <button onClick={() => updateStatus(o.OrderID, 'Cooking')} style={{ width: '100%', padding: '10px', background: '#eab308', color: 'black', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>👨‍🍳 เริ่มปรุง</button>
            ) : (
              <button onClick={() => updateStatus(o.OrderID, 'Ready')} style={{ width: '100%', padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>✅ ปรุงเสร็จแล้ว</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
