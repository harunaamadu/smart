import { footerDirectory, footerNav } from "@/lib/cms/catalog";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "./site-header";
import { AppLink, SocialLinks } from "../shared";
import { websiteName } from "@/lib/cms";
import { capitalize } from "@/lib/formats";

export function Footer() {
  return (
    <footer className="mt-10 bg-accent px-4">
      <div className="border-y border-border/90 py-8 text-foreground">
        <div className="container mx-auto">
          <h2 className="mb-5 text-lg font-semibold">Brand directory</h2>
          <div className="flex flex-col gap-3">
            {footerDirectory.map((row) => (
              <div
                key={row.title}
                className="flex flex-wrap items-baseline gap-x-1 gap-y-1 text-sm"
              >
                <h3 className="mr-2 font-semibold">{row.title}</h3>
                {row.links.map((link, i) => (
                  <span key={`${link}-${i}`} className="text-muted">
                    <Link
                      to="/shop"
                      search={{ q: link }}
                      className="capitalize text-muted-foreground hover:text-primary dark:hover:text-foreground"
                    >
                      {link}
                    </Link>
                    {i < row.links.length - 1 ? (
                      <span className="mx-1 text-line">|</span>
                    ) : null}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-border/90 py-10">
        <div className="container mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-6 text-foreground">
          {footerNav.map((col) => (
            <ul key={col.title} className="flex flex-col gap-2">
              <li>
                <h2 className="mb-2 text-sm font-semibold">{col.title}</h2>
              </li>
              {col.links.map((l) => (
                <li key={l.label}>
                  <AppLink
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-primary dark:hover:text-foreground"
                  >
                    {l.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          ))}
          <ul className="flex flex-col gap-3">
            <li>
              <h2 className="mb-2 text-sm font-semibold">Contact</h2>
            </li>
            <li className="flex gap-3 text-sm text-muted-foreground hover:text-primary dark:hover:text-foreground">
              <MapPin className="mt-0.5 size-5 shrink-0 text-foreground" />
              <address className="not-italic leading-relaxed">
                419 State 414 Rte Beaver Dams, New York(NY), 14812, USA
              </address>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Phone className="size-5 text-foreground" />
              <a
                href="tel:+16079368058"
                className="text-muted-foreground hover:text-primary dark:hover:text-foreground"
              >
                (607) 936-8058
              </a>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Mail className="size-5 text-foreground" />
              <a
                href="mailto:example@gmail.com"
                className="text-muted-foreground hover:text-primary dark:hover:text-foreground"
              >
                example@gmail.com
              </a>
            </li>
          </ul>
          <div>
            <h2 className="mb-3 text-sm font-semibold text-ink">Follow Us</h2>
            <SocialLinks />
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <p className="text-center text-sm text-muted-foreground">
          Copyright &copy; {new Date().getFullYear()} <b className="text-foreground">{capitalize(websiteName)}</b>.
          All Rights Reserved.
        </p>
        <img
          src="/images/payment.png"
          alt="Accepted payment methods"
          className="h-6 w-auto"
        />
      </div>

      {/* mobile nav space */}
      <div className="block md:hidden w-full h-16" />
    </footer>
  );
}
