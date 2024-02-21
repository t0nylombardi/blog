import { useSpring, easeInElastic, animated } from 'react-spring';
import { SkillsWeb } from '../../constants/resume';


const SkillProgress = ({ percent, skillname }) => {
  const props = useSpring({
    width: `${percent}%`,
    config: { duration: 2000, easing: easeInElastic },
  });

  return (
      <div>
        <div className="relative pt-1 text-gray-100">
          <div>{skillname}</div>
          <div className={'progressbar'}>
            <animated.div className={'progressbarprg'} style={props} />
          </div>

          <style>{`
            .progressbar {
              width: 100%;
              height: 12px;
              background-color: #f5f5f5;
              border-radius: 10px;
              margin: 10px 0;
            }
            .progressbarprg {
              height: 100%;
              color: white;
              line-height: 18px;
              text-align: center;
              width: 0%;
              border-radius: 10px;
              background-color: #3B82F6;
            }
          `}</style>
        </div>
      </div>
  );
};

const SkillList = () => {
  return (
    <div>
      {SkillsWeb.map((name, index) => {
        return (
          <SkillProgress key={index} percent={name[0]} skillname={name[1]} />
        );
      })}
    </div>
  );
};

export default SkillList;