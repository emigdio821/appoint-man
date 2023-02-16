import clsx from 'clsx'
import { forwardRef } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { BiCheck, BiChevronDown, BiChevronUp } from 'react-icons/bi'

type SelectProps = {
  className?: string
  placeholder?: string
  icon?: React.ReactNode
  children: React.ReactNode
} & React.ComponentProps<typeof SelectPrimitive.Root>

type SelectItemProps = {
  children: React.ReactNode
} & React.ComponentProps<typeof SelectPrimitive.Item>

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          ref={forwardedRef}
          className={clsx(
            'simple-input inline-flex w-full items-center justify-between gap-2 text-sm',
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={props.placeholder} />
          <SelectPrimitive.Icon>
            {props.icon ? props.icon : <BiChevronDown />}
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            align="end"
            sideOffset={5}
            position="popper"
            className="overflow-hidden rounded-md border bg-white shadow-md dark:border-none dark:bg-zinc-800"
          >
            <SelectPrimitive.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-white dark:bg-zinc-800">
              <BiChevronUp />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="p-2">
              {children}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-white dark:bg-zinc-800">
              <BiChevronDown />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    )
  },
)
Select.displayName = 'Select'

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Item
        {...props}
        ref={forwardedRef}
        className={clsx(
          'relative flex h-6 select-none items-center rounded-md pr-8 pl-6 text-sm leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-100 data-[disabled]:text-zinc-300 data-[highlighted]:outline-none data-[highlighted]:dark:bg-zinc-700/50 data-[disabled]:dark:text-zinc-600',
          className,
        )}
      >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
          <BiCheck />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    )
  },
)
SelectItem.displayName = 'SelectItem'
