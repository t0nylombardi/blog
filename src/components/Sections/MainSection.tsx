import AgeCounter from '../AgeCounter'
import MySocials from '../MySocials'
import CTA from '../UI/CTA'

const MainSection = () => {
  return (
    <section
      id="hello"
      className="h-screen snap-start! scroll-mt-20 pt-[1rem] mx-auto px-4 sm:px-8 flex flex-col-reverse md:flex-row items-center"
    >
      <div className="flex flex-col md:flex-row w-full h-full justify-center items-center">
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="text-ctp-text text-center md:text-left pb-8">
            <p className="text-3xl sm:text-2xl font-medium">Hey, I'm</p>
            <h1 className="text-[3rem] sm:text-[4rem] font-medium mt-2">Anthony Lombardi</h1>
          </div>

          <div className="font-medium mt-6 space-y-1 text-lg">
            <p className="comment">// personal data</p>

            <p>
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

          <div className="mt-6">
            <CTA link="resume" />
          </div>
        </div>

        <div className="h-full w-full md:w-1/2 flex justify-start md:justify-end items-start mt-[8rem]">
          <img src="/amoji_avatar.svg" alt="Avatar" className="min-w-[800px]" />
        </div>
      </div>
    </section>
  )
}

export default MainSection
