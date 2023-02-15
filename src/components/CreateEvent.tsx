import clsx from 'clsx'
import axios from 'axios'
import { useState } from 'react'
import Dialog from './radix/Dialog'
import useUserStore from '@/stores/user'
import { useForm } from 'react-hook-form'
import { useToastManager } from '@/context/toast'
import { appointmentsSchema } from '@/form-schemas'
import useTranslation from '@/hooks/useTranslation'
import { yupResolver } from '@hookform/resolvers/yup'
import { BiCalendarEvent, BiLoaderAlt } from 'react-icons/bi'
import { LocaleKey, EventPayload, EventFormValues } from '@/types'
import { add1Hour, formatDate, arrayRange, roundToNearest1hr } from '@/utils'
import { Select, SelectItem } from './radix/Select'

const startWorkingHour = 10
const endWorkingHour = 20

export default function CreateEvent() {
  const { t } = useTranslation()
  const { user } = useUserStore()
  const { showToast } = useToastManager()
  const nextHour = roundToNearest1hr().getHours()
  const [dialogOpened, setDialogOpened] = useState(false)

  const {
    reset,
    register,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EventFormValues>({
    defaultValues: {
      summary: '',
      description: '',
      date: formatDate(new Date()),
      startTime: nextHour,
      endTime: nextHour < endWorkingHour ? nextHour + 1 : new Date().getHours(),
    },
    resolver: yupResolver(appointmentsSchema),
    mode: 'onChange',
  })

  const items = arrayRange(startWorkingHour, endWorkingHour).map((number) => ({
    value: number.toString(),
    disabled: roundToNearest1hr().getHours() > number,
    text: `${number < 10 ? `0${number}` : number}:00`,
  }))

  const onSubmit = handleSubmit(async (values) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const startDateTime = new Date(`${values.date}, ${values.startTime}:00`)
    const endDateTime = new Date(`${values.date}, ${values.endTime}:00`)
    const eventPayload: EventPayload = {
      summary: values.summary,
      description: values.description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZome: timezone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: timezone,
      },
      attendees: [
        {
          email: 'em.torresruiz92@gmail.com',
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
      onClose={() => reset()}
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
          <div className="flex gap-2">
            <Select
              placeholder="Pick a date"
              {...register('endTime')}
              // defaultValue={getValues('startTime').toString()}
            >
              {items.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  {item.text}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="Pick a date"
              {...register('endTime')}
              // defaultValue={getValues('endTime').toString()}
            >
              {items.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  {item.text}
                </SelectItem>
              ))}
            </Select>
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
