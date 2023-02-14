import clsx from 'clsx'
import axios from 'axios'
import Dialog from './Dialog'
import { useState } from 'react'
import useUserStore from '@/stores/user'
import { useForm } from 'react-hook-form'
import { useToastManager } from '@/context/toast'
import { appointmentsSchema } from '@/form-schemas'
import useTranslation from '@/hooks/useTranslation'
import { yupResolver } from '@hookform/resolvers/yup'
import { BiCalendarEvent, BiLoaderAlt } from 'react-icons/bi'
import { LocaleKey, EventPayload, EventFormValues } from '@/types'
import { formatDate, formatTime, roundToNearest1hr, add1Hour } from '@/utils'

export default function CreateEvent() {
  const { user } = useUserStore()
  const { showToast } = useToastManager()
  const { t } = useTranslation()
  const [dialogOpened, setDialogOpened] = useState(false)

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EventFormValues>({
    defaultValues: {
      summary: '',
      description: '',
      date: formatDate(new Date()),
      time: formatTime(roundToNearest1hr()),
    },
    resolver: yupResolver(appointmentsSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const dateTime = new Date(`${values.date}, ${values.time}`)
    const eventPayload: EventPayload = {
      summary: values.summary,
      description: values.description,
      start: {
        dateTime: dateTime.toISOString(),
        timeZome: timezone,
      },
      end: {
        dateTime: add1Hour(dateTime).toISOString(),
        timeZone: timezone,
      },
      attendees: [
        {
          email: '',
        },
      ],
    }

    try {
      const event = await axios.post('/api/google/create-event', {
        event: eventPayload,
        providerToken: user?.providerRefreshToken,
      })

      // console.log(event)
      setDialogOpened(false)
      reset()
      showToast({ title: t('success'), description: t('appointmentCreated') })
    } catch (error) {
      console.error(error)
      showToast({ title: 'Error', description: t('error') })
    }
  })

  return (
    <Dialog
      isOpen={dialogOpened}
      title="Create Appointment"
      setIsOpen={setDialogOpened}
      trigger={
        <button
          className="simple-btn text-sm"
          onClick={() => setDialogOpened(true)}
        >
          Create Appointment
        </button>
      }
    >
      <div className="mt-4">
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Summary"
              {...register('summary')}
              className={clsx('simple-input text-sm', {
                'border-red-400 text-red-400 dark:border-red-400 dark:text-red-400':
                  errors.summary,
              })}
            />
            {errors.summary && (
              <p className="text-xs text-red-400">
                {t(errors.summary.message as LocaleKey)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <textarea
              placeholder="Description"
              {...register('description')}
              className={clsx('simple-input h-40 resize-none text-sm', {
                'border-red-400 text-red-400 dark:border-red-400 dark:text-red-400':
                  errors.description,
              })}
            />
            {errors.description && (
              <p className="text-xs text-red-400">
                {t(errors.description.message as LocaleKey)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="date"
              {...register('date')}
              className={clsx('simple-input text-sm', {
                'border-red-400 text-red-400 dark:border-red-400 dark:text-red-400':
                  errors.date,
              })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="time"
              {...register('time')}
              className={clsx('simple-input text-sm', {
                'border-red-400 text-red-400 dark:border-red-400 dark:text-red-400':
                  errors.date,
              })}
            />
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
    </Dialog>
  )
}
