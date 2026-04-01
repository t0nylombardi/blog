import React from 'react'

type Props = {
  link: string
}

const CTA = ({link}: Props) => {
  return (
    <div className="btn sm:mt-0  mt-10 text-left">
      <a href={link} className="btnAzureGradiant">
        {link.toUpperCase()}
      </a>
    </div>
  )
}

export default CTA
