'use client'

/* Thin wrapper around the design system's CareerHubShell so each prototype
   page just passes title / secondary / actions.
   - Uses the real EMPLOYEE_NON_MANAGER_TABS / MANAGER_TABS so the navbar
     reads exactly like the production CareerHub. A single "Team" tab is
     added (or wired into MANAGER_TABS' existing My Team) and houses our
     3 prototype screens as sub-tabs underneath.
   - Wires Next.js's <Link> into the Navbar's LinkComponent slot so client-
     side routing works.
   - Renders an in-flow navbar via the .header-assembled-ch-shell pattern. */

import NextLink from 'next/link'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import {
  CareerHubShell,
  EMPLOYEE_AVATAR_MENU_ITEMS,
  EMPLOYEE_NON_MANAGER_TABS,
  MANAGER_TABS,
  getNavbarProductConfig,
} from '@tonyh-2-eightfold/ef-design-system'
import type { NavbarTab, NavbarUser } from '@tonyh-2-eightfold/ef-design-system'
import { usePrototype } from '../_lib/PrototypeContext'
import { useFittedTabs } from '../_lib/useFittedTabs'
import { MOCK_DATA } from '../_lib/mock-data'

/* Add a "Team" tab to the employee navbar (employees don't ship with one
   by default — but the prototype's 3 screens live under it). Alex has no
   reports so this is a flat link straight to /careerhub/team/sync. */
const ALEX_TABS: NavbarTab[] = [
  ...EMPLOYEE_NON_MANAGER_TABS.filter((t) => t.id !== 'people'),
  { id: 'team', label: 'Team', path: '/careerhub/team/sync' },
  { id: 'people', label: 'People', path: '/people' },
]

/* For Sam, replace the existing "My team" tab with a "Team" tab whose
   chevron menu lets him choose between "My manager" (his own 1-on-1 with
   Pat) and "My team" (drill into a direct report's view). */
const SAM_TABS: NavbarTab[] = MANAGER_TABS.map<NavbarTab>((t) => {
  if (t.id !== 'my-team') return t
  return {
    id: 'team',
    label: 'Team',
    path: '/careerhub/team',
    chevron: true,
    hideViewAll: true,
    subItems: [
      { label: 'My manager', path: '/careerhub/team/sync?subject=sam-with-pat' },
      { label: 'My team', path: '/careerhub/team' },
    ],
  }
})

function NavLink({
  to,
  children,
  className,
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  return (
    /* prefetch={false}: the navbar shows the real product tabs, but only
       the Team routes exist in this prototype — prefetching the rest
       fills the console with 404s on the deployed site. */
    <NextLink href={to} className={className} prefetch={false}>
      {children}
    </NextLink>
  )
}

export interface PrototypeShellProps {
  title: ReactNode
  secondary?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export function PrototypeShell({
  title,
  secondary,
  actions,
  children,
}: PrototypeShellProps) {
  const { persona } = usePrototype()
  const pathname = usePathname() ?? ''
  const careerHubLogo = getNavbarProductConfig('career-hub')

  const personaUser = persona === 'alex' ? MOCK_DATA.currentUser : MOCK_DATA.manager
  const user: NavbarUser = {
    name: personaUser.name,
    avatarType: 'initials',
    avatarInitials: personaUser.avatarInitials,
  }

  const allTabs = persona === 'alex' ? ALEX_TABS : SAM_TABS
  /* Greedy fit-to-width: items that don't fit go into a "More" tab;
     no "More" appears when everything fits at the current viewport. */
  const tabs = useFittedTabs(allTabs)
  /* Highlight the Team tab whenever we're inside any /careerhub/team route. */
  const activeTab =
    pathname.startsWith('/careerhub/team') ? tabs.find((t) => t.id === 'team') : undefined

  return (
    <div className="header-assembled-ch-shell prototype-careerhub-shell">
      <CareerHubShell
        chSize="parent"
        title={title}
        secondary={secondary}
        actions={actions}
        navbarProps={{
          tabs,
          activePath: activeTab?.path,
          user,
          avatarMenuItems: EMPLOYEE_AVATAR_MENU_ITEMS,
          productName: careerHubLogo.productName,
          productIconSrc: careerHubLogo.productIconSrc,
          homePath: '/careerhub/team/sync',
          LinkComponent: NavLink,
        }}
      >
        {children}
      </CareerHubShell>
    </div>
  )
}
