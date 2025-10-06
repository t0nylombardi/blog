import React from 'react'

const CTA = ({link}) => {
  return (
    <div className="mt-10 text-center">
      <a href={link} className="btnAzureGradiant">
        {link.toUpperCase()}
      </a>
    </div>
  )
}

export default CTA
