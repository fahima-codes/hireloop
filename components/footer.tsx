import { Globe } from 'lucide-react';

// lucide does not ship brand icons anymore — inline the social SVG paths
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

function Logo() {
  return (
    <a
      href="#"
      className="flex shrink-0 items-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="text-2xl font-bold leading-none tracking-tight">
        <span className="text-sky-400">hire</span>
        <span className="text-orange-500">l</span>
        <Globe
          aria-hidden="true"
          className="mx-px inline-block size-[23px] translate-y-1 text-sky-400"
          strokeWidth={2.5}
        />
        <span className="text-orange-500">p</span>
      </span>
    </a>
  );
}

const columns = [
  {
    title: 'Product',
    links: ['Job discovery', 'Worker AI', 'Companies', 'Salary data'],
  },
  {
    title: 'Navigations',
    links: ['Help center', 'Career library', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Brand Guideline', 'Newsroom'],
  },
];

const socials = [
  { label: 'Facebook', icon: FacebookIcon, href: '#', highlighted: false },
  { label: 'Pinterest', icon: PinterestIcon, href: '#', highlighted: true },
  { label: 'LinkedIn', icon: LinkedinIcon, href: '#', highlighted: false },
];

const headingClass =
  'text-sm font-medium text-indigo-400 outline-none focus-visible:ring-3 focus-visible:ring-ring/50';

const linkClass =
  'rounded-lg text-sm text-zinc-400 outline-none transition-colors hover:text-zinc-100 focus-visible:ring-3 focus-visible:ring-ring/50';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950 px-4 pb-8 pt-14 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        {/* Left: logo, tagline, socials */}
        <div className="flex max-w-md flex-col justify-between gap-10">
          <div>
            <Logo />
            <p className="mt-4 max-w-64 text-sm leading-6 text-zinc-400">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>
          </div>
          <div className="flex gap-3">
            {socials.map(social => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={
                    social.highlighted
                      ? 'grid size-9 place-items-center rounded-lg bg-indigo-500 text-white outline-none transition-colors hover:bg-indigo-400 focus-visible:ring-3 focus-visible:ring-ring/50'
                      : 'grid size-9 place-items-center rounded-lg bg-white/[0.06] text-zinc-300 outline-none transition-colors hover:bg-white/10 hover:text-zinc-100 focus-visible:ring-3 focus-visible:ring-ring/50'
                  }
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right: link columns */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {columns.map(column => (
            <nav key={column.title} aria-label={column.title}>
              <a href="#" className={headingClass}>
                {column.title}
              </a>
              <ul className="mt-5 flex flex-col gap-4">
                {column.links.map(link => (
                  <li key={link}>
                    <a href="#" className={linkClass}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom: copyright + policies */}
      <div className="mt-14 flex flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-end sm:gap-8">
        <span>Copyright 2024 —Programming Hero</span>
        <a href="#" className={linkClass}>
          Terms &amp; Policy - Privacy Guideline
        </a>
      </div>
    </footer>
  );
}
