import React, { useState, useEffect } from 'react'
import '../assets/OrderScreen.css' // Import the new styles
import StickyHeader from './StickyHeader'

const OrderScreen = () => {
  const [orders, setOrders] = useState({ preparing: [], ready: [] })

  useEffect(() => {
    const ipcRenderer = window.electron.ipcRenderer

    ipcRenderer.on('order-preparing', (event, orderId) => {
      setOrders((prevState) => ({
        ...prevState,
        preparing: [...prevState.preparing, orderId]
      }))
    })

    ipcRenderer.on('order-ready', (event, orderId) => {
      setOrders((prevState) => ({
        ...prevState,
        preparing: prevState.preparing.filter((id) => id !== orderId),
        ready: [...prevState.ready, orderId]
      }))
    })

    ipcRenderer.on('order-completed', (event, orderId) => {
      setOrders((prevState) => ({
        preparing: prevState.preparing.filter((id) => id !== orderId),
        ready: prevState.ready.filter((id) => id !== orderId)
      }))
    })

    return () => {
      ipcRenderer.removeAllListeners('order-preparing')
      ipcRenderer.removeAllListeners('order-ready')
      ipcRenderer.removeAllListeners('order-completed')
    }
  }, [])

  return (
    <>
      <StickyHeader title="Orders Screen" />
      <div className="order-container">
        <h1>Order Status</h1>

        <section className="section">
          <h2>Preparing</h2>
          <ul className="order-list">
            {orders.preparing.length > 0 ? (
              orders.preparing.map((orderId) => <li key={orderId}>Order #{orderId}</li>)
            ) : (
              <p className="empty-message">No orders currently being prepared</p>
            )}
          </ul>
        </section>

        <section className="section">
          <h2>Ready</h2>
          <ul className="order-list">
            {orders.ready.length > 0 ? (
              orders.ready.map((orderId) => <li key={orderId}>Order #{orderId}</li>)
            ) : (
              <p className="empty-message">No orders ready for pickup</p>
            )}
          </ul>
        </section>
      </div>
    </>
  )
}

export default OrderScreen
