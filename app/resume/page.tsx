import Image from "next/image";
import type { CSSProperties } from "react";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

type Experience = {
  slug: "hss" | "neudesic" | "maxcreepers" | "b2b";
  company: string;
  role: string;
  dates: string;
  description: string;
};

type Certification = {
  name: string;
  issuer: string;
  logo: string;
  logoAlt: string;
};

type Endorsement = {
  slug: string;
  image: string;
  alt: string;
};

const skills = [
  "User research",
  "User interviews",
  "Empathy mapping & Personas",
  "User journey mapping",
  "Competitive analysis",
  "Story boarding",
  "Site maps and user flows",
  "Sketching & wireframing",
  "Design pixel-perfect screens",
  "Develop prototypes in code",
  "User testing and evals",
  "Deployment & version control",
];

const tools = [
  "Figma",
  "Claude & Claude Code",
  "Codex & Open models",
  "Firebase",
  "MCP, & API",
  "Paper and pencil",
];

const code = ["React, React Native & Angular", "HTML, CSS & Next.js", "C & Python",];

/* Replaced the Industries card 2026-08-12. Industries listed Healthcare,
   Retail, Fintech, Hospitality & Gaming, Media & Entertainment and Non-Profit,
   none of which traces to a verified project in the capability intake — the
   evidenced set is enterprise software, manufacturing, education, beauty and
   B2B commerce. An unbacked card next to an AI-builder positioning was spending
   a slot on the weakest claim on the page.

   Each line below points at something that exists:
   - Agent & conversation design  → Tara (live) and Mirage (MS Surface concept)
   - Prompt & context engineering → the HSS assistant and Lorem system prompts
   - Model evals & guardrails     → test/guardrail.test.mjs, convo.mjs,
                                    simulate.mjs — a guardrail that rejects any
                                    number the fact store cannot back
   - Human-in-the-loop design     → that guardrail's handoff to a person
   - RAG & retrieval              → the HSS assistant's fact-store retrieval
   - Workflow automation          → the HSS Shopify migration, built in n8n */
const aiCapabilities = [
  "Agent & conversation design",
  "Prompt & context engineering",
  "Model evals & guardrails",
  "Human-in-the-loop design",
  "RAG & retrieval",
  "Workflow automation",
];

const languages = ["English", "Hindi", "Telugu & Kannada"];

const experiences: Experience[] = [
  {
    slug: "hss",
    company: "Hair System Salons",
    /* "AI Product Designer" is the functional title for the work — owning
       digital UX and shipping the AI products. The formal designation is a
       part-time CPT internship; that belongs on an application form, not on the
       face of a resume. Keep LinkedIn matching this. */
    role: "AI Product Designer",
    dates: "APR 2026 — PRESENT",
    /* Both figures are the audited ones from the case study, measured in Google
       Ads and the client's own booking data and reviewed with the owners. Do
       not add the conversion rate here — it is the one number whose denominator
       was never settled. */
    description:
      "I own digital UX and growth for a hair-replacement business. I designed and built an AI assistant that answers questions and books appointments on its own, the booking platform underneath it, and the email and SMS follow-up that earns the second visit. Cost per new customer fell from $105 to $40, and the share of new customers who came back moved from 40% to 72%. Built in Next.js, React, TypeScript and Supabase, with every line reviewed before it ships.",
  },
  {
    slug: "neudesic",
    company: "Neudesic (an IBM Company)",
    role: "UI UX Designer",
    /* Corrected from "PRESENT" on 2026-08-11. The role ended Jul 2024 (P1
       capability intake, confirmed). Left as-is it claimed a current job at an
       IBM company, and adding the entry above would have put two current roles
       on one resume. */
    dates: "MAY 2022 — JUL 2024",
    description:
      "Designing and creating digital products on a contract basis to help them build better products for their users. And collaborating with developer teams to improve product UX. Working on user-centered design, building rapid prototypes, User research, and business development for startups.",
  },
  {
    slug: "maxcreepers",
    company: "Maxcreepers design studio",
    role: "Lead UI UX Designer",
    dates: "FEB 2020 — APR 2022",
    description:
      "I worked closely with design teams & managed a wide variety of cross media projects involving UI UX design, Interaction design, design systems, branding, Sprint processes, product management, working with the development teams, UX development for startups, social media management, SEO, accounting and corporate legalities. Working for a startup company gave me an opportunity to explore different fields and gain experience.",
  },
  {
    slug: "b2b",
    company: "B2B Dock",
    role: "UI UX Designer",
    dates: "SEP 2019 — JAN 2020",
    description:
      "I have worked for b2b dock along with the other designers on the team. This company is a B2B platform for brands and sellers. I have designed sitemaps, Information architecture interfaces, and prototypes for the enterprise software which includes billing, Dashboards for sellers, retailers, and brands. Involved in different research methods such as user research & interviews, competitor research, and stakeholder interviews.",
  },
];

const certifications: Certification[] = [
  {
    name: "UX Design Specialisation",
    issuer: "95% with distinction -by Google",
    logo: "/certifications/google.png",
    logoAlt: "Google",
  },
  {
    name: "Human-computer Interaction",
    issuer: "Top 10% of the course taker Badge | IDF",
    logo: "/certifications/idf.jpg",
    logoAlt: "Interaction Design Foundation",
  },
  {
    name: "Gestalt principles and visual design",
    issuer: "Top 10% of the course taker Badge | IDF",
    logo: "/certifications/idf.jpg",
    logoAlt: "Interaction Design Foundation",
  },
  {
    name: "Data visualization for dashboards",
    issuer: "Top 10% of the course taker Badge | IDF",
    logo: "/certifications/idf.jpg",
    logoAlt: "Interaction Design Foundation",
  },
  {
    name: "Enterprise Design thinking practitioner",
    issuer: "Certified course from IBM",
    logo: "/certifications/ibm.png",
    logoAlt: "IBM",
  },
];

const endorsements: Endorsement[] = [
  {
    slug: "mamta",
    image: "/endorsements/mamta.png",
    alt: "Endorsement from Mamta Dalmiya, Founder & CEO",
  },
  {
    slug: "rohith",
    image: "/endorsements/rohith.png",
    alt: "Endorsement from Rohith Dhanala, CEO, Design Director",
  },
  {
    slug: "anusha",
    image: "/endorsements/anusha.png",
    alt: "Endorsement from Anusha Kannan, Project Manager",
  },
];

function WArrow() {
  return (
    <span className="warrow" aria-hidden="true">
      &rarr;
    </span>
  );
}

function MiniCard({
  title,
  items,
  span2 = false,
  sd,
}: {
  title: string;
  items: string[];
  span2?: boolean;
  sd: string;
}) {
  return (
    <div
      className={`resume-skills-card seq${span2 ? " span2" : ""}`}
      style={{ "--sd": sd } as CSSProperties}
    >
      <h4 className="resume-mini-head">{title}</h4>
      <ul className="resume-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Resume() {
  return (
    <main className="w-full">
      <SiteNav active="resume" />

      {/* Header */}
      <section
        className="rhead gut seq mx-auto w-full max-w-[1440px] pt-10"
        style={{ "--sd": "120ms" } as CSSProperties}
      >
        <h1>
          Dinesh
          <br />
          Revunuru
        </h1>
        <h2>Senior Product Designer</h2>
        <div className="c">
          <a href="mailto:dineshrevunuru@gmail.com">dineshrevunuru@gmail.com</a>
          <br />
          +1 (312) 838-4876
        </div>
        <p style={{ margin: "24px 0 0" }}>
          <a
            href="https://www.linkedin.com/in/dinesh-revunuru/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center t-cta text-[color:var(--color-brand-blue)]"
          >
            My Linkedin profile
            <WArrow />
          </a>
        </p>
      </section>

      {/* Skills / Tools / Industries / Code / Languages */}
      <section className="gut mx-auto w-full max-w-[1440px] pt-14">
        <div className="skills-grid">
          <MiniCard title="Skills" items={skills} span2 sd="220ms" />
          <MiniCard title="Tools" items={tools} sd="310ms" />
          <MiniCard title="AI capabilities" items={aiCapabilities} sd="400ms" />
          <MiniCard title="Code" items={code} sd="490ms" />
          <MiniCard title="Languages" items={languages} sd="580ms" />
        </div>
      </section>

      {/* Work Experience */}
      <section className="mt-16">
        {experiences.map((exp, i) => (
          <div
            key={exp.slug}
            className={`resume-exp-band seq${
              i % 2 === 1 ? " resume-exp-band--filled" : ""
            }`}
          >
            <article className="resume-exp-entry">
              <h3>{exp.company}</h3>
              <p className="exp-meta">
                {exp.role} &middot; {exp.dates}
              </p>
              <p className="b">{exp.description}</p>
            </article>
          </div>
        ))}
      </section>

      {/* Education — most recent first.

          Two levels per entry, matching Certifications below: the degree in
          serif, then school and dates on one meta line. School and dates are
          joined with a middot rather than stacked, which is the same idiom the
          work-experience meta uses ("role · dates") and drops each entry from
          three identical lines to two distinct ones.

          Dated "2024 to 2026" rather than "expected August 2026": the degree
          completes on 2026-08-21, so the range is accurate within days of this
          going live and stays accurate afterwards. */}
      <section className="narrow seq">
        <h3 className="t-sec">Education</h3>
        <div className="resume-edu-list">
          <div>
            <p className="resume-edu-degree">
              Master of Science in Human-Computer Interaction
            </p>
            <p className="resume-edu-meta">DePaul University, Chicago &middot; 2024 to 2026</p>
          </div>
          <div>
            <p className="resume-edu-degree">Computer Science and Engineering</p>
            <p className="resume-edu-meta">2016 to 2020</p>
          </div>
        </div>
        <hr className="resume-divider" />
      </section>

      {/* Certifications */}
      <section className="narrow seq">
        <h3 className="t-sec">Certifications</h3>
        <div className="certs" data-seq-group>
          {certifications.map((cert, i) => (
            <div key={`${cert.name}-${i}`} className="cert">
              <span className="logo" style={{ background: "#fff" }}>
                <Image
                  src={cert.logo}
                  alt={cert.logoAlt}
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </span>
              <div>
                <p className="nm">{cert.name}</p>
                <p className="is">{cert.issuer}</p>
              </div>
            </div>
          ))}
        </div>
        <hr className="resume-divider" />
      </section>

      {/* Memberships */}
      <section className="narrow seq">
        <h3 className="t-sec">Memberships</h3>
        <p className="body-p">Member of Interaction Design Foundation</p>
      </section>

      {/* Honors and Awards */}
      <section className="narrow seq" style={{ paddingTop: 48 }}>
        <h3 className="t-sec">Honors and Awards</h3>
        <p className="body-p">
          I have organised UI UX design workshops and events for students. I love
          to inspire students to explore the field of design. Achieved
          appreciation from many faculty for helping college in design-related
          works. Also organiser of design club and been a lead member in
          entrepreneurship development clubs.
        </p>
        <hr className="resume-divider" />
      </section>

      {/* Endorsements — real images fill the board's placeholder tiles */}
      <section
        className="pad-section seq mx-auto w-full max-w-[1440px]"
        style={{ paddingTop: 64, paddingBottom: 20 }}
      >
        <div className="narrow" style={{ padding: "0 16px" }}>
          <h3 className="t-sec">Endorsements</h3>
        </div>
        <div className="endo-grid" data-seq-group>
          {endorsements.map((e) => (
            <article key={e.slug}>
              <Image
                src={e.image}
                alt={e.alt}
                width={775}
                height={1024}
                className="h-auto w-full rounded-[12px] object-contain"
              />
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
