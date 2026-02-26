export const navItems = [
  {
    labelKey: "nav.sections.association",
    links: [
      { href: "/hallitus", labelKey: "nav.links.board" },
      { href: "/tiedotus", labelKey: "nav.links.communications" },
      { href: "/saannot", labelKey: "nav.links.rules" },
      { href: "/talous", labelKey: "nav.links.finances" },
      { href: "/tunnukset", labelKey: "nav.links.credentials" },
      { href: "/vaalijarjestys", labelKey: "nav.links.electionOrder" },
      { href: "/tilinumerot", labelKey: "nav.links.accountNumbers" },
      { href: "/yhteystiedot", labelKey: "nav.links.contact" },
      { href: "/brandiohje", labelKey: "nav.links.brandGuide" },
      {
        href: "https://arkisto.tko-aly.fi/",
        labelKey: "nav.links.archive",
        external: true,
      },
      {
        href: "https://bbat.tko-aly.fi/",
        labelKey: "nav.links.debtsPayments",
        external: true,
      },
    ],
  },
  {
    labelKey: "nav.sections.activities",
    links: [
      { href: "/edunvalvonta", labelKey: "nav.links.advocacy" },
      { href: "/sitsit", labelKey: "nav.links.sitsit" },
      { href: "/vuosijuhlat", labelKey: "nav.links.annualParty" },
      { href: "/liikunta", labelKey: "nav.links.sports" },
      { href: "/ruokavalitys", labelKey: "nav.links.foodDelivery" },
      { href: "/README", labelKey: "nav.links.readme" },
      {
        href: "https://blog.tko-aly.fi/",
        labelKey: "nav.links.blog",
        external: true,
      },
    ],
  },
  {
    labelKey: "nav.sections.events",
    links: [
      { href: "/kalenteri", labelKey: "nav.links.calendar" },
      { href: "/lisaa-tapahtuma", labelKey: "nav.links.addEvent" },
    ],
  },
  {
    labelKey: "nav.sections.safety",
    links: [
      { href: "/hairinta", labelKey: "nav.links.harassment" },
      {
        href: "https://www.tko-aly.fi/attachments/files/399/Yhdenvertaisuussuunnitelma_2024.pdf?1715249780",
        labelKey: "nav.links.equality",
        external: true,
      },
      { href: "/tietosuoja", labelKey: "nav.links.privacyPolicy" },
    ],
  },
  {
    labelKey: "nav.sections.forFreshmen",
    links: [
      { href: "/jaseneksi", labelKey: "nav.links.applyMembership" },
      {
        href: "https://fuksiwiki.tko-aly.fi/Fuksiwiki",
        labelKey: "nav.links.fuksiwiki",
        external: true,
      },
      { href: "/fuksi-info", labelKey: "nav.links.fuksiInfo" },
      {
        href: "https://passi.tko-aly.fi/",
        labelKey: "nav.links.fuksiPassi",
        external: true,
      },
    ],
  },
  {
    labelKey: "nav.sections.companies",
    links: [
      {
        href: "https://jobs.tko-aly.fi/en/list/open",
        labelKey: "nav.links.jobs",
        external: true,
      },
      { href: "/yrityksille", labelKey: "nav.links.forCompanies" },
    ],
  },
]

export const userNavItems = [
  { href: "/u/muokkaa", labelKey: "nav.links.editProfile" },
  { href: "/u/jasenmaksu", labelKey: "nav.links.memberInvoice" },
]
