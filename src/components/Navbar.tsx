import UserMenu from './UserMenu'
import LangSwitcher from './LangSwitcher'

export default function Navbar() {
  return (
    <nav className="fixed w-full bg-zinc-50/70 px-4 py-2 backdrop-blur-md dark:bg-zinc-900/70">
      <div className="mx-auto flex flex-wrap items-center justify-between">
        <h4 className="text-lg font-semibold">AppointMan</h4>
        <div className="flex gap-2">
          <LangSwitcher />
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}
