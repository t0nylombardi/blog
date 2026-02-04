import React from 'react'

const CTA = ({link}) => {
  return (
    <div className="btn sm:mt-0  mt-10 text-left">
      <a href={link} className="btnAzureGradiant">
        {link.toUpperCase()}
      </a>
    </div>
  )
}

export default CTA
