import {BaseWrapper} from '@/components/layout/BaseWrapper'
import {Profile, WorkHistory} from '@/domain/resume'
import SkillList from '@/components/resume/skills'

export default function ResumePage() {
  return (
    <BaseWrapper>
      <main className="md:mx-auto py-25">
        <div className="resume">
          <div className="resume-header">
            <a href="/">
              <h1 className="text-2xl md:text-7xl text-ctp-text font-extrabold">ANTHONY LOMBARDI</h1>
            </a>

            <div className="block md:hidden text-center text-ctp-peach-500 py-6 space-y-2">
              <p className="text-3xl font-bold">Father</p>
              <p className="text-md font-medium">Consultant &#8226; Mentor</p>
              <p className="text-md font-bold">FullStack Engineer</p>
            </div>

            <h3 className="hidden md:block text-2xl text-ctp-peach-500 py-6">
              Father &#8226; Consultant &#8226; Mentor &#8226; FullStack Engineer
            </h3>
          </div>

          <div className="resume-body-wrapper border-t-2 border-ctp-text">
            <div className="flex flex-row">
              <div className="hidden md:block flex-row skills-hobbies border-r-2 border-ctp-text">
                <div className="skills">
                  <h2 className="text-xl text-ctp-text">|&gt; SKILLS</h2>
                  <div className="py-4">
                    <SkillList />
                  </div>
                </div>

                <div className="hobbies text-ctp-text">
                  <h2 className="text-2xl text-ctp-text">|&gt; HOBBIES</h2>
                  <hr />
                  <p>
                    Spending time with my two beautiful children, Exploring the Outdoors, Building guitars &amp;&amp;
                    Woodworking, Playing Guitar, and Cooking. I am also a huge fan of the{' '}
                    <span className="text-ctp-yellow-500">Pittsburgh Steelers</span> and the{' '}
                    <span className="text-ctp-blue-500">New York Yankees</span>. Life&apos;s a grand adventure, my
                    friends, and I&apos;m just here to soak it all in, one epic moment at a time. Cheers to family,
                    hobbies, and sports fandoms that never quit!
                  </p>
                </div>
              </div>

              <div className="flex-auto w-full resume-main">
                <div className="profile">
                  <h2 className="text-2xl text-ctp-text">|&gt; PROFILE</h2>
                  <hr />
                  <p className="text-sm md:text-md border-b-2 border-ctp-text mb-8">{Profile}</p>
                </div>

                <div className="employment-history border-b-2 border-ctp-text">
                  <h2 className="text-2xl text-ctp-text">|&gt; EMPLOYMENT HISTORY</h2>
                  <hr />

                  {WorkHistory.map((job) => (
                    <div className="employment mb-4" key={`${job.company}-${job.role}-${job.startDate}`}>
                      <div className="grid grid-cols-4">
                        <div className="col-span-3 text-left text-md font-bold text-ctp-mauve-500">{`${job.role}, ${job.company}`}</div>
                        <div className="text-left md:text-right font-bold text-ctp-peach-500">{job.location}</div>
                      </div>

                      <p className="employment-date text-ctp-text mb-2">{job.startDate}</p>

                      <div className="highlights">
                        <ul className="list-inside list-disc">
                          {job.highlights.map((highlight, index) => (
                            <li className="text-sm pb-2 md:text-md md:pl-2" key={`${job.company}-${index}`}>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="education pt-5">
                  <h2 className="text-2xl text-ctp-text">|&gt; EDUCATION</h2>
                  <hr />
                  <div className="grid grid-cols-4">
                    <div className="text-sm md:text-md col-span-3 text-left font-bold text-ctp-mauve-500">
                      CSM, College of Westchester
                    </div>
                    <div className="font-bold text-sm md:text-md text-right text-ctp-peach-500">White Plains, NY</div>
                  </div>
                  <p className="employment-date text-ctp-text">Sep 2004 - May 2006</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </BaseWrapper>
  )
}
