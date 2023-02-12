import UserMenu from './UserMenu'
import LangSwitcher from './LangSwitcher'

export default function Navbar() {
  return (
    <nav className="fixed w-full bg-gray1/90 px-4 py-2 backdrop-blur-md dark:bg-gray12/90">
      <div className="mx-auto flex flex-wrap items-center justify-between">
        <h4 className="text-blackA12 dark:text-gray-100">AppointMan</h4>
        <div className="order-2 flex gap-2">
          <LangSwitcher />
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}
