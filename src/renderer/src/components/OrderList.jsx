import OrderCard from './OrderCard';
import '../assets/OrderList.css';
import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';

export default function OrderList({ btnmessage, btnColor = 'primary' }) {
  // Initialize state from localStorage or empty array
  const [boxes, setBoxes] = useState(() => {
    const savedBoxes = localStorage.getItem('orderBoxes');
    return savedBoxes ? JSON.parse(savedBoxes) : [];
  });

  // Save to localStorage whenever boxes changes
  useEffect(() => {
    localStorage.setItem('orderBoxes', JSON.stringify(boxes));
  }, [boxes]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api');
        const orders = await response.json();

        // Only process orders if array is not empty
        if (orders && orders.length > 0) {
          orders.forEach(order => {
            addOrderCard(order.orderNum);
          });
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const interval = setInterval(fetchOrders, 1000);
    return () => clearInterval(interval);
  }, []);

  function addOrderCard(orderNum) {
    const newBox = { 
      id: uuid(), 
      btnColor,
      orderNum 
    };
    setBoxes(prevBoxes => [...prevBoxes, newBox]);
  }

  function removeOrderCard(id) {
    setBoxes(boxes.filter((box) => box.id !== id));
  }

  async function handleOrderCardClick(orderNum) {
    const fromDevice = 'kitchen';
    const toDevices = ['orderTermination', 'display']; // Array of toDevice values

    try {
      // Send to each toDevice
      for (const toDevice of toDevices) {
        const response = await fetch('/write', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fromDevice: fromDevice, toDevice: toDevice, orderNum: parseInt(orderNum) })
        });
        const data = await response.text();
        console.log(data);
      }
    } catch (error) {
      console.error('Error writing data:', error);
    }
  }

  return (
    <div className="OrderList">
      {boxes.map((box) => (
        <OrderCard
          orderNum={box.orderNum}
          btnmessage={btnmessage}
          key={box.id}
          id={box.id}
          btnColor={box.btnColor}
          removeOrderCard={removeOrderCard}
          onOrderCardClick={handleOrderCardClick} // Pass the handler function
        />
      ))}
    </div>
  );
}