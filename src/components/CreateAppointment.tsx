import clsx from 'clsx'
import axios from 'axios'
import { useState } from 'react'
import useUserStore from '@/stores/user'
import { useForm } from 'react-hook-form'
import * as Dialog from '@radix-ui/react-dialog'
import { useToastManager } from '@/context/toast'
import { LocaleKey, EventPayload } from '@/types'
import { appointmentsSchema } from '@/form-schemas'
import useTranslation from '@/hooks/useTranslation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSession } from '@supabase/auth-helpers-react'
import { BiX, BiCalendarEvent, BiLoaderAlt } from 'react-icons/bi'

interface FormValues {
  summary: string
  description: string
  date: string
  time: string
}

function roundToNearest1hr() {
  const minutes = 60
  const ms = 1000 * 60 * minutes

  return new Date(Math.ceil(new Date().getTime() / ms) * ms)
}

export default function CreateAppointment() {
  const { user } = useUserStore()
  const session = useSession()
  const { showToast } = useToastManager()
  const { t, locale } = useTranslation()
  const [opened, setOpened] = useState(false)

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(appointmentsSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const eventPayload: EventPayload = {
      summary: values.summary,
      description: values.description,
      start: {
        dateTime: values.date,
        timeZome: timezone,
      },
      end: {
        dateTime: '',
        timeZone: timezone,
      },
    }
    try {
      const event = await axios.post('/api/google/create-event', {
        event: eventPayload,
        providerToken: user?.providerRefreshToken,
      })

      showToast({ title: t('success'), description: t('appointmentCreated') })
    } catch (error) {
      console.error(error)
      showToast({ title: 'Error', description: t('error') })
    }
  })

  return (
    <Dialog.Root
      open={opened}
      onOpenChange={(isOpen) => {
        console.log(isOpen)
        if (!isOpen) {
          setOpened(false)
          reset()
        }
      }}
    >
      <Dialog.Trigger asChild>
        <button className="simple-btn text-sm" onClick={() => setOpened(true)}>
          Create Appointment
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 animate-overlayShow bg-blackA9 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-2/4 left-2/4 max-h-[85vh] w-[90vw] max-w-md -translate-x-2/4 -translate-y-2/4 animate-contentShow rounded-md bg-white p-6 shadow-md focus:outline-none data-[state=closed]:animate-contentHide dark:bg-zinc-900">
          <Dialog.Title className="text-lg font-semibold">
            Create Appointment
          </Dialog.Title>
          {/* <Dialog.Description className="text-sm leading-tight opacity-70">
            Make changes to your profile here. Click save when you're done.
            Another test, bla bla bla.
          </Dialog.Description> */}
          <div className="mt-4">
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Summary"
                  {...register('summary')}
                  className={clsx('simple-input text-sm', {
                    'dark:border-zinc-800': !errors.summary,
                    'border-red-400 text-red-400': errors.summary,
                  })}
                />
                {errors.summary && (
                  <p className="text-xs text-red-400">
                    {t(errors.summary.message as LocaleKey)}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <textarea
                  placeholder="Description"
                  {...register('description')}
                  className={clsx('simple-input resize-none text-sm', {
                    'dark:border-zinc-800': !errors.description,
                    'border-red-400 text-red-400': errors.description,
                  })}
                />
                {errors.description && (
                  <p className="text-xs text-red-400">
                    {t(errors.description.message as LocaleKey)}
                  </p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="simple-btn flex items-center gap-2 px-4 text-sm font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <BiLoaderAlt className="animate-spin" />
                      Creating
                    </>
                  ) : (
                    <>
                      <BiCalendarEvent />
                      Create
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <Dialog.Close asChild className="dialog-close-btn">
            <button className="outline-none">
              <BiX />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
