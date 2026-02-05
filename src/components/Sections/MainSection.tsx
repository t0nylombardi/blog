import AgeCounter from '../AgeCounter'
import MySocials from '../MySocials'
import CTA from '../UI/CTA'

const MainSection = () => {
  return (
    <section
      id="hello"
      className="min-h-svh md:h-screen snap-none scroll-mt-20 pt-24 md:pt-0 mx-auto px-4 sm:px-0 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-0"
    >
      <div className="intro w-full md:w-1/2 flex flex-col items-center md:items-start text-center sm:text-left md:text-left">
        <div className="text-ctp-text pb-8 sm:w-full">
          <p className="text-xl sm:text-2xl font-medium">Hey, I'm</p>
          <h1 className="text-3xl md:text-5xl font-medium mt-2">Anthony Lombardi</h1>
        </div>

        <div className="text-sm md:text-base font-medium mt-6 space-y-1  sm:text-left">
          <p className="comment">// personal data</p>

          <p className="">
            <span className="text-ctp-mauve-500">let </span>
            <span className="text-ctp-text">title</span> =
            <span id="age" className="text-ctp-green-500 block pl-6 md:inline md:pl-0">
              "Lead Ruby Software Engineer";
            </span>
          </p>

          <p>
            <span className="text-ctp-mauve-500">let </span>
            <span className="text-ctp-text">location</span> =
            <span className="text-ctp-green-500 block pl-6 md:inline md:pl-0">"Westchester, New York";</span>
          </p>

          <p>
            <span className="text-ctp-mauve-500">let </span>
            <span className="text-ctp-text">focus</span> =
            <span className="text-ctp-green-500 block pl-6 md:inline md:pl-0">
              "Eat, Code, Think about life choices, sleep, repeat";
            </span>
          </p>

          <MySocials />
        </div>

        <div className="mt-6 sm:w-full">
          <CTA link="resume" />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center hero-image">
        <img src="/amoji_avatar.svg" alt="Avatar" className="w-auto max-w-[600px] object-contain" />
      </div>
    </section>
  )
}

export default MainSection
