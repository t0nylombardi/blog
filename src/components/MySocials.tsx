import {socials} from '../constants'

const MySocials = () => {
  return (
    <div>
      <p className="comment pt-4">// list of my social links</p>
      {Object.entries(socials).map(([platform, url]) => (
        <p key={platform}>
          <span className="text-[#4D5BCE]">const </span>
          <span className="text-[#43D9AD]">{platform}</span> =
          <a
            href={url}
            className="text-[#E99287] hover block pl-6 md:inline md:pl-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            “{url}”
          </a>
        </p>
      ))}
    </div>
  )
}

export default MySocials
