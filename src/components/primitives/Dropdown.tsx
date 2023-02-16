import { forwardRef } from 'react'
import { BiCheck, BiMinus } from 'react-icons/bi'
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'

type DDMenuContentProps = React.ComponentProps<typeof DropdownPrimitive.Content>
type DDCheckboxItemProps = React.ComponentProps<
  typeof DropdownPrimitive.CheckboxItem
>
type DDRadioItem = React.ComponentProps<typeof DropdownPrimitive.RadioItem>

export const Dropdown = DropdownPrimitive.Root
export const DropdownItem = DropdownPrimitive.Item
export const DropdownLabel = DropdownPrimitive.Label
export const DropdownGroup = DropdownPrimitive.Group
export const DropdownTrigger = DropdownPrimitive.Trigger
export const DropdownSeparator = DropdownPrimitive.Separator
export const DropdownRadioGroup = DropdownPrimitive.RadioGroup

export const DropdownContent = forwardRef<HTMLDivElement, DDMenuContentProps>(
  ({ children, ...props }, forwardedRef) => (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        {...props}
        align="end"
        sideOffset={5}
        ref={forwardedRef}
        className="min-w-[100px] rounded-md bg-white p-2 shadow-md outline-none duration-300 dark:bg-zinc-800"
      >
        {children}
        {/* <DropdownPrimitive.Arrow /> */}
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Portal>
  ),
)
DropdownContent.displayName = 'DropdownContent'

export const DropdownCheckboxItem = forwardRef<
  HTMLDivElement,
  DDCheckboxItemProps
>(({ children, ...props }, forwardedRef) => (
  <DropdownPrimitive.CheckboxItem {...props} ref={forwardedRef}>
    {children}
    <DropdownPrimitive.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
      {props.checked === 'indeterminate' && <BiMinus />}
      {props.checked === true && <BiCheck />}
    </DropdownPrimitive.ItemIndicator>
  </DropdownPrimitive.CheckboxItem>
))
DropdownCheckboxItem.displayName = 'DropdownCheckboxItem'

export const DropdownRadioItem = forwardRef<HTMLDivElement, DDRadioItem>(
  ({ children, ...props }, forwardedRef) => (
    <DropdownPrimitive.RadioItem {...props} ref={forwardedRef}>
      {children}
      <DropdownPrimitive.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
        <BiCheck />
      </DropdownPrimitive.ItemIndicator>
    </DropdownPrimitive.RadioItem>
  ),
)
DropdownRadioItem.displayName = 'DropdownRadioItem'
