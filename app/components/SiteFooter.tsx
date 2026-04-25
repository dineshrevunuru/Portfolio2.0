export default function SiteFooter() {
  return (
    <footer className="w-full bg-[color:var(--color-footer-blue)] text-white">
      <div className="pad-footer-inner mx-auto w-full max-w-[1440px]">
        <div className="max-w-[555px]">
          <h3 className="t-footer-brand">Dinesh Revunuru</h3>
          <p className="mt-3 t-footer-role">UI UX Designer</p>
          <p className="mt-3 t-footer-meta">Chicago, IL USA</p>

          <p className="mt-[80px] t-footer-meta">
            If you are thinking about hiring me or would like to discuss a
            project, get in touch with me at,
          </p>
          <p className="mt-6 t-footer-contact">dineshrevunuru@gmail.com</p>
          <p className="mt-2 t-footer-contact">+1 (312) 838-4876</p>

          <div className="mt-[120px] flex items-center gap-4 t-footer-social">
            <a
              href="https://www.linkedin.com/in/dinesh-revunuru/"
              className="hover:underline"
            >
              LinkedIn
            </a>
            <span className="opacity-60">|</span>
            <a
              href="https://www.instagram.com/dinesh_revunuru/"
              className="hover:underline"
            >
              Instagram
            </a>
            <span className="opacity-60">|</span>
            <a
              href="https://x.com/dinesh_revunuru"
              className="hover:underline"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
