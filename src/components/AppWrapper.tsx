interface WrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: WrapperProps) {
  return (
    <div className="flex justify-center">
      <div className="w-full p-4 pt-16">{children}</div>
    </div>
  )
}
