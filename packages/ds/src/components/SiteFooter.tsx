export type SocialLink = {
  label: string;
  href: string;
};

export type SiteFooterProps = {
  /** Display name / brand shown large at the top. */
  name: string;
  role?: string;
  location?: string;
  /** Intro line above the contact details. */
  contactIntro?: string;
  email?: string;
  phone?: string;
  socials?: SocialLink[];
};

export default function SiteFooter({
  name,
  role,
  location,
  contactIntro,
  email,
  phone,
  socials = [],
}: SiteFooterProps) {
  return (
    <footer className="w-full bg-[color:var(--color-footer-blue)] text-white">
      <div className="pad-footer-inner mx-auto w-full max-w-[1440px]">
        <div className="max-w-[555px]">
          <h3 className="t-footer-brand">{name}</h3>
          {role && <p className="mt-3 t-footer-role">{role}</p>}
          {location && <p className="mt-3 t-footer-meta">{location}</p>}

          {contactIntro && (
            <p className="mt-[80px] t-footer-meta">{contactIntro}</p>
          )}
          {email && <p className="mt-6 t-footer-contact">{email}</p>}
          {phone && <p className="mt-2 t-footer-contact">{phone}</p>}

          {socials.length > 0 && (
            <div className="mt-[120px] flex items-center gap-4 t-footer-social">
              {socials.map((social, i) => (
                <span key={social.href} className="flex items-center gap-4">
                  {i > 0 && <span className="opacity-60">|</span>}
                  <a href={social.href} className="hover:underline">
                    {social.label}
                  </a>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
