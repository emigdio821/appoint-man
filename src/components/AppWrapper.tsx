interface WrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: WrapperProps) {
  return (
    <div className="mx-auto flex max-w-4xl justify-center">
      <div className="w-full p-4 pt-16">{children}</div>
    </div>
  )
}
