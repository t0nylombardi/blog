import React from 'react'

type Props = {
  header: string
}

const SectionHeader = ({header}: Props) => {
  return <h3 className="text-3xl md:text-5xl font-medium">{header}</h3>
}

export default SectionHeader
