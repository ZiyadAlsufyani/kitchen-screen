import StickyHeader from './StickyHeader'
import OrderList from './OrderList'

export default function KitchenScreen() {
  return (
    <>
      <StickyHeader title="Kitchen Screen" />
      <OrderList btnmessage="Ready" />
    </>
  )
}
