import {profile} from '@/domain/profile/personal.data'
const PersonalData = () => {
  return (
    <div>
          <p className=" pt-4">// list of my social links</p>
          {Object.entries(profile).map(([key, value]) => (
            <p key={key}>
              <span className="text-ctp-mauve-500">const </span>
              <span className="text-ctp-text">{key}</span> =
              <a
                href={value}
                className="text-ctp-green-500 hover:text-ctp-text block pl-6 md:inline md:pl-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                “{value}”
              </a>
            </p>
          ))}
        </div>
  )
}

export default PersonalData
