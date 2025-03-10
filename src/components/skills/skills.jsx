import { useSpring, animated } from '@react-spring/web';
import { SkillsWeb } from '../../constants/resume';


const SkillProgress = ({ percent, skillname }) => {
  const props = useSpring({
    width: `${percent}%`,
    config: { duration: 2000 },
  });

  return (
    <div className="relative pt-1 text-gray-100">
      <div>{skillname}</div>
      <div className="progressbar">
        <animated.div className="progressbarprg" style={props} />
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
  );
};

const SkillList = () => {
  return (
    <div>
      {SkillsWeb.map((group, groupIndex) => (
        <div key={groupIndex}>
          <div className="py-4">
            <span className="pt-8 pb-4 text-xl font-bold text-slate-500">// {group.category}</span>
          </div>
          <div className="pl-8">
            {group.skills.map(([percent, skillname], index) => (
              <SkillProgress key={index} percent={percent} skillname={skillname} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillList;
