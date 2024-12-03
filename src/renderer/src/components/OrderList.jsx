import OrderCard from './OrderCard'
import '../assets/OrderList.css'
import { v4 as uuid } from 'uuid'
import { useState, useEffect } from 'react'

export default function OrderList({ btnmessage, btnColor = 'primary' }) {
  const [boxes, setBoxes] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api')
        const orders = await response.json()
        
        // Only process orders if array is not empty
        if (orders && orders.length > 0) {
          orders.forEach(order => {
            addOrderCard(order.orderNum)
          })
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    const interval = setInterval(fetchOrders, 2000)
    return () => clearInterval(interval)
  }, [])

  function addOrderCard(orderNum) {
    const newBox = { 
      id: uuid(), 
      btnColor,
      orderNum 
    }
    setBoxes(prevBoxes => [...prevBoxes, newBox])
  }

  function removeOrderCard(id) {
    setBoxes(boxes.filter((box) => box.id !== id))
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
        />
      ))}
    </div>
  )
}
