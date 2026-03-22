export interface WorkHistory {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string; // ISO preferred: "2020-01"
  endDate?: string;  // undefined = current role
  isCurrent?: boolean;
  description?: string; // short summary
  highlights: string[]; // bullet points
  technologies?: string[];
  website?: string;
}

export const WorkHistory: WorkHistory[] = [
  {
    id: 'seamgen',
    company: "Seamgen",
    role: "Lead Backend Engineer",
    location: "San Diego, CA(remotely)",
    startDate: "June 2024 - March 2025",
    highlights: [
      "Designed and developed a scalable application from the ground up using Rails 7.2 as an API.",
      "Implemented authentication and authorization using AWS Cognito for secure user management.",
      "Integrated GraphQL to enable efficient and flexible data querying for complex data manipulation.",
      "Led software architecture planning and implementation, ensuring maintainability and scalability.",
      "Mentored and guided software engineers through code reviews, sprint unblocking, and best practices.",
      "Collaborated cross-functionally with the Project Manager, Product team, and UI/UX Designer to define epics and create user stories.",
      "Broke down features into manageable development tasks to streamline implementation.",
    ],
  },
  {
    id: 'Lombardi Consulting',
    role: "Lead Consultant",
    company: "Lombardi Consulting",
    location: "South Salem, NY",
    startDate: "June 2022 - Present",
    highlights: [
      "Created various websites using Javascript, Typescript, NextJS, AstroJS, and Ruby on Rails.",
      "Converted websites from static websites to dynamic websites.",
      "Built Point of Sale System with headless Shopify and Nextjs.",
      "Built Twitter like social network using Ruby on Rails 7.1 and Hotwire.",
      "Built analytics engine to track customer websites.",
      "Developed and implemented strategic plans to improve operational efficiency and profitability, resulting in a 35% increase in revenue",
      "Collaborated with cross-functional teams to identify customer needs and develop solutions to meet those needs.",
    ],
  },
  {
    id: 'Avail',
    role: "Lead Software Engineer",
    company: "Avail by Realtor.com",
    location: "Chicago, IL",
    startDate: "September 2021 - June 2022",
    highlights: [
      "Coordinated with the development team to make successful products.",
      "Worked along with other tech leads, product managers and engineering managers to plan and implement application changes from start to finish.",
      "Applied best practices in development while following standardized coding conventions.",
      "Mentored and coached junior team members, resulting in a 25% decrease in employee turnover.",
      "Developed a microservices architecture that improved system modularity and reduced dependencies between components.",
    ],
  },
  {
    id: "Avail",
    role: "Senior Software Engineer",
    company: "Avail by Realtor.com",
    location: "Chicago, IL",
    startDate: "June 2021 - September 2021",
    highlights: [
      "Built applications using Ruby on Rails for the backend and React on the frontend.",
      "Designed and implemented planning and execution of taking a monolith to microservices.",
      "Implemented microservices for listing curated data in listing apartments.",
      "Deployed better Logging for APIs and services.",
      "Facilitated root cause analysis of common system issues to meet customer needs.",
      "Monitored systems for defects and employed bug resolution.",
      "Mentored teammates with code issues.",
      "Developed a CI/CD pipeline that facilitated code quality checks and enabled automated testing and deployment.",
    ],
  },
  {
    id: 'Lendkey',
    role: "Software Engineer",
    company: "LendKey Technologies",
    location: "New York, NY",
    startDate: "October 2017 - June 2020",
    highlights: [
      "Built and maintained APIs, moving away from Legacy Monolith infrastructure to a more domain-driven microservice through Docker, Ruby on Rails, Java Spring-Boot and ReactJS.",
      "Worked with ReactJS and TypeScript to build a front end for a new markeyplace product.",
      "Used higher order of components to make small, reusable sections",
      "Built login feature using MS Azure, JWT, and Apigee",
      "Utilized crucial design software skills to complete projects on time and within budget.",
      "Effectively coded software changes and alterations based on specific design requirements.",
      "Applied & stayed current with existing and emerging technologies and techniques.",
      "Brought forth a passion and dedication to software development.",
    ],
  },
  {
    id: "TMPG",
    role: "Full-Stack Engineer",
    company: "TMPG",
    location: "White Plains, NY",
    startDate: "August 2015 - October 2017",
    highlights: [
      "Managed a development team building rich, interactive websites.",
      "Built and maintained new infrastructures while merging our legacy systems into a new platform infrastructure.",
      "Brought forth extensive experience developing API’s to connect and curate new and existing data through multiple platforms.",
      "Implemented procedural changes in server infrastructures to improve performance and security.",
      "Created new internal portal for managing client data and assets.",
      "Successfully worked to meet tight client deadlines.",
      "Worked well with internal and external teams to ensure that all client needs were met.",
    ],
  },
  {
    id: "ferguson",
    role: "Software Engineer",
    company: "Ferguson Enterprisess",
    location: "New York, NY",
    startDate: "October 2017 - June 2020",
    highlights: [
        "Transformed a large e-commerce website with new Ruby on Rails backend technology and a modern front-end framework.",
        "Maintained stores' locations, websites and backend databases for 250+ stores.",
        "Developed a user-friendly SMS solution for customer service and marketing.",
        "Developed and maintained employee authentication and authorization systems.",
        "Tracked and resolved site speed and performance issues.",
    ],
  },
];
