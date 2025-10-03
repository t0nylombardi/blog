import {socials} from '../constants'

const MySocials = () => {
  return (
    <div>
      <p className="comment pt-4">// list of my social links</p>
      {Object.entries(socials).map(([platform, url]) => (
        <p key={platform}>
          <span className="text-ctp-mauve-500">const </span>
          <span className="text-ctp-text">{platform}</span> =
          <a
            href={url}
            className="text-ctp-green-500 hover:text-ctp-text block pl-6 md:inline md:pl-0"
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
