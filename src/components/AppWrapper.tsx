import Navbar from './Navbar'

interface WrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: WrapperProps) {
  return (
    <div className="flex justify-center">
      <Navbar />
      <div className="w-full p-4 pt-[4.5rem]">{children}</div>
    </div>
  )
}
