import { motion } from "framer-motion";
import { SkillsWeb } from "../../constants/resume";

const SkillProgress = ({ percent, skillname }) => {
  const barVariants = {
    initial: { width: "0%" },
    indeterminate: {
      width: ["0%", "95%", `${percent}%`],
      transition: {
        ease: [0.35, 1, 0.65, 0.85],
        duration: 1.5,
        delay: 0.5
      }
    }
  };

  return (
    <div className="relative pt-1 text-gray-100">
      <div>{skillname}</div>
      <div className="wrap">
        <motion.div
          className="bar"
          initial={{ width: "0%" }}
          animate={{ width: `${percent}%` }}
          transition={{
            type: "spring",
            stiffness: 45, // Controls how fast it moves
            damping: 6, // Controls bounce
            mass: 0.75 // Affects weight and momentum
          }}
        />
      </div>

      <style>{`
        .wrap {
          background-color: #f5f5f5;
          color: white;
          height: 14px;
          overflow: hidden;
          border-radius: 10px;
          margin: 8px 0;
        }
        .bar {
          height: 100%;
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
            <span className="pt-8 pb-4 text-xl font-bold text-slate-500">
              // {group.category}
            </span>
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
