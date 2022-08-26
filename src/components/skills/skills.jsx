import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { animated } from 'react-spring';


const skillsWeb = [
  [95, 'Ruby'],
  [95, 'Ruby on Rails'],
  [90, 'React'],
  [85, 'Javascript'],
  [80, 'Typescript'],
  [70, 'SQL'],
  [50, 'NodeJS'],
  [95, 'Html/Css'],
  [30, 'Go'],
  [30, 'Python'],
];

const SkillProgress = ({ percent, skillname }) => {

  return (
    <VisibilitySensor onChange={onVisibilityChange}>
      <div>
        <div className="relative pt-1">
          <div>{skillname}</div>
          <div className={'progressbar'}>
            <animated.div
              className={'progressbarprg'}
              style={{width: `${percent}%`}}
            />
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
              background-color: #b9301c;
            }
          `}</style>
        </div>
      </div>
    </VisibilitySensor>
  );
};

const SkillList = () => {
  return (
    <div>
      {skillsWeb.map((name, index) => {
        return (
          <SkillProgress key={index} percent={name[0]} skillname={name[1]} />
        );
      })}
    </div>
  );
};

export default SkillList;