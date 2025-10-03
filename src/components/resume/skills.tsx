import {motion} from 'framer-motion'
import {SkillsWeb} from '../../constants/resume'

const SkillProgress = ({percent, skillname}) => {
  const barVariants = {
    initial: {width: '0%'},
    indeterminate: {
      width: ['0%', '95%', `${percent}%`],
      transition: {
        ease: [0.35, 1, 0.65, 0.85],
        duration: 1.5,
        delay: 0.5,
      },
    },
  }

  return (
    <div className="relative pt-1 text-ctp-text">
      <div>{skillname}</div>
      <div className="wrap">
        <motion.div
          className="bar"
          initial={{width: '0%'}}
          animate={{width: `${percent}%`}}
          transition={{
            type: 'spring',
            stiffness: 45,
            damping: 6,
            mass: 0.75,
          }}
        />
      </div>

      <style>{`
        .wrap {
          background-color: var(--color-ctp-surface0);
          color: white;
          height: 14px;
          overflow: hidden;
          border-radius: 10px;
          margin: 8px 0;
        }
        .bar {
          height: 100%;
          border-radius: 10px;
          background: -webkit-linear-gradient(180deg, var(--color-ctp-mauve-500) 0%, var(--color-ctp-blue-500) 100%);
        }
      `}</style>
    </div>
  )
}

const SkillList = () => {
  return (
    <div>
      {SkillsWeb.map((group, groupIndex) => (
        <div key={groupIndex}>
          <div className="py-4">
            <span className="pt-8 pb-4 text-xl font-bold text-ctp-green-500">// {group.category}</span>
          </div>
          <div className="pl-8">
            {group.skills.map(([percent, skillname], index) => (
              <SkillProgress key={index} percent={percent} skillname={skillname} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkillList
