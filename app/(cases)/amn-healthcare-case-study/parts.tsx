import type { CSSProperties, ReactNode } from "react";

/* The drawn parts of the AMN case study's third version (./page.tsx): icons, Passport's screens, the
   ShiftWise staff list. Everything is redrawn in code from the team's designs; nothing is an image of
   them. Names are placeholders, and the designs' illustration of three clinicians is a plain drawing of
   three figures. Photographs and portraits are free stock pictures standing in for the designs' own: his
   "will go with recommendations" (fifth version), from Unsplash and Pexels; which is which, with each
   photographer, is in /public/sketches/work/amn/CREDITS.md. */
export const I = (i: number) => ({ "--i": i }) as CSSProperties;
export const PIC = (name: string) => `/sketches/work/amn/amn-${name}`;
const IC = {
  check: "M3.5 8.5l3 3 6-7", down: "M4 6l4 4 4-4", up: "M4 10l4-4 4 4", right: "M6 4l4 4-4 4", back: "M10 3L5 8l5 5", plus: "M8 3v10M3 8h10", x: "M4 4l8 8M12 4l-8 8",
  eye: "M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  doc: "M4 2h5.5L12 4.5V14H4zM9.5 2v2.5H12",
  alert: "M8 1.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 8 1.8zM8 4.8v4M8 11v.2",
  search: "M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM11 11l3.5 3.5",
  pen: "M10.5 2.5l3 3L6 13H3v-3z",
  user: "M8 8a2.8 2.8 0 1 0 0-5.6A2.8 2.8 0 0 0 8 8zM2.8 14c.5-2.6 2.6-4 5.2-4s4.7 1.4 5.2 4",
  menu: "M2.5 4.5h11M2.5 8h11M2.5 11.5h11",
  heart: "M8 13.2S2.5 10 2.5 6.2A2.9 2.9 0 0 1 8 4.9a2.9 2.9 0 0 1 5.5 1.3C13.5 10 8 13.2 8 13.2z",
  mail: "M2 4h12v8H2zM2 4.5l6 4.5 6-4.5",
  chat: "M8 2.5c3.3 0 6 2.1 6 4.8s-2.7 4.8-6 4.8c-.7 0-1.4-.1-2-.3L3 13l.7-2.4C2.6 9.8 2 8.6 2 7.3c0-2.7 2.7-4.8 6-4.8z",
  phone: "M5 2.5l1.8 3-1.3 1.200a7 7 0 0 0 3.800 3.800l1.200-1.300 3 1.800-.8 2.300C7.500 13.800 2.200 8.500 2.700 3.300z",
  cal: "M2.5 4h11v9.500h-11zM2.500 6.800h11M5.500 2.500v3M10.500 2.500v3",
  copy: "M5.500 5.500h8v8h-8zM3 10.500h-.500v-8h8V3",
  okc: "M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM5.300 8.200l1.900 1.900 3.600-4",
  dots: "M8 3.500v.1M8 8v.1M8 12.500v.1",
  reset: "M3.500 8a4.500 4.500 0 1 0 1.400-3.300M3.500 3v2.500H6",
  home: "M2.500 7.500L8 3l5.500 4.500v6h-11zM6.500 13.500V10h3v3.500",
  bell: "M4 11V7.500a4 4 0 0 1 8 0V11l1 1.500H3zM6.800 14h2.400",
  people: "M6 8a2.300 2.300 0 1 0 0-4.600A2.300 2.300 0 0 0 6 8zM1.800 13c.4-2.200 2-3.300 4.200-3.300s3.800 1.100 4.200 3.300M10.500 7.800a2 2 0 1 0-.6-3.900M11.800 9.800c1.400.3 2.200 1.300 2.500 3.200",
  finger: "M5 13c-.8-1.500-1-3-1-4.500a4 4 0 0 1 8 0c0 1.800.2 3 .7 4.300M6.500 13.500C6 12 6 10.500 6 8.500a2 2 0 0 1 4 0c0 2 .2 3.500.8 5M8 8.500c0 2 .2 3.700.8 5.200",
  star: "M8 2.300l1.700 3.600 3.900.5-2.900 2.700.8 3.900L8 11l-3.500 2 .8-3.900L2.400 6.400l3.900-.5z",
  pin: "M8 14s4.500-4.200 4.500-7.500a4.500 4.500 0 0 0-9 0C3.500 9.800 8 14 8 14zM8 8.300a1.800 1.800 0 1 0 0-3.600 1.800 1.800 0 0 0 0 3.600z",
  dollar: "M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM9.800 6.300c-.3-.7-1-1-1.800-1-1 0-1.800.5-1.800 1.300 0 1.900 3.700.9 3.700 2.900 0 .9-.8 1.500-1.900 1.500-.9 0-1.700-.4-2-1.200M8 4.200v7.600",
  clock: "M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM8 4.800V8l2.200 1.500",
  list: "M5.500 4h8M5.500 8h8M5.500 12h8M2.500 4h.1M2.500 8h.1M2.500 12h.1",
  folder: "M2 4h4l1.500 1.500H14V13H2z",
  trash: "M3 4.500h10M6 4.500V3h4v1.500M4.500 4.500l.5 9h6l.5-9",
  grid: "M2.500 2.500H7V7H2.500zM9 2.500h4.500V7H9zM2.500 9H7v4.500H2.500zM9 9h4.500v4.500H9z",
  idcard: "M2 3.500h12v9H2zM4.500 6.500h3v3h-3zM9.500 6.500H12M9.500 9H12",
  cert: "M4 2h8v12H4zM6 5h4M6 7.500h4M9.500 11.500a1.200 1.200 0 1 0 0-2.400 1.200 1.200 0 0 0 0 2.400z",
  screen: "M2 3h12v8H2zM6 13.500h4M8 11v2.500",
  syringe: "M10.500 2.500l3 3M12 4l-7 7-2 .5.5-2 7-7M3 13l-1 1M7.500 6l2.500 2.500",
  globe: "M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12",
  image: "M2 3h12v10H2zM2 10.500l3.500-3.500 3 3 2-2 3.500 3.500M10.500 6.300h.1",
  inbox: "M8 2.500v7M5.500 7L8 9.500 10.500 7M3 11.500v2h10v-2",
  bed: "M2 12V5M2 9.500h12V12M14 9.500V8A1.500 1.500 0 0 0 12.500 6.500H7v3M4.500 8.300a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  share: "M4 8.500V13h8V8.500M8 2.500v7M5.500 5L8 2.500 10.500 5",
  gear: "M8 10.300a2.300 2.300 0 1 0 0-4.600 2.300 2.300 0 0 0 0 4.600zM8 1.800v2M8 12.200v2M1.800 8h2M12.200 8h2M3.600 3.600L5 5M11 11l1.400 1.400M3.600 12.400L5 11M11 5l1.400-1.400",
  kit: "M2.500 5h11v8h-11zM6 5V3h4v2M8 7.500v3M6.500 9h3",
  flag: "M4 14V2.500h8l-2 3 2 3H4",
  bookmark: "M4.500 2.500h7v11L8 11l-3.500 2.500z",
  download: "M8 2.500v8M5 8l3 3 3-3M3 13.500h10",
  map: "M2 4l4-1.500 4 1.500 4-1.500v9.500l-4 1.500-4-1.500-4 1.500zM6 2.500V12M10 4v9.500",
  thumb: "M5.500 7l2.500-4.500c1 0 1.500.8 1.500 1.800V6h3l-1 6.500h-6zM2.500 7h3v6h-3z",
  moon: "M12.500 9.800A5 5 0 0 1 6.200 3.500a5 5 0 1 0 6.300 6.300z",
  send: "M14 2L2 7l4.500 2L8.500 14zM6.500 9L14 2",
  refresh: "M3 8a5 5 0 0 1 8.500-3.500L13 6M13 3v3h-3M13 8a5 5 0 0 1-8.500 3.500L3 10M3 13v-3h3",
  filter: "M2.500 3.500h11L9.500 8.500v4l-3 1v-5z",
  rows: "M2.500 4h11M2.500 8h11M2.500 12h11",
  // for the credential screens as the sheet draws them (fifth version)
  lines: "M3 4.500h10M5 8h6M7 11.500h2",
  req: "M4 4h8v10H4zM5 4l5.500-2v2M8 11.300a2.300 2.300 0 1 0 0-4.600 2.300 2.300 0 0 0 0 4.600zM5.700 9h4.600M8 6.700c.9.9.9 3.700 0 4.600M8 6.700c-.9.9-.9 3.700 0 4.600",
  exam: "M2 3h12v8H2zM6 13.500h4M8 11v2.500M4.500 5.700h.1M6.500 5.700h5M4.500 8.300h.1M6.500 8.300h5",
  hr: "M4 3.500h8V14H4zM6.500 2.500h3v2h-3zM8 9a1.300 1.300 0 1 0 0-2.600A1.300 1.300 0 0 0 8 9zM5.800 12c.3-1.300 1.100-1.900 2.200-1.900s1.900.6 2.200 1.900",
  pulse: "M8 13.200S2.500 10 2.500 6.200A2.900 2.900 0 0 1 8 4.900a2.900 2.900 0 0 1 5.500 1.300C13.500 10 8 13.200 8 13.200zM4.300 8h2l.9-1.700 1.500 3.100.9-1.400h2.200",
  docok: "M10 3H4v11h8V6.500M6 7h3M6 9.500h4M6 12h2.500M12 4.700a1.700 1.700 0 1 0 0-3.400 1.700 1.700 0 0 0 0 3.400z",
  subm: "M4 3.500h8V14H4zM6.500 2.500h3v2h-3zM5.800 9.300l1.700 1.700 3-3.400",
  form: "M11 6V4.500L8.500 2H3.500v12h4M8.500 2v2.500H11M5.500 6.500h3M5.500 9h1.500M9 13.500l.4-1.900 3.600-3.600 1.500 1.500-3.600 3.600z",
  badge: "M8 1.800l1.600 1.200 2-.2.6 1.900 1.700 1-.7 1.900.7 1.900-1.700 1-.6 1.900-2-.2L8 14.200l-1.600-1.200-2 .2-.6-1.900-1.700-1 .7-1.900-.7-1.900 1.700-1 .6-1.900 2 .2zM5.600 8.200l1.700 1.700 3.200-3.600",
  docl: "M4 2h5.500L12 4.500V14H4zM9.500 2v2.500H12M6 7.500h4M6 9.500h4M6 11.500h4",
  eyeoff: "M1.500 8s2.400-4.500 6.500-4.500S14.500 8 14.500 8 12.100 12.500 8 12.500 1.500 8 1.500 8zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM3 13L13 3",
  award: "M8 9.500a3.700 3.700 0 1 0 0-7.400 3.700 3.700 0 0 0 0 7.400zM5.800 8.800L5 14l3-1.700 3 1.700-.8-5.200",
  earth: "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zM4.300 5.200l2.300-1.200 1.900.9-.6 1.600-1.700.7.3 1.700-1.200 1.900-1.400-2.300zM9.800 6.700l2.200-.3.9 1.900-1.200 2.600-1.500-.7-.9-1.700z",
};
export type IcName = keyof typeof IC;
export const Ic = ({ d, className = "" }: { d: IcName; className?: string }) => <svg className={`pp-ic ${className}`} viewBox="0 0 16 16" aria-hidden="true"><path d={IC[d]} /></svg>;
export const Logo = ({ white = false }: { white?: boolean }) => <span className={white ? "pp-logo pp-logo--white" : "pp-logo"}><img src="/sketches/work/amn-mark.png" alt="" width="66" height="68" />AMN<b>Passport</b></span>;
export const Field = ({ label, value, state = "", note, end }: { label: string; value?: ReactNode; state?: string; note?: string; end?: ReactNode }) => (
  <span className={`pp-f ${state}${value ? "" : " is-null"}`}><small>{value ? label : ""}</small><b>{value ?? label}{end}</b>{note && <em>{note}</em>}</span>
);
// In place of the designs' illustration of three clinicians: three plain figures on a disc.
export const Trio = () => <span className="a3-trio" aria-hidden="true"><i /><i /><i /></span>;
const Tick = ({ on = false, label }: { on?: boolean; label: ReactNode }) => <span className={on ? "a3-tick is-on" : "a3-tick"}><i>{on && <Ic d="check" />}</i>{label}</span>;

/* ---------- Passport: whole screens ---------- */
export const Phone = ({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) => <div className={`pp pp-phone a2-ph ${className}`} role="img" aria-label={label}>{children}</div>;
export const Job = ({ tag, tone, wide = false, pic }: { tag: string; tone: string; wide?: boolean; pic?: string }) => (
  <span className={wide ? "a3-job a3-job--wide" : "a3-job"}>
    <span className="a3-job-pic" style={pic ? { backgroundImage: `url(${PIC(pic)})` } : undefined}><u style={{ background: tone }}>{tag}</u><Ic d="heart" /></span>
    <span className="a3-job-in"><b>Los Angeles, California</b><small>Surgical Technologist &middot; Operating Room</small><small>Jul 22 &middot; 13 weeks &middot; 12 D/N &middot; 233 beds</small><strong>$2,345<i>/wk</i></strong></span>
  </span>
);
/* The credential screens follow the team's sheets closely: his "Will try matching 10, 11 & 12 as we have
   in the reference", then "Check screen 14 and 15. Also add form screen" (the record after files are added,
   the main menu, and the sheet's "Accordion Expand" with Forms opened, which comes third as it does there). They are drawn at the sheet's own size, 360px wide, and shown smaller (../amn5.css, .c5), so
   every proportion is the sheet's: the tiles and their alert dots, the red and green cards, the red bar
   on each requirement, the line down the side of an opened group. Sample dates drop the year, and the
   sheet's "Verificaton" is spelled right. */
const CENTRE: [string, string, IcName, boolean?][] = [["Licenses / License Verification", "6", "idcard", true], ["Certifications", "12", "cert"], ["Education & Exams", "6", "exam", true], ["Human Resources", "13", "hr"], ["Employee Health", "22", "pulse"], ["Clinical Qualifications", "6", "docok"], ["COVID-19 Vaccination Record", "", "syringe"], ["Submissions", "", "subm"]];
const GROUPS: [string, string, IcName, boolean?][] = [["Document Uploads", "5", "image", true], ["License Verification", "2", "idcard"], ["Forms", "2", "form"], ["Skills Checklist", "1", "badge"], ["Links", "1", "earth", true], ["Education & Exams", "1", "exam"], ["Read-Only PDFs", "1", "docl"]];
const UPLOADS: [string, string, IcName, boolean?][] = [["Surgical Technologist Certification", "Due Feb 12", "cert"], ["CPR Certification", "Due Feb 13", "cert", true], ["Hep B", "Due Feb 14", "pulse"], ["Influenza", "Due Feb 15", "pulse"], ["TDaP", "Due Feb 16", "pulse"]];
const C5Head = ({ title, icon = "back" }: { title: string; icon?: IcName }) => <span className="c5-head"><Ic d={icon} /><b>{title}</b></span>;
const C5Hot = ({ t, n, d, tone }: { t: string; n: string; d: IcName; tone: "red" | "green" }) => <i className={`c5-hot c5-hot--${tone}`}><Ic d={d} /><b>{t}</b><u>{n}</u><Ic d="right" /></i>;
const C5Sorts = ({ all }: { all: string }) => <><span className="c5-sorts"><i>Sort: Category<Ic d="lines" /></i><i>Assignment: All<Ic d="lines" /></i></span><span className="c5-all">{all}</span></>;
const C5Group = ({ name, n, icon, open = false, solid = false }: { name: string; n: string; icon: IcName; open?: boolean; solid?: boolean }) => <i className="c5-g"><Ic d={icon} className={solid ? (icon === "earth" ? "is-earth" : "is-solid") : ""} /><b>{name}</b><em>{n}</em><Ic d={open ? "up" : "down"} /></i>;
const C5Item = ({ t, due, icon, bad = false }: { t: string; due: string; icon: IcName; bad?: boolean }) => <i className="c5-it"><Ic d={icon} /><span><b>{t}</b><small className={bad ? "is-bad" : undefined}>{due}</small></span>{bad && <u>EXPIRED</u>}<Ic d="right" /></i>;
const MORE: [string, IcName][] = [["Profile", "user"], ["Credentials", "hr"], ["Skill Checklists", "badge"], ["Resources", "form"], ["Housing & Travel", "bed"], ["Assignments", "kit"], ["Preferences", "gear"], ["Share & Refer", "share"], ["Rewards & Recognition", "award"]];
const PAY: [string, IcName][] = [["Payroll", "dollar"], ["Time Entry", "clock"], ["Reimbursements", "dollar"]];
const C5TABS: [string, IcName][] = [["Home", "home"], ["Jobs", "search"], ["Notifications", "bell"], ["Contacts", "people"], ["More", "menu"]];
const C5Box = ({ on = false }: { on?: boolean }) => <i className={on ? "c5-box is-on" : "c5-box"}>{on && <Ic d="check" />}</i>;

// A screen has a number and a title, no sentence: "We don't need these extra writing for all the screens" (fifth version).
export type StepT = { n: string; title: string; label: string; screen: ReactNode };
/* Sign-up and sign-in (01 to 09) follow the team's sheets as closely as the credential screens do: his
   "Yes redraw them". Each is drawn at the sheet's size, 375 x 812, and shown smaller (../amn5.css, .s5);
   every block sits at the height it has on the sheet, so `T(n)` is a distance from the top of the screen
   in the sheet's own pixels. The phone shows the top 774 of the 812, so the tab bar on Home is moved up
   to stay in view. The photograph under the purple, the avatar and the job photographs are stock stand-ins
   (see the note at the top of this file). */
export const T = (top: number, height?: number) => ({ top, height }) as CSSProperties;
export const S5Field = ({ top, label, value, bad = false, end }: { top: number; label: string; value?: ReactNode; bad?: boolean; end?: ReactNode }) => (
  <span className={`s5-f${bad ? " is-bad" : ""}${value ? "" : " is-null"}`} style={T(top)}>{value ? <><small>{label}</small><b>{value}</b></> : <b>{label}</b>}{end}</span>
);
export const S5Purple = ({ children, label }: { children?: ReactNode; label?: string }) => <span className="s5 s5--purple" data-photo={label}>{children}</span>;
export const S5Sheet = ({ top, height, children }: { top: number; height: number; children: ReactNode }) => (
  <span className="s5 s5--grey"><span className="s5-logo" style={T(71)}><Logo /></span><span className="s5-sheet" style={T(top, height)} />{children}</span>
);
const SignIn = ({ bad = false }: { bad?: boolean }) => (
  <S5Purple>
    {bad && <span className="s5-fail"><Ic d="alert" /><b>Sign In Failed</b><strong>Incorrect Email/Password Combination.</strong><small>Two (2) attempts remaining before account is locked</small></span>}
    <span className="s5-logo" style={T(108)}><Logo white /></span>
    <b className="s5-h" style={T(191)}>Sign in to your<br />account.</b>
    <S5Field top={294} label="Email" value="abc@gmail.com" bad={bad} />
    <S5Field top={389} label="Password" value={bad ? "*************" : "***********"} bad={bad} end={<Ic d="eye" />} />
    <span className="s5-btn s5-btn--in" style={T(483)}>Sign In</span>
    <span className="s5-finger" style={T(483)}><Ic d="finger" /></span>
    <small className="s5-link" style={T(563)}>Forgot Password<i />Sign In Help</small>
    <small className="s5-link" style={T(600)}>Create New Account</small>
  </S5Purple>
);
/* Sign-up and the verification screen take their field's value, so the demo on the work page
   (../../work/AmnDemo.tsx) can type into them; with nothing passed they are the sheets' own. */
export const SignUp = ({ email = "Janedoe@mail.com" }: { email?: ReactNode }) => (
  <S5Purple>
    <span className="s5-logo" style={T(69)}><Logo white /></span>
    <b className="s5-h" style={T(175)}>Thanks for<br />downloading our<br />mobile app.</b>
    <small className="s5-p" style={T(315)}>If you&rsquo;ve worked with AMN in the past<br />or are new to AMN, your email will help<br />us find or create your account.</small>
    <S5Field top={412} label="Email" value={email || undefined} />
    <span className="s5-btn" style={T(505)}>Next</span>
    <small className="s5-link" style={T(585)}>I already have an account</small>
    <small className="s5-link" style={T(623)}>Privacy Policy</small>
  </S5Purple>
);
export const Verify = ({ code }: { code?: ReactNode }) => (
  <S5Sheet top={151} height={481}>
    <b className="s5-h" style={T(179)}>Enter the verification code we emailed you</b>
    <b className="s5-mail" style={T(284)}>jane.doe@mail.com<Ic d="pen" /></b>
    <S5Field top={342} label="Verification Code" value={code || undefined} />
    <span className="s5-btn" style={T(441)}>Next</span>
    <span className="s5-btn s5-btn--line" style={T(507)}>Cancel</span>
    <small className="s5-links" style={T(580)}><i>Re-send Code</i><i>Privacy Policy</i></small>
  </S5Sheet>
);
export const SIGN_UP: StepT[] = [
  { n: "01", title: "The app opens", label: "The splash screen: AMN's mark on purple.", screen: <S5Purple><img className="s5-mark" src="/sketches/work/amn-mark.png" alt="" width="66" height="68" /></S5Purple> },
  { n: "02", title: "One field first", label: "Sign up: Thanks for downloading our mobile app, one Email field and a Next button.", screen: <SignUp /> },
  { n: "03", title: "A code proves the email", label: "User verification: Enter the verification code we emailed you, the email, a code field, Next and Cancel.", screen: <Verify /> },
  { n: "04", title: "The account", label: "Create your account: the email carried over, then contact information: legal first name, legal last name, mobile phone, country.",
    screen: <S5Sheet top={151} height={700}>
      <b className="s5-h" style={T(185)}>Create your account.</b>
      <small className="s5-p" style={T(245)}>Tell us a little more about yourself to create your account.</small>
      <b className="s5-mail" style={T(317)}>jane.doe@mail.com<Ic d="pen" /></b>
      <small className="s5-link" style={T(365)}>I already have an account</small>
      <small className="s5-cap" style={T(418)}>Contact Information</small>
      <S5Field top={452} label="Legal First Name" value="Jannie" />
      <S5Field top={551} label="Legal Last Name" value="Doe" />
      <S5Field top={650} label="Mobile Phone" value="(555) 555-5555" />
      <S5Field top={749} label="Country" value="USA" end={<Ic d="down" />} />
    </S5Sheet> },
  { n: "05", title: "Welcome", label: "The welcome screen: an illustration, Welcome, six dots and a Next button, with Skip in the corner.",
    screen: <span className="s5 s5--pale">
      <small className="s5-skip" style={T(40)}>SKIP</small>
      <span className="s5-trio" style={T(152)}><Trio /></span>
      <b className="s5-h" style={T(491)}>Welcome</b>
      <small className="s5-p" style={T(543)}>Designed by and for clinicians, AMN Navigate helps you find and manage your assignments.</small>
      <span className="s5-dots" style={T(665)}>{Array.from({ length: 6 }, (_, k) => <i key={k} className={k === 0 ? "is-on" : undefined} />)}</span>
      <span className="s5-btn" style={T(715)}>Next</span>
    </span> },
];
const HOME_TABS: [string, IcName][] = [["Home", "home"], ["Jobs", "search"], ["Notifications", "bell"], ["Contacts", "people"], ["More", "menu"]];
export const Home = () => (
  <span className="s5 s5--grey">
    <span className="s5-bar"><Logo /><img className="s5-me" src={PIC("jane.webp")} alt="" width="240" height="240" /></span>
    <span className="s5-sheet" style={T(104, 471)} />
    <span className="s5-who" style={T(127)}><Ic d="user" /></span>
    <b className="s5-h s5-h--s" style={T(204)}>Let&rsquo;s Complete<br />Your Profile</b>
    <span className="s5-segs" style={T(287)}>{Array.from({ length: 7 }, (_, k) => <i key={k} className={k < 2 ? "is-on" : undefined} />)}</span>
    <small className="s5-p s5-p--s" style={T(322)}>You&rsquo;ll be assigned a recruiter and can apply for jobs once all of the required fields are complete.</small>
    <span className="s5-todo" style={T(398)}>{["Personal Information", "Credentials & Education", "Work History"].map((t, k) => <i key={t} className={k < 1 ? "is-done" : undefined}><Ic d="check" />{t}</i>)}</span>
    <span className="s5-btn s5-btn--card" style={T(498)}>Complete My Profile</span>
    <span className="s5-jobs" style={T(590)}><b>Top Jobs</b><small>SEE ALL</small></span>
    <span className="s5-jobrow" style={T(624)}><Job tag="Mat. Child Health" tone="#008b95" pic="job-1.webp" /><Job tag="Exclusive" tone="#34b233" pic="job-2.webp" /></span>
    <span className="s5-tabs">{HOME_TABS.map(([t, d]) => <i key={t} className={t === "Home" ? "is-on" : undefined}><Ic d={d} /><small>{t}</small></i>)}</span>
  </span>
);
export const SIGN_IN: StepT[] = [
  { n: "06", title: "Sign in", label: "Sign in to your account: Email, Password, a Sign In button and a fingerprint button.", screen: <SignIn /> },
  { n: "07", title: "An error that says what is left", label: "Sign in failed: Incorrect Email/Password Combination. Two (2) attempts remaining before account is locked. Both fields are marked in red.", screen: <SignIn bad /> },
  { n: "08", title: "A new password", label: "Thanks for verifying your email: Password and Confirm Password fields, Next and Cancel.",
    screen: <S5Sheet top={151} height={570}>
      <b className="s5-h" style={T(185)}>Thanks for verifying your email.</b>
      <small className="s5-p" style={T(273)}>Create a password to secure your account.</small>
      <S5Field top={338} label="Password" end={<Ic d="eyeoff" />} />
      <S5Field top={437} label="Confirm Password" end={<Ic d="eyeoff" />} />
      <span className="s5-btn" style={T(531)}>Next</span>
      <span className="s5-btn s5-btn--line" style={T(597)}>Cancel</span>
      <small className="s5-link" style={T(666)}>Privacy Policy</small>
    </S5Sheet> },
  { n: "09", title: "Home opens on what is left", label: "Home for a new user: Let's Complete Your Profile with a progress bar and three parts, the first ticked, then Top Jobs and the tab bar.", screen: <Home /> },
];
export const CREDS: StepT[] = [
  { n: "10", title: "Open requirements come first", label: "The credential center: a search field, Open Requirements in a red card and DocuSign Envelopes in a green one, each with a count, then every kind of credential as a row with its icon and count.",
    screen: <span className="c5"><C5Head title="Credential Center" icon="x" /><span className="c5-cc">
      <span className="c5-find"><Ic d="search" />Search Credentials</span>
      <C5Hot t="Open Requirements" n="13" d="req" tone="red" />
      <C5Hot t="DocuSign Envelopes" n="2" d="inbox" tone="green" />
      {CENTRE.map(([t, n, d, flag]) => <i key={t} className="c5-row"><span className="c5-tile"><Ic d={d} />{flag && <u>!</u>}</span><b>{t}</b>{n && <em>{n}</em>}<Ic d="right" /></i>)}
    </span><span className="c5-fab"><Ic d="plus" /></span></span> },
  { n: "11", title: "Grouped by kind, with counts", label: "Open requirements: sort and assignment filters, then seven groups, each with a red bar, an icon and a count.",
    screen: <span className="c5"><C5Head title="Open Requirements" /><C5Sorts all="expand all" /><span className="c5-list">
      {GROUPS.map(([g, n, d, solid]) => <C5Group key={g} name={g} n={n} icon={d} solid={solid} />)}
    </span></span> },
  { n: "12", title: "A group opens in place", label: "Open requirements with Forms opened: Background Verification Disclosure and Tax Home Declaration, each with a due date, between the other six groups.",
    screen: <span className="c5"><C5Head title="Open Requirements" /><C5Sorts all="collapse all" /><span className="c5-list">
      <C5Group name="Document Uploads" n="5" icon="image" solid />
      <C5Group name="License Verification" n="2" icon="idcard" />
      <C5Group name="Forms" n="2" icon="form" open />
      <span className="c5-open"><C5Item t="Background Verification Disclosure" due="Due Feb 19" icon="form" /><C5Item t="Tax Home Declaration" due="Due Feb 21" icon="form" /></span>
      <C5Group name="Skills Checklist" n="1" icon="badge" />
      <C5Group name="Links" n="1" icon="earth" solid />
      <C5Group name="Education & Exams" n="1" icon="exam" />
      <C5Group name="Read-Only PDFs" n="1" icon="docl" />
    </span></span> },
  { n: "13", title: "Expired is marked", label: "Open requirements with Document Uploads opened: five items with due dates, the CPR certification marked Expired in red, then License Verification opened.",
    screen: <span className="c5"><C5Head title="Open Requirements" /><C5Sorts all="collapse all" /><span className="c5-list">
      <C5Group name="Document Uploads" n="5" icon="image" solid open />
      <span className="c5-open">{UPLOADS.map(([t, due, d, bad]) => <C5Item key={t} t={t} due={due} icon={d} bad={bad} />)}</span>
      <C5Group name="License Verification" n="2" icon="idcard" open />
      <span className="c5-open"><C5Item t="Licensure Verification" due="Due Feb 13" icon="idcard" /><C5Item t="Expiring Licensure" due="Due Feb 14" icon="idcard" /></span>
    </span></span> },
  { n: "14", title: "Two ways to answer", label: "A sheet for the TDaP vaccination record with two buttons: Upload, or Declination Form.",
    screen: <span className="c5 c5--dim"><span className="c5-modal">
      <Ic d="x" className="c5-x" />
      <Ic d="pulse" className="c5-big" />
      <b>TDaP</b>
      <small>Upload your Tetanus, Diphtheria &amp; Pertussis (TDAP) vaccination record</small>
      <span className="c5-btn">Upload</span>
      <em>or</em>
      <small>Complete the TDAP Declination Form</small>
      <span className="c5-btn">Declination Form</span>
    </span></span> },
  { n: "15", title: "Fixed from the phone", label: "The TDaP record after adding two files, each with a delete button: Add Document, a ticked box asking whether the upload satisfies other checklist requirements, and Submit for Approval.",
    screen: <span className="c5"><C5Head title="TDaP" /><span className="c5-rec">
      <span className="c5-card c5-up"><small>EMPLOYEE HEALTH</small><b>TDaP</b><em>Due: Oct 31</em><span>Upload your Tetanus, Diphtheria &amp; Pertussis (TDAP) vaccination record</span></span>
      <span className="c5-card c5-docs">
        <span className="c5-files"><i className="is-photo"><u><Ic d="trash" /></u></i><i className="is-pdf"><b>PDF</b><u><Ic d="trash" /></u></i></span>
        <span className="c5-add"><Ic d="plus" />Add Document</span>
      </span>
      <span className="c5-card c5-tick"><C5Box on />Does this upload satisfy other checklist requirements?</span>
      <small className="c5-sel">Select Checklist Items</small>
      <span className="c5-card c5-picks"><span><C5Box />Influenza</span><span><C5Box on />Hep B</span></span>
    </span><span className="c5-foot"><span className="c5-btn">Submit for Approval</span></span></span> },
  { n: "16", title: "The main menu", label: "The More menu: Profile, Credentials, Skill Checklists, Resources, Housing and Travel, Assignments, Preferences, Share and Refer, Rewards and Recognition, then Time and Pay: Payroll, Time Entry, Reimbursements. The tab bar is below with More selected.",
    screen: <span className="c5 c5--white"><span className="c5-head"><b>More</b><img className="c5-me" src={PIC("jane.webp")} alt="" width="240" height="240" /></span><span className="c5-menu">
      {MORE.map(([t, d]) => <i key={t}><Ic d={d} /><b>{t}</b><Ic d="right" /></i>)}
      <em>TIME &amp; PAY</em>
      {PAY.map(([t, d]) => <i key={t}><Ic d={d} /><b>{t}</b><Ic d="right" /></i>)}
    </span><span className="c5-tabs">{C5TABS.map(([t, d]) => <i key={t} className={t === "More" ? "is-on" : undefined}><Ic d={d} /><small>{t}</small></i>)}</span></span> },
];

/* ---------- ShiftWise: the staff list ---------- */
const STAFF: [string, string, string, string][] = [["Jane Doe", "jane.doe@mail.com", "Active", "NOC"], ["Sam Rivera", "sam.rivera@mail.com", "Inactive", "PM"], ["Maria Lopez", "maria.lopez@mail.com", "Inactive", "AM"], ["Alex Chen", "alex.chen@mail.com", "Active", "AM"], ["Priya Nair", "priya.nair@mail.com", "Active", "PM"], ["Chris Park", "chris.park@mail.com", "Active", "NOC"], ["Dana Brooks", "dana.brooks@mail.com", "Inactive", "NOC"], ["Lee Morgan", "lee.morgan@mail.com", "Inactive", "NOC"], ["Noor Haddad", "noor.haddad@mail.com", "Inactive", "NOC"], ["Tom Avery", "tom.avery@mail.com", "Inactive", "NOC"]];
const NAV: [string, boolean][] = [["Orders", true], ["Staff", true], ["Timeslips", false], ["Accounting", true], ["Reports", false], ["Organization", true]];
const DROPS = ["Vendor Type", "Organization", "Discipline", "Specialty", "Shift"];
const COLS = ["Staff", "Vendor", "Email", "Discipline", "Specialty", "Status", "Shift", "Calendar", "Unit Verification", "Order Match", "Order Check", ""];
const Pager = () => <span className="a3-pager"><span><Ic d="back" />{["1", "2", "3", "4", "5", "…", "10"].map((p, k) => <i key={k} className={k === 0 ? "is-on" : undefined}>{p}</i>)}<Ic d="right" /></span><small className="a3-per">10<Ic d="down" /> items per page</small><small>1 of 1 page(s)</small></span>;
const Switch = ({ off = false }: { off?: boolean }) => <span className={off ? "a3-switch is-off" : "a3-switch"}><i className="is-on">Active</i><i>Inactive</i></span>;
const StaffCard = ({ name, mail, status, shift }: { name: string; mail: string; status: string; shift: string }) => (
  <span className="a3-sc">
    <span className="a3-sc-h"><b>{name}</b><Ic d="cal" /><Ic d="copy" /><Ic d="okc" /><Ic d="dots" className="a3-kebab" /></span>
    <small>Vendor</small><i>Saturn Staffing</i>
    <small>Email</small><i className="is-link">{mail}</i>
    <small>Discipline</small><i>Accounting, Accounts Payable Cle&hellip;</i>
    <small>Specialty</small><i>Burns, ER I, ER IV, ICU, Psychiatrist&hellip;</i>
    <span><span><small>Status</small><i>{status}</i></span><span><small>Shift</small><i>{shift}</i></span></span>
    <small>Order Match</small><i className="is-link is-u">Match</i>
  </span>
);
/* view: the default overview (empty), the results as a grid, or the results as cards.
   size: d = desktop, t = tablet, m = phone. */
export const Wise = ({ view, size = "d", n = 10, label }: { view: "empty" | "grid" | "cards"; size?: "d" | "t" | "m"; n?: number; label: string }) => (
  <div className={`pp a3-win a3-win--${size} a3-win--${view}`} role="img" aria-label={label}>
    {size === "m" ? <span className="a3-wbar"><b className="a3-wlogo">ShiftWise</b><i>Staff</i><Ic d="menu" /></span> : <>
      <span className="a3-wtop"><b className="a3-wlogo">ShiftWise</b><span className="a3-wwel">Welcome <u>Jane Doe</u> Organization: <u>Happy Valley Healthcare (Demo/QA Account)</u></span><span className="a3-wlinks"><i>HOME</i><i>ADMIN</i><i>SUPPORT</i><i>LOGOUT</i></span></span>
      <span className="a3-wnav">{NAV.slice(0, size === "t" ? 4 : 6).map(([t, more]) => <i key={t} className={t === "Staff" ? "is-on" : undefined}>{t}{more && <Ic d="down" />}</i>)}{size === "t" && <i>&middot;&middot;&middot;<Ic d="down" /></i>}</span>
    </>}
    <span className="a3-wbody">
      <b className="a3-wtitle">Staff</b>
      <span className="a3-panel">
        <span className="a3-wtabs"><i className="is-on">All</i><i>Name Clear</i>{size !== "m" && <i>No Client Return</i>}</span>
        {view !== "cards" && <span className="a3-tools"><span className="a3-find"><Ic d="search" />Search Staff Name</span>{DROPS.map((d) => <i key={d}>{d}<Ic d="down" /></i>)}<span className="a3-reset"><Ic d="reset" /></span><Switch off={view === "empty"} /></span>}
        <span className="a3-count"><b>Staff ({view === "empty" ? 0 : 45})</b>{view === "grid" && <span><Ic d="filter" /><Ic d="rows" /><Ic d="grid" /><i>Export<Ic d="down" /></i><i>Columns<Ic d="down" /></i></span>}{view === "cards" && size !== "m" && <Switch />}</span>
        {view !== "cards" && <span className="a3-grid">
          <span className="a3-grid-h">{COLS.map((c) => <i key={c}>{c}</i>)}</span>
          {view === "grid" && STAFF.slice(0, n).map(([name, mail, status, shift]) => <span key={name}><i className="is-name">{name}</i><i>Saturn Staffing</i><i className="is-link is-u">{mail}</i><i>Accounting, Accounts Payable Cle&hellip;</i><i>Burns, ER I, ER IV, ICU, Psychiatrist&hellip;</i><i>{status}</i><i>{shift}</i><i className="is-ic"><Ic d="cal" /></i><i className="is-ic"><Ic d="copy" /></i><i className="is-link is-u">Match</i><i className="is-ic"><Ic d="okc" /></i><i className="is-ic"><Ic d="dots" className="a3-kebab" /></i></span>)}
          {view === "empty" && <span className="a3-none"><Trio /><b>Select the appropriate search to narrow your list results and click Search</b></span>}
        </span>}
        {view === "cards" && <span className="a3-scs">{STAFF.slice(0, n).map(([name, mail, status, shift]) => <StaffCard key={name} name={name} mail={mail} status={status} shift={shift} />)}</span>}
        {view !== "empty" && <Pager />}
      </span>
    </span>
  </div>
);
export { Tick };
