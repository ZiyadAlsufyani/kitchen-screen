import '../assets/StickyHeader.css' // Import the CSS file for styles
import logo from '../assets/McDonalds-01.svg' // Import the logo

const StickyHeader = ({ title }) => {
  return (
    <header className="sticky-header">
      <div className="header-content">
        <div className="logoAndTitle">
          <img src={logo} alt="McDonald's Logo" className="logo" />
          <h1 className="title">{title}</h1>
        </div>
      </div>
    </header>
  )
}

export default StickyHeader
