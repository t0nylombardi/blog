import AgeCounter from '../AgeCounter'
import MySocials from '../MySocials'
import CTA from '../UI/CTA'

const MainSection = () => {
  return (
    <section
      id="hello"
      className="h-screen snap-start! pt-[1rem] mx-auto px-4 sm:px-8 flex flex-col-reverse md:flex-row items-center"
    >
      <div className="flex flex-col md:flex-row w-full h-full justify-center items-center">
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="text-ctp-text text-center md:text-left">
            <p className="sm:text-2xl font-medium">Hey, I'm</p>
            <h1 className="text-3xl sm:text-3xl font-bold mt-2">Anthony Lombardi</h1>
            <h2 className="text-gradient text-2xl mt-1">&gt; Full-Stack Engineer</h2>
          </div>

          <div className="font-medium mt-6 space-y-1">
            <p className="comment">// personal data</p>

            <p>
              <span className="text-ctp-mauve-500">let </span>
              <span className="text-ctp-text">age</span> =
              <span id="age" className="text-ctp-red-500 block pl-6 md:inline md:pl-0">
                <AgeCounter />
              </span>
            </p>

            <p>
              <span className="text-ctp-mauve-500">let </span>
              <span className="text-ctp-text">location</span> =
              <span className="text-ctp-green-500 block pl-6 md:inline md:pl-0">"Westchester, New York"</span>
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
