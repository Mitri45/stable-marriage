import React from "react"
import "typeface-poppins"
import "./layout.css"

//Wrapper with global styles

export default function Layout({ children }) {
    return (
      <div>
        {children}
      </div>
    )
  }