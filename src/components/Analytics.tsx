import {useEffect} from 'react'
import {loadGtag} from '../utils/gtag'

const Analytics = () => {
  useEffect(() => {
    loadGtag()
  }, [])

  return null
}

export default Analytics
