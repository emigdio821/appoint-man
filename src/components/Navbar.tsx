import Link from 'next/link'
import UserMenu from './UserMenu'
import LangSwitcher from './LangSwitcher'
import { BiCalendarCheck } from 'react-icons/bi'

export default function Navbar() {
  return (
    <nav className="fixed w-full bg-zinc-50/70 py-2 backdrop-blur-md dark:bg-zinc-900/70">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between px-4">
        <Link
          href="/"
          className="text-md flex items-center gap-1 font-semibold opacity-90 hover:opacity-100"
        >
          <BiCalendarCheck />
          <div>
            <span className="font-bold">appoint</span>
            <span>man</span>
          </div>
        </Link>
        <div className="flex gap-2">
          <LangSwitcher />
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}
