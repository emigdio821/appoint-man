import * as RadixToast from '@radix-ui/react-toast'

interface ToastProps {
  isOpen: boolean
  setOpen: (opt: boolean) => void
}

export default function Toast({ isOpen, setOpen }: ToastProps) {
  return (
    <>
      <RadixToast.Root
        open={isOpen}
        type="foreground"
        onOpenChange={setOpen}
        className="toast-swipe-end toast-closed toast-move toast-cancel toast-slindein grid grid-cols-[auto_max-content] items-center gap-x-4 rounded-md bg-white p-4 shadow-lg dark:bg-zinc-800"
      >
        <RadixToast.Title className="mb-1 text-sm font-medium">
          Scheduled: Catch up
        </RadixToast.Title>
        <RadixToast.Description asChild>
          <p className="m-0 text-ssm leading-tight">Im a description, sup!</p>
        </RadixToast.Description>
        <RadixToast.Close>
          <button>Close!</button>
        </RadixToast.Close>
      </RadixToast.Root>
      <RadixToast.Viewport className="fixed bottom-0 right-0 z-50 m-0 flex w-96 max-w-[100vw] list-none flex-col gap-2 p-4" />
    </>
  )
}
