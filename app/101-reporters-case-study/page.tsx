import Image from "next/image";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import CaseStudyHero from "../components/case-study/CaseStudyHero";
import CaseStudyPhase from "../components/case-study/CaseStudyPhase";
import CaseStudySection from "../components/case-study/CaseStudySection";
import CaseStudyImage from "../components/case-study/CaseStudyImage";
import CaseStudyList from "../components/case-study/CaseStudyList";
import CaseStudyVideo from "../components/case-study/CaseStudyVideo";
import { reportersImages as img } from "./images";

const stakeholders = [
  {
    portrait: img.stakeholder1,
    quote:
      "I quit mainstream media to pursue my interest in highlighting local stories that don't find space in national media. Only two percent of India's mainstream media coverage is about rural issues. Even though almost 70 percent of India's population, 1.3 billion population, live in villages. This is disturbing for a democratic country like India, where transparency is key to ensuring justice to everyone, especially the poor. So, I was convinced that there's a need to build a platform to bring out this important story at the national level.",
    name: "Gangadhar Patil",
    role: "Founder and CEO at 101 Reporters",
  },
  {
    portrait: img.stakeholder2,
    quote:
      "I have been working closely with journalists. I have seen most of them struggling to deliver or work in a specific deadlines. Which is really hard for a true journalist. Journalist always wanted to say the truth to our world which sometimes goes beyond the deadlines. Beside this most Freelance or independent journalists struggle to get a good pay for their hard work and dedication which is really a heart breaking moment.",
    name: "Milli Mishra",
    role: "Director at 101 Reporters",
  },
  {
    portrait: img.stakeholder3,
    quote:
      "I am not a journalist but have been working on tech in media industry and understanding the major tech problems facing by users of media and journalists. I have seen more people being passionate to be a journalist. When people spend a good amount of time other than their primary work and if the time they are spending goes in vain because media houses could refuse to publish their story or they may not get a good reward for their hard work demotivates people and puts them away from their passionate work. So we have decided to build a platform and help independent journalists to pitch their articles with a good reward and at the same help media houses to pick a small but powerful stories.",
    name: "Amol Dhekane",
    role: "Co-Founder and CTO at 101 Reporters",
  },
];

export default function ReportersCaseStudy() {
  return (
    <main className="w-full cs-theme-reporters">
      <SiteNav active="case-study" />

      <CaseStudyHero
        title={
          <>
            A platform to connect freelance
            <br />
            journalists and media houses
          </>
        }
      />

      {/* ─── Overview block ─── */}
      <section className="cs-container-wide pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-20 lg:gap-32">
          <div>
            <h3 className="cs-overview-head">Project overview</h3>
            <p className="mt-4 cs-overview-body">
              101 Reporters is a network of freelance journalists and acts as
              a bridge between freelancers and media houses. They accept story
              ideas from reporters, fine-tune them and pitch them to media
              houses.
            </p>
          </div>
          <div>
            <h3 className="cs-overview-head">My role</h3>
            <p className="mt-4 cs-overview-body">
              <strong>UX UI Designer | Maxc studio</strong>
            </p>
            <p className="mt-3 cs-overview-body">
              User research, Information architecture, wireframing, visual
              design &amp; usability testing.
            </p>
          </div>
          <div>
            <h3 className="cs-overview-head">Duration</h3>
            <p className="mt-4 cs-overview-body">Mar – Dec 2019, (9 months)</p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="cs-overview-head">Client</h3>
          <div className="mt-4">
            <Image
              src={img.clientLogo.src}
              alt="101 Reporters client logo"
              width={img.clientLogo.width}
              height={img.clientLogo.height}
              className="h-auto w-auto max-w-[240px]"
            />
          </div>
        </div>
      </section>

      {/* ─── Intro band ─── */}
      <section className="cs-intro-band">
        <div className="cs-container">
          <h2 className="cs-intro-label">Intro</h2>

          <h3 className="cs-section-head mt-8">Project overview</h3>
          <div className="mt-5 cs-prose">
            <p>
              101Reporters is a platform for freelance journalists who can and
              are open to write articles and blogs on their own wish 101
              reporters website needed to be redesigned to make it help its
              users in such a way that freelancers will be able to showcase
              articles on the website. At the same time, these articles need
              to be categorised into news categories to make it easy for media
              houses to pick and buy articles from journalists where 101
              reporters will act as mediators between media houses and
              journalists. The soul purpose of this project is to build a
              platform which which connects freelance journalists and media
              houses.
            </p>
          </div>

          <h3 className="cs-section-head mt-10">Business goals</h3>
          <div className="mt-5 cs-prose">
            <CaseStudyList
              items={[
                "To let the freelancers know 101 reporters is the fastest growing platform for freelance journalists by converting visitors into freelance journalists by signing up with 101 reporters.",
                "Building a strong brand identity makes it easy for freelancers to identify and to make a recognizable brand among media houses",
              ]}
            />
          </div>
        </div>
      </section>

      <CaseStudySection heading="Design process">
        <p>
          We have done our research and decided to follow the Design Thinking
          approach of problem-solving, which is a nonlinear approach, to
          achieve good outcomes from the product we are building.
        </p>
        <p>
          Design Thinking is a design methodology that provides a
          solution-based approach to solving problems. It&rsquo;s extremely
          useful in tackling complex problems that are ill-defined or unknown,
          by understanding the human needs involved, by re-framing the problem
          in human-centric ways, by creating many ideas in brainstorming
          sessions, and by adopting a hands-on approach in prototyping and
          testing. Understanding these five stages of Design Thinking will
          empower anyone to apply the Design Thinking methods in order to
          solve complex problems that occur around us – in our companies, in
          our countries, and even on the scale of our planet.
        </p>
      </CaseStudySection>

      {/* ========================================================= */}
      <CaseStudyPhase label="Empathise" />

      <CaseStudySection heading="User Research">
        <></>
      </CaseStudySection>

      <CaseStudySection heading="Secondary research">
        <p>
          A 5-day workshop was conducted with the stakeholders of 101 reporters
          and freelance journalists. My research encompassed –
        </p>
        <p>
          My limited experience with freelancing meant that I needed to gain
          an understanding of freelancers and their pain points in the world
          of journalism. To begin building this foundational knowledge, we
          undertook extensive secondary user research, conducting:
        </p>
        <CaseStudyList
          items={[
            "Online ethnography, forum analysis: Understand user habits, the tools they use, and their challenges.",
            "Analyzing freelancer demographics: Clearly define the target audience, and understand how freelancers work.",
            "Analyzing freelancer interviews and daily routine accounts: Identify non-billable tasks they complete regularly.",
          ]}
        />
        <p>
          This approach allowed us to gain a high-level understanding of
          freelance needs, the features they seek out, and how they approach
          media houses.
        </p>
      </CaseStudySection>
      <CaseStudyImage
        {...img.secondaryResearch}
        alt="A snippet of secondary user research"
        caption="A snippet of secondary user research"
      />

      <CaseStudySection heading="Primary research">
        <p>
          Primary research gave us a valuable starting point, however I wanted
          to conduct primary user research to really delve into the daily work
          life of a freelancer.
        </p>
        <p>
          For a deeper understanding of freelance needs and challenges, we
          recruited and conducted a user interview in order to learn about
          freelance attitudes towards, and management of, non-billable tasks.
          Because this interview presented a small, non-representative sample,
          I also conducted a user survey to collect additional data.
        </p>
        <p>
          The goal of my research was to better understand the experience and
          feelings of freelancers when completing non-billable tasks. Key
          insights from my discovery research include:
        </p>
        <CaseStudyList
          items={[
            "Key tasks: To-do lists, emailing, logging time spent, finance tracking",
            "Key pain points: Lack of holistic experience/single system, outdated UI, not visual enough",
            "Key freelancer behavior: Use multiple apps, lack of work routine, many work part-time, spend 1-2 hours on non-billable tasks per day",
          ]}
        />
      </CaseStudySection>

      <CaseStudySection heading="What do stake holders have to say?">
        <></>
      </CaseStudySection>
      <div className="cs-container mt-6 sm:mt-8">
        <div className="grid grid-cols-1 gap-8 sm:gap-10">
          {stakeholders.map((s) => (
            <figure
              key={s.name}
              className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-5 sm:gap-6 items-start"
            >
              <Image
                src={s.portrait.src}
                alt={`Portrait of ${s.name}`}
                width={s.portrait.width}
                height={s.portrait.height}
                className="rounded-full w-[120px] h-[120px] object-cover"
              />
              <blockquote className="cs-insight-quote">
                &ldquo;{s.quote}&rdquo;
                <footer className="mt-3 not-italic text-[14px]">
                  <strong>{s.name}</strong>, {s.role}
                </footer>
              </blockquote>
            </figure>
          ))}
        </div>
      </div>

      <CaseStudySection heading="Potential users">
        <p>
          From the research, business goals and stakeholder interviews we are
          able to identify the users and have divided them into three
          categories namely primary users, secondary users and terfiary users.
          Users who fall into the primary sector are the one&rsquo;s who will
          be highly beneficial cause we are trying to solve the problems of
          freelance journalists with 101 reporters as a platform. The
          secondary sector is taken by the media houses which play a major
          role in buying the stories written by freelancers. There is another
          category of people who can be turned into potential primary users
          when they sign up with the platform who cannot be ignored.
        </p>
      </CaseStudySection>
      <figure
        className="cs-figure mt-6 sm:mt-8 mx-auto px-4"
        style={{ maxWidth: 1000 }}
      >
        <Image
          src={img.potentialUsers.src}
          alt="Potential users classification"
          width={img.potentialUsers.width}
          height={img.potentialUsers.height}
          sizes="(max-width: 1000px) 100vw, 1000px"
          className="w-full h-auto"
        />
      </figure>

      <CaseStudySection heading="What do individual user groups think?">
        <p>
          On interviewing and talking to the users of 101 reporters, which
          includes freelance journalists and media houses, we tried to include
          questions that are related to the media industry to get to know
          about the field in a better way. This research mainly focuses on
          learning about people&rsquo;s opinions and their assumptions on
          where the news industry is leading and how the changes are affecting
          their lives as full-time people on the field. Based on this research
          we have developed a data chart on what individual categories think
          they are facing the biggest problems in journalism today.
        </p>
      </CaseStudySection>
      <CaseStudyImage
        {...img.userGroups}
        alt="Chart — what individual categories think about journalism today"
      />
      <CaseStudySection spacing="tight">
        <p>
          What individual categories think they are facing the biggest problems
          in journalism today and how have different groups reacted.
        </p>
      </CaseStudySection>

      {/* ========================================================= */}
      <CaseStudyPhase label="Define" />

      <CaseStudySection heading="Analysing data">
        <></>
      </CaseStudySection>

      <CaseStudySection heading="Empathy map">
        <p>
          We have gone through a lot of research where we have learnt different
          things from regular news readers, freelancers, media houses and
          stakeholders of the company. Also, we have seen some surprising
          elements and facts in the field of media and journalism.
        </p>
        <p>
          We started analyzing all the data, qualitative and quantitative,
          which we have gathered from both primary and secondary research. By
          analyzing this data we have moved on to the next step in the design
          process which is to define our users, identify their pain points and
          develop a problem statement.
        </p>
      </CaseStudySection>
      <CaseStudyImage
        {...img.empathyMap}
        alt="Empathy map for freelance journalists"
      />

      <CaseStudySection heading="User persona">
        <p>
          The insights we have uncovered from both my primary and secondary
          research allowed us to create a user persona. These user personas
          represent the core users for the client&rsquo;s business. From the
          instructions and requests from the client, we are clear that we are
          solving the problems of the freelance journalists as the highest
          priority rather than focusing on the pain points of media houses. So
          we have come up with two personas having different stories.
        </p>
      </CaseStudySection>
      <CaseStudyImage {...img.persona1} alt="Persona — Varsha Singh" />
      <CaseStudyImage {...img.persona2} alt="Persona — Praduman Choubey" />

      <CaseStudySection heading="Synthesizing data">
        <></>
      </CaseStudySection>

      <CaseStudySection heading="Problem statement">
        <></>
      </CaseStudySection>
      <CaseStudyImage {...img.problemStatement} alt="Problem statement graphic" />

      <CaseStudySection heading="Hypothesis statement">
        <></>
      </CaseStudySection>
      <CaseStudyImage {...img.hypothesisStatement} alt="Hypothesis statement graphic" />

      {/* ========================================================= */}
      <CaseStudyPhase label="Ideate" />

      <CaseStudySection heading="Brainstorming">
        <p>
          Coming up with as many ideas as possible plays a crucial role for a
          solution that can fulfil the user needs. We can have choose rapid
          ideation technique. Our goal is to come up with as many solutions as
          possible that ideally solves the users keen problem. With the help
          of the user research we have done, along the personas we have took
          into consideration has played a major role in this.
        </p>
        <p>
          Creating a better Journey for freelancers acted as a major challenge
          for the team. Developing and testing a seamless user experience
          during this journey has been taken into priority. At this point in
          time, we were very clear that users are facing a lot of issues with
          the journey that they are being into. We decided to build a better
          path for freelance journalists rather than just building a platform
          to showcase their stories so media houses can show their interest.
        </p>
      </CaseStudySection>
      <CaseStudyImage
        {...img.brainstorming}
        alt="Brainstorming wall — post-it ideas"
        caption="Snap of post-it's on the wall during brainstorming session."
      />

      <CaseStudySection heading="Information architecture">
        <p>
          Coming up with as many ideas as possible plays a crucial role for a
          solution that can fulfil the user needs. We can have choose rapid
          ideation technique. Our goal is to come up with as many solutions as
          possible that ideally solves the users keen problem. With the help
          of the user research we have done, along the personas we have took
          into consideration has played a major role in this.
        </p>
      </CaseStudySection>
      <CaseStudyImage {...img.ia} alt="Information architecture diagram" />

      <CaseStudySection heading="User flow">
        <p>
          The insights we have uncovered from both my primary and secondary
          research allowed us to create a user persona. These user personas
          represent the core users for the client&rsquo;s business. From the
          instructions and requests from the client, we are clear that we are
          solving the problems of the freelance journalists as the highest
          priority rather than focusing on the pain points of media houses. So
          we have come up with two personas having different stories.
        </p>
      </CaseStudySection>
      <CaseStudyImage
        {...img.userFlow}
        alt="User flow map for non-freelance journalist sign-up"
        caption="A non-freelance journalist user flow map to increase sign up rate."
      />

      <CaseStudySection heading="Wireframing">
        <></>
      </CaseStudySection>

      <CaseStudySection heading="Low-Fidelity wireframes">
        <p>
          With the bunch of ideas we explored as a team has come up different
          wireframes representing the ideas we have come up in the brain
          storming session. We have tested as many ideas as possible and
          collected every possible feedback. Below are few of the ideas we
          have worked on.
        </p>
      </CaseStudySection>
      <CaseStudyImage {...img.lofi} alt="Low-fidelity wireframes" wide />

      {/* ========================================================= */}
      <CaseStudyPhase label="Prototype & Testing" />

      <CaseStudySection heading="High-Fidelity wireframes">
        <p>
          Secondary research gave us a valuable starting point, however I
          wanted to conduct primary user research to really delve into the
          daily work life of a freelancer.
        </p>
        <p>
          For a deeper understanding of freelance needs and challenges, we
          recruited and conducted a user interview in order to learn about
          freelance attitudes towards, and management of, non-billable tasks.
          Because this interview presented a small, non-representative sample,
          I also conducted a user survey to collect additional data.
        </p>
        <p>
          The goal of my research was to better understand the experience and
          feelings of freelancers when completing non-billable tasks. Key
          insights from my discovery research include:
        </p>
      </CaseStudySection>
      <figure className="cs-figure mt-6 sm:mt-8 w-full">
        <Image
          src={img.hifi.src}
          alt="High-fidelity wireframes"
          width={img.hifi.width}
          height={img.hifi.height}
          sizes="100vw"
          className="w-full h-auto"
        />
      </figure>

      <CaseStudySection heading="Visual design">
        <p>
          This was extremely challenging as we had to design a complete
          library of individual design components for implementing the vision
          of unified design. Fonts, color palettes, story cards, widgets, and
          UI elements, each of them have a separate library and do&rsquo;s
          and don&rsquo;ts to provide users with a stunning experience.
        </p>
      </CaseStudySection>
      <CaseStudyImage {...img.visualDesign} alt="Visual design — UI elements style guide" />

      <CaseStudySection heading="UI design">
        <p>
          We ideated in collaboration on what the new Information architecture
          of the platform should look like, ensuring that it is usable and
          scalable.
        </p>
        <p>
          For proper hands-on collaboration and to provide real-time
          visibility of progress to the stakeholders we chose Figma as our
          design tool. All stakeholders were invited to that space, and
          feedback were taken from them. Figma was a lifesaver in this
          project as it enabled us to design things that were technologically
          feasible – since time was a constraint.
        </p>
        <p>
          Complete usability testing was done at every stage. We employed the
          focus groups technique and user observation at each stage.
        </p>
      </CaseStudySection>
      <figure className="cs-figure mt-6 sm:mt-8 w-full">
        <Image
          src={img.uiDesign.src}
          alt="All UI designs — 101 Reporters platform"
          width={img.uiDesign.width}
          height={img.uiDesign.height}
          sizes="100vw"
          className="w-full h-auto"
        />
      </figure>

      <CaseStudySection heading="Prototyping">
        <p>
          We have developed prototypes during every phase of our design
          process and iterated designs with the new learning we have come
          across when we have tested it out with users. We were glad that we
          were able to interact with the real users who were on the
          client&rsquo;s database.
        </p>
        <p>
          We took feedback from both primary and secondary users along with
          feedback from the client. We were able to test with different users
          who have different goals to achieve with the product we are
          designing for.
        </p>
      </CaseStudySection>

      <CaseStudyVideo
        src={img.prototypeVideo}
        alt="101 Reporters interactive UI prototype"
        wide
      />

      <CaseStudySection heading="Work time gallery">
        <></>
      </CaseStudySection>
      <div className="cs-container mt-6 sm:mt-8">
        <div className="flex flex-nowrap gap-3 overflow-x-auto">
          {[
            img.gallery1,
            img.gallery2,
            img.gallery3,
            img.gallery4,
            img.gallery5,
          ].map((g, i) => (
            <Image
              key={i}
              src={g.src}
              alt={`Work session photo ${i + 1}`}
              width={g.width}
              height={g.height}
              className="object-cover flex-shrink-0"
              style={{ width: 150, height: 150 }}
            />
          ))}
        </div>
      </div>

      <div className="pb-16 sm:pb-24" />

      <SiteFooter />
    </main>
  );
}
