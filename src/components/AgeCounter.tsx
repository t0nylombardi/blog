import React, {useEffect, useState} from 'react'
import {getAgeParts} from '../utils/getAgeParts'
import {getEasternTimeNow} from '../utils/getEsternTimeNow'
import {pad} from '../utils/pad'
import type {AgeParts} from '../types/age'
import {BIRTHDAY} from '../constants'

const AgeCounter: React.FC = () => {
  const [ageParts, setAgeParts] = useState<AgeParts>(() => getAgeParts(BIRTHDAY, new Date()))

  useEffect(() => {
    const interval = setInterval(() => {
      setAgeParts(getAgeParts(BIRTHDAY, getEasternTimeNow()))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const display = [
    pad(ageParts.years, 2),
    pad(ageParts.months, 2),
    pad(ageParts.days, 2),
    pad(ageParts.hours, 2),
    pad(ageParts.minutes, 2),
    pad(ageParts.seconds, 2),
    pad(ageParts.milliseconds, 3),
  ].join(':')

  return display
}

export default AgeCounter
