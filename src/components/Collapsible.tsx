import React, { ReactNode, useState } from "react";
import './Collapsible.css';

// Typescript stuff //

type CollapsibleProps = {
  title: string;
  children: ReactNode;
  isNested?: boolean;
  open?: boolean;
}

// Component // 

const Collapsible = ({title, children, isNested = false, open = true}: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(open);

  const toggleCollapse = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`collapsible-container ${!isOpen ? "active" : ""} ${isNested ? 'nested-container' : ""}`}>
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
