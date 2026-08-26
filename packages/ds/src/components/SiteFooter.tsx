export type SiteFooterProps = {
  /** Right-hand text in the footer baseline row (e.g. the bubble-wrap hint). */
  tagline?: string;
};

export default function SiteFooter({ tagline }: SiteFooterProps) {
  return (
    <footer className="site">
      <div className="inner">
        <div>
          <h2>Dinesh Revunuru</h2>
          <div className="role">Senior Product Designer</div>
          <div className="role sub">Chicago, IL USA</div>
          <p className="intro">
            If you are thinking about hiring me or would like to
            <br />
            discuss a project, get in touch with me at,
          </p>
          <a className="mail" href="mailto:dineshrevunuru@gmail.com">
            dineshrevunuru@gmail.com
          </a>
          <div className="phone">+1 (312) 838-4876</div>
          <div className="socials">
            <a href="https://www.linkedin.com/in/dinesh-revunuru/">LinkedIn</a>
            <span aria-hidden="true">|</span>
            <a href="https://www.instagram.com/dinesh_revunuru/">Instagram</a>
            <span aria-hidden="true">|</span>
            <a href="https://twitter.com/dinesh_revunuru/">Twitter</a>
          </div>
        </div>
      </div>
      <div className="base">
        <span>&copy; 2026 Dinesh Revunuru</span>
        <span>{tagline}</span>
      </div>
    </footer>
  );
}
