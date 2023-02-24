import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import useUserStore from '@/stores/user'
import { useForm } from 'react-hook-form'
import { appointmentsSchema } from '@/form-schemas'
import useTranslation from '@/hooks/useTranslation'
import { yupResolver } from '@hookform/resolvers/yup'
import { Select, SelectItem } from './primitives/Select'
import { Dialog, DialogContent } from './primitives/Dialog'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { formatDate, arrayRange, roundToNearest1hr } from '@/utils'
import { BiTime, BiLoaderAlt, BiCalendarEvent, BiUser } from 'react-icons/bi'
import {
  TranslationKey,
  EventPayload,
  EventFormValues,
  EventResponse,
} from '@/types'
import { Database } from '@/types/supabase'

const startWorkingHour = 0
const endWorkingHour = 24

interface CreateEventDialogProps {
  dialogOpened: boolean
  setDialogOpened: (opt: boolean) => void
}

export default function CreateEventDialog({
  dialogOpened,
  setDialogOpened,
}: CreateEventDialogProps) {
  const { t } = useTranslation()
  const supabase = useSupabaseClient<Database>()
  const user = useUserStore((state) => state.user)
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
      employee: '',
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
          email: values.employee,
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
      {/* <DialogTrigger asChild className="font-normal">
        <button
          onClick={() => setDialogOpened(true)}
          className="simple-btn text-sm"
        >
          {t('createAppointmentTitle')}
        </button>
      </DialogTrigger> */}
      <DialogContent
        title={t('createAppointmentTitle')}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="mt-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder={t('title')}
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
                {...register('description')}
                placeholder={t('description')}
                className="simple-input h-40 resize-none text-sm"
              />
              {errors.description && (
                <p className="text-xs text-red-400 dark:text-red-300">
                  {t(errors.description.message as TranslationKey)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Select
                icon={<BiUser />}
                {...register('employee')}
                placeholder={t('person')}
                onValueChange={(value) => {
                  setValue('employee', value, {
                    shouldValidate: true,
                  })
                }}
              >
                <SelectItem value="em.torresruiz92@gmail.com">
                  Em Torres
                </SelectItem>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="date"
                {...register('date')}
                placeholder={t('pickADate')}
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
                  {...register('startTime')}
                  placeholder={t('startTime')}
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
                  placeholder={t('endTime')}
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
                    {t('creating')}...
                  </>
                ) : (
                  <>
                    <BiCalendarEvent />
                    {t('create')}
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
