import Image from "next/image";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

type Experience = {
  slug: "neudesic" | "maxcreepers" | "b2b";
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
  "Empathy mapping",
  "Personas",
  "User journey mapping",
  "Competitive analysis",
  "Story boarding",
  "Site maps and user flows",
  "Information Architecture",
  "Sketching",
  "Wireframing",
  "Interactive prototyping",
  "User testing & usability studies",
];

const tools = [
  "Figma",
  "Adobe XD",
  "Zeplin",
  "Principle & Framer X",
  "Photoshop",
  "Paper and pencil",
];

const code = ["HTML & CSS", "Javascript", "C programming language"];

const industries = [
  "Healthcare",
  "Retail",
  "Fintech",
  "Hospitality & Gaming",
  "Media & Entertainment",
  "Non-Profit",
];

const languages = ["English", "Hindi", "Telugu & Kannada"];

const experiences: Experience[] = [
  {
    slug: "neudesic",
    company: "Neudesic (an IBM Company)",
    role: "UI UX Designer",
    dates: "MAY 2022 — PRESENT",
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

function Arrow() {
  return (
    <svg
      className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function MiniCard({
  title,
  items,
  className = "",
}: {
  title: string;
  items: string[];
  className?: string;
}) {
  return (
    <div className={`resume-skills-card ${className}`}>
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
      <section className="pad-section mx-auto w-full max-w-[1440px] pt-10 sm:pt-14">
        <h1 className="t-serif-hero text-[color:var(--color-ink)]">
          Dinesh
          <br />
          Revunuru
        </h1>
        <h2 className="mt-2 t-sans-hero text-[color:var(--color-accent)]">
          UX UI Designer
        </h2>
        <div className="mt-6 space-y-1 t-body">
          <p>
            <a
              href="mailto:dineshrevunuru@gmail.com"
              className="hover:opacity-70"
            >
              dineshrevunuru@gmail.com
            </a>
          </p>
          <p>+1 (312) 838-4876</p>
        </div>
        <p className="mt-6">
          <Link
            href="https://www.linkedin.com/in/dinesh-revunuru/"
            className="group inline-flex items-center t-cta text-[color:var(--color-brand-blue)] hover:opacity-70"
          >
            My Linkedin profile
            <Arrow />
          </Link>
        </p>
      </section>

      {/* Skills / Tools / Industries / Code / Languages */}
      <section className="pad-section mx-auto w-full max-w-[1440px] pt-12 sm:pt-16">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <MiniCard
            title="Skills"
            items={skills}
            className="md:col-span-2 lg:col-span-1 lg:row-span-2"
          />
          <MiniCard title="Tools" items={tools} />
          <MiniCard title="Industries" items={industries} />
          <MiniCard title="Code" items={code} />
          <MiniCard title="Languages" items={languages} />
        </div>
      </section>

      {/* Work Experience */}
      <section>
        {experiences.map((exp, i) => {
          const filled = i % 2 === 1;
          return (
            <div
              key={exp.slug}
              className={`resume-exp-band ${
                filled ? "resume-exp-band--filled" : ""
              }`}
            >
              <article className="resume-exp-entry">
                <h3 className="t-serif-title">{exp.company}</h3>
                <p className="mt-2 resume-meta-label">
                  {exp.role} · {exp.dates}
                </p>
                <p className="mt-6 t-body">{exp.description}</p>
              </article>
            </div>
          );
        })}
      </section>

      {/* Education */}
      <section className="mx-auto w-full max-w-[800px] px-4 pt-16 sm:pt-20">
        <h3 className="t-section-head">Education</h3>
        <p className="mt-6 resume-meta-label">
          Computer Science and Engineering
        </p>
        <p className="mt-2 resume-meta-label">2016 to 2020</p>
        <hr className="resume-divider" />
      </section>

      {/* Certifications */}
      <section className="mx-auto w-full max-w-[800px] px-4 pt-16 sm:pt-20">
        <h3 className="t-section-head">Certifications</h3>
        <ul className="mt-6 space-y-6">
          {certifications.map((cert, i) => (
            <li key={`${cert.name}-${i}`} className="flex items-start gap-5">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white">
                <Image
                  src={cert.logo}
                  alt={cert.logoAlt}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <p className="t-serif-title text-[20px] leading-tight">
                  {cert.name}
                </p>
                <p className="mt-1 t-body">{cert.issuer}</p>
              </div>
            </li>
          ))}
        </ul>
        <hr className="resume-divider" />
      </section>

      {/* Memberships */}
      <section className="mx-auto w-full max-w-[800px] px-4 pt-16 sm:pt-20">
        <h3 className="t-section-head">Memeberships</h3>
        <p className="mt-6 t-body">Member of Interaction Design Foundation</p>
      </section>

      {/* Honors and Awards */}
      <section className="mx-auto w-full max-w-[800px] px-4 pt-12 sm:pt-16">
        <h3 className="t-section-head">Honors and Awards</h3>
        <p className="mt-6 t-body max-w-[720px]">
          have organised UI UX design workshops and events for students. I love
          to inspire students to explore the field of design. Achieved
          appreciation from many faculty for helping college in design-related
          works. Also organiser of design club and been a lead member in
          entrepreneurship development clubs.
        </p>
        <hr className="resume-divider" />
      </section>

      {/* Endorsements */}
      <section className="pad-section mx-auto w-full max-w-[1440px] pt-16 sm:pt-20 pb-20">
        <div className="mx-auto w-full max-w-[800px] px-4">
          <h3 className="t-section-head">Endorsements</h3>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {endorsements.map((e) => (
            <article key={e.slug}>
              <Image
                src={e.image}
                alt={e.alt}
                width={775}
                height={1024}
                className="h-auto w-full object-contain"
              />
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
