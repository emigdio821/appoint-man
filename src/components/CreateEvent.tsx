import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import useUserStore from '@/stores/user'
import { useForm } from 'react-hook-form'
import { appointmentsSchema } from '@/form-schemas'
import useTranslation from '@/hooks/useTranslation'
import { yupResolver } from '@hookform/resolvers/yup'
import { Select, SelectItem } from './primitives/Select'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { BiTime, BiLoaderAlt, BiCalendarEvent } from 'react-icons/bi'
import { formatDate, arrayRange, roundToNearest1hr } from '@/utils'
import { Dialog, DialogContent, DialogTrigger } from './primitives/Dialog'
import {
  TranslationKey,
  EventPayload,
  EventFormValues,
  EventResponse,
} from '@/types'

const startWorkingHour = 10
const endWorkingHour = 20

export default function CreateEvent() {
  const { t } = useTranslation()
  const supabase = useSupabaseClient()
  const user = useUserStore((state) => state.user)
  const [dialogOpened, setDialogOpened] = useState(false)
  const {
    reset,
    trigger,
    register,
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
      const { data: eventData } = await axios.post<EventResponse>(
        '/api/google/create-event',
        {
          event: eventPayload,
        },
      )

      const { error } = await supabase.from('appointments').insert({
        created_at: eventData.start.dateTime,
        ends_in: eventData.end.dateTime,
        attendees: eventData.attendees.map((data) => ({ user_id: data.email })),
        summary: eventData.summary,
        organizer: user?.email,
        description: eventData.description,
      })
      if (error) {
        throw new Error(error.message)
      }
      setDialogOpened(false)
      reset()
      toast.success(t('success'), { description: t('appointmentCreated') })
    } catch (error) {
      console.error(error)
      toast.error('Error', { description: t('error') })
    }
  })

  return (
    <Dialog
      open={dialogOpened}
      onOpenChange={(opened) => {
        if (!opened) {
          reset()
        }
        setDialogOpened(opened)
      }}
    >
      <DialogTrigger asChild>
        <button
          onClick={() => setDialogOpened(true)}
          className="simple-btn text-sm outline-none"
        >
          Create Appointment
        </button>
      </DialogTrigger>
      <DialogContent
        title="Create Appointment"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="mt-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <input
                type="text"
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
              <textarea
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
                placeholder="Pick a Date"
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
                  placeholder="Start Time"
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
                  placeholder="End Time"
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
                disabled={!isValid || isSubmitting}
                className="simple-btn flex items-center gap-2 px-4 text-sm font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <BiLoaderAlt className="animate-spinner" />
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
      </DialogContent>
    </Dialog>
  )
}
