import ProductCard from './ProductCard'
import '../assets/ProductCardList.css'

export default function ProductCardList({ onProductButtonClick }) {
  const boxes = []
  for (let i = 0; i < 9; i++) {
    boxes.push(<ProductCard key={i} onButtonClick={onProductButtonClick} />)
  }
  return (
    <>
      <div className="ProductCardList">{boxes}</div>
    </>
  )
}
