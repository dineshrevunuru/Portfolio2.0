import Image from "next/image";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import CaseStudyHero from "../components/case-study/CaseStudyHero";
import CaseStudySection from "../components/case-study/CaseStudySection";
import CaseStudyImage from "../components/case-study/CaseStudyImage";
import CaseStudyList from "../components/case-study/CaseStudyList";
import CaseStudyVideo from "../components/case-study/CaseStudyVideo";
import { b2bDockImages as img, b2bDockVideos as vid } from "./images";

const prototypePlaceholder =
  "We tried to keep the platform as minimal as possible so that users feel easy to explore and reach their desired page or fulfill their task.";

const prototypeSections = [
  {
    heading: "Searching Brands and requesting content access.",
    video: vid.searchingBrands,
    maxWidth: 800,
  },
  {
    heading: "Brands store visits and access products.",
    video: vid.storeCategories,
    maxWidth: 800,
  },
  {
    heading: "Applying filters on the brand's store.",
    video: vid.filters,
    maxWidth: 800,
  },
  {
    heading: "Product selecting and checkout pages",
    video: vid.checkout,
    maxWidth: 800,
  },
  {
    heading: "Reseller profile editing and requesting for verification",
    video: vid.resellerProfile,
    maxWidth: 800,
  },
  {
    heading: "B2B dock Brand's dashboard prototype",
    video: vid.brandDashboard,
  },
  {
    heading: "brand dashboard accessing marketing tool and Ad management",
    video: vid.marketingTool,
  },
];

export default function B2BDockCaseStudy() {
  return (
    <main className="w-full cs-theme-b2b">
      <SiteNav active="case-study" />

      <CaseStudyHero
        title={
          <>
            A B2B Platform for
            <br />
            Brands and Resellers
          </>
        }
      />

      {/* ─── Overview block ─── */}
      <section className="cs-container-wide pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-20 lg:gap-32">
          <div>
            <h3 className="cs-overview-head">Project overview</h3>
            <p className="mt-4 cs-overview-body">
              B2B dock is a Bangalore-based startup working on a SaaS
              application providing Brands, resellers, and retailers a platform
              to trade commodities and other goods. B2B wants to solve the
              problems being faced by people in the unorganized sector by
              eliminating middle men.
            </p>
          </div>
          <div>
            <h3 className="cs-overview-head">My role</h3>
            <p className="mt-4 cs-overview-body">
              <strong>Product Designer</strong>
            </p>
            <p className="mt-3 cs-overview-body">
              User research, Information architecture, wireframing, visual
              design &amp; usability testing.
            </p>
          </div>
          <div>
            <h3 className="cs-overview-head">Duration</h3>
            <p className="mt-4 cs-overview-body">Jun – Oct 2019, (5 months)</p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="cs-overview-head">Client</h3>
          <div className="mt-4">
            <Image
              src={img.clientLogo.src}
              alt="B2B Dock client logo"
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
              B2B Dock is a B2B e-commerce company that aims to simplify the
              trading experience for businesses. With a focus on creating a
              user-friendly platform, B2B Dock connects manufacturers,
              wholesalers, traders, and retailers, streamlining the process of
              sourcing products, managing inventory, and fulfilling orders. The
              platform offers a range of products across various categories
              such as fashion, electronics, home and kitchen, and more, making
              it a one-stop shop for businesses to meet their procurement
              needs.
            </p>
            <p>
              B2B Dock&rsquo;s UI/UX design plays a critical role in creating a
              seamless and intuitive trading experience for its users. The
              design team is constantly working to improve the platform&rsquo;s
              usability, functionality, and aesthetics, with a focus on
              delivering a delightful user experience. By understanding the
              needs and preferences of its users, B2B Dock&rsquo;s design team
              creates a design language that is consistent, responsive, and
              easy to navigate, enhancing the platform&rsquo;s usability and
              accessibility. With a strong focus on UI/UX design, B2B Dock is
              well-positioned to continue its growth and success in the B2B
              e-commerce market.
            </p>
          </div>

          <h3 className="cs-section-head mt-10">Business goals</h3>
          <div className="mt-5 cs-prose">
            <CaseStudyList
              items={[
                "Enhance customer satisfaction: Customer satisfaction is crucial for any business, and B2B Dock is no exception. A user-friendly UI/UX design can improve the overall customer experience, resulting in higher customer satisfaction, increased loyalty, and repeat business.",
                "Increase brand recognition: A well-designed UI/UX can also help increase brand recognition and awareness. By creating a consistent and recognizable design language across all touchpoints, B2B Dock can establish a strong brand identity, making it easier for customers to remember and recognize the brand.",
                "Reduce customer support inquiries: An intuitive UI/UX design can also help reduce customer support inquiries by making it easier for customers to find what they need and complete tasks on their own. By reducing the number of support inquiries, B2B Dock can save time and resources, allowing the team to focus on other key business goals.",
              ]}
            />
          </div>
        </div>
      </section>

      <CaseStudySection heading="Design process">
        <></>
      </CaseStudySection>
      <figure className="cs-container cs-figure mt-6 sm:mt-8 flex justify-center">
        <Image
          src={img.leanUx.src}
          alt="Lean UX process diagram"
          width={img.leanUx.width}
          height={img.leanUx.height}
          style={{ width: 289, height: 275 }}
        />
      </figure>
      <CaseStudySection spacing="tight">
        <p>
          The Lean UX methodology has played a significant role in the UI/UX
          design of our company application. By focusing on user needs and
          constantly iterating based on feedback, we have been able to create a
          design that is both intuitive and user-friendly. The Lean UX approach
          has allowed us to design and test quickly, which has resulted in a
          more efficient and effective design process. Through our use of this
          methodology, we have been able to create a design that meets the
          needs of our users while aligning with our business goals.
          Ultimately, the Lean UX approach has allowed us to create a
          user-centric design that has led to increased engagement and
          satisfaction among our users.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="User Research">
        <></>
      </CaseStudySection>

      <CaseStudySection heading="Potential users">
        <p>
          B2B Dock&rsquo;s potential customers are small and medium-sized
          businesses across India. These businesses operate in a variety of
          industries, including manufacturing, retail, and wholesale. B2B Dock
          caters to businesses of all sizes, offering a range of products and
          services to meet their needs. B2B Dock&rsquo;s target customers are
          looking for an efficient and convenient way to source products,
          access financing, and logistics services, and build relationships
          with their partners. By providing a one-stop shop for all their
          needs, B2B Dock is able to meet the needs of a wide range of
          customers, from small startups to large enterprises.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="Competitive analysis">
        <p>
          Once we were able to get a better understanding of the thoughts and
          feelings of the users, we proceeded to conduct research on some of
          the direct and indirect competitors. During the research, we wrote
          down some of the major strengths and weaknesses of each of the
          websites. B2B Dock is competing with a number of B2B e-commerce
          platforms in India. Some of the key players in the market include
          Meesho, Glowroad, Udaan, ShopKirana, Indiamart, TradeIndia, Alibaba,
          and Amazon Business.
        </p>
      </CaseStudySection>
      <CaseStudyImage
        {...img.competitorAudit}
        alt="Competitor research sample"
        caption="A snap of competitive analysis data is shown above."
      />

      <CaseStudySection heading="Wireframing">
        <></>
      </CaseStudySection>

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
      <CaseStudyImage {...img.hifi} alt="High-fidelity wireframes — B2B Dock" wide />

      <CaseStudySection heading="Visual design">
        <p>
          We have a design plan to reduce cognitive load by showing the
          selections that users have selected between the style variations. We
          aren&rsquo;t practically sure which customization layout would allow
          users to the maximum and best usable way. So, we decided to test out
          all three possible layouts by testing prototypes with the users.
        </p>
      </CaseStudySection>
      <CaseStudyImage
        {...img.visualDesign}
        alt="Small design system — B2B Dock"
        wide
        maxWidth={800}
      />

      <CaseStudySection heading="UI design & prototyping">
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

      {prototypeSections.map((s) => (
        <div key={s.heading}>
          <CaseStudySection heading={s.heading}>
            <p>{prototypePlaceholder}</p>
          </CaseStudySection>
          <CaseStudyVideo src={s.video} alt={s.heading} wide maxWidth={s.maxWidth} />
        </div>
      ))}

      <div className="pb-16 sm:pb-24" />
      <SiteFooter />
    </main>
  );
}
