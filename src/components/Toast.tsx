import { ToastOptions } from '@/types'
import useTranslation from '@/hooks/useTranslation'
import * as ToastPrimitive from '@radix-ui/react-toast'

export default function Toast({ title, action, description }: ToastOptions) {
  const { t } = useTranslation()

  return (
    <ToastPrimitive.Root
      type="foreground"
      className="toast-swipe-end toast-closed toast-move toast-cancel toast-slindein relative flex flex-col items-start rounded-md border bg-white px-4 py-2 shadow-lg dark:border-gray-50/5 dark:bg-zinc-900"
    >
      {title && (
        <ToastPrimitive.Title className="text-md font-medium">
          {title}
        </ToastPrimitive.Title>
      )}
      {description && (
        <ToastPrimitive.Description asChild>
          <p className="m-0 text-sm leading-tight">{description}</p>
        </ToastPrimitive.Description>
      )}
      <div className="mt-4 flex w-full items-center justify-end gap-1">
        {action && (
          <ToastPrimitive.Action
            altText="Toast action"
            onClick={action.callback}
            className="simple-btn py-1 text-xs"
          >
            {action.text}
          </ToastPrimitive.Action>
        )}
        <ToastPrimitive.Close className="simple-btn py-1 text-xs">
          {t('dismiss')}
        </ToastPrimitive.Close>
      </div>
    </ToastPrimitive.Root>
  )
}
