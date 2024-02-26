import React, { ReactNode, useState } from "react";
import './Collapsible.css';

// Typescript stuff //

type CollapsibleProps = {
  title: string;
  children: ReactNode;
}

// Component // 

const Collapsible = ({title, children}: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleCollapse = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`collapsible-container ${isOpen ? "active" : ""}`}>
      <button className="header" onClick={toggleCollapse}>
        {title}
      </button>
      <div className={`content ${isOpen ? "show" : ""}`}>
        {children}
      </div>
    </div>
  )
}

export default Collapsible;
