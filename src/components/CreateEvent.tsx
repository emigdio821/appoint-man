import {
  BiTime,
  BiCalendar,
  BiLoaderAlt,
  BiCalendarEvent,
} from 'react-icons/bi'
import clsx from 'clsx'
import axios from 'axios'
import { useState } from 'react'
import Dialog from './radix/Dialog'
import useUserStore from '@/stores/user'
import { useForm } from 'react-hook-form'
import { useToastManager } from '@/context/toast'
import { appointmentsSchema } from '@/form-schemas'
import useTranslation from '@/hooks/useTranslation'
import { Select, SelectItem } from './radix/Select'
import { yupResolver } from '@hookform/resolvers/yup'
import { formatDate, arrayRange, roundToNearest1hr } from '@/utils'
import { TranslationKey, EventPayload, EventFormValues } from '@/types'

const startWorkingHour = 10
const endWorkingHour = 20

export default function CreateEvent() {
  const { t } = useTranslation()
  const { user } = useUserStore()
  const { showToast } = useToastManager()
  const [dialogOpened, setDialogOpened] = useState(false)
  const {
    reset,
    register,
    trigger,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EventFormValues>({
    defaultValues: {
      summary: '',
      endTime: '',
      description: '',
      date: formatDate(new Date()),
      startTime: roundToNearest1hr().getHours().toString(),
    },
    resolver: yupResolver(appointmentsSchema),
  })

  const startTimeItems = arrayRange(startWorkingHour, endWorkingHour).map(
    (number) => (
      <SelectItem
        key={number.toString()}
        value={number.toString()}
        disabled={roundToNearest1hr().getHours() > number}
      >
        {`${number < 10 ? `0${number}` : number}:00`}
      </SelectItem>
    ),
  )

  const endTimeItems = arrayRange(startWorkingHour, endWorkingHour).map(
    (number) => (
      <SelectItem
        key={number.toString()}
        value={number.toString()}
        disabled={parseInt(getValues('startTime')) >= number}
      >
        {`${number < 10 ? `0${number}` : number}:00`}
      </SelectItem>
    ),
  )

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
            <label htmlFor="summary" className="text-sm">
              Summary
            </label>
            <input
              type="text"
              id="summary"
              placeholder="Summary"
              {...register('summary')}
              className="simple-input text-sm"
            />
            {errors.summary && (
              <p className="text-xs text-red-400 dark:text-red-300">
                {t(errors.summary.message as TranslationKey)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Description"
              {...register('description')}
              className="simple-input h-40 resize-none text-sm"
            />
            {errors.description && (
              <p className="text-xs text-red-400 dark:text-red-300">
                {t(errors.description.message as TranslationKey)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="date"
              {...register('date')}
              className="simple-input text-sm"
            />
            {errors.date && (
              <p className="text-xs text-red-400 dark:text-red-300">
                {t(errors.date.message as TranslationKey)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex w-full flex-col gap-1">
              <Select
                icon={<BiTime />}
                placeholder="Pick a date"
                {...register('startTime')}
                defaultValue={getValues('startTime')}
                onValueChange={(value) => {
                  setValue('startTime', value, {
                    shouldValidate: true,
                  })
                  trigger('endTime')
                }}
              >
                {startTimeItems}
              </Select>
              {errors.startTime && (
                <p className="text-xs text-red-400 dark:text-red-300">
                  {t(errors.startTime.message as TranslationKey)}
                </p>
              )}
            </div>
            <div className="flex w-full flex-col gap-1">
              <Select
                icon={<BiTime />}
                {...register('endTime')}
                placeholder="Pick a date"
                onValueChange={(value) => {
                  setValue('endTime', value, {
                    shouldValidate: true,
                  })
                  trigger('startTime')
                }}
              >
                {endTimeItems}
              </Select>
              {errors.endTime && (
                <p className="text-xs text-red-400 dark:text-red-300">
                  {t(errors.endTime.message as TranslationKey)}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              // disabled={!isValid || isSubmitting}
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
