import {
  Dropdown,
  DropdownContent,
  DropdownLabel,
  DropdownItem,
  DropdownTrigger,
} from './primitives/Dropdown'
import { Appointment } from '@/types'
import { Database } from '@/types/supabase'
import { dateToLocaleString } from '@/utils'
import CreateEventDialog from './CreateEventDialog'
import useTranslation from '@/hooks/useTranslation'
import useAppointmentsStore from '@/stores/appointments'
import { useEffect, useState, useCallback } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import {
  BiRefresh,
  BiMenu,
  BiCalendarPlus,
  BiLoaderAlt,
  BiCheck,
} from 'react-icons/bi'

export default function Appointments() {
  const { t } = useTranslation()
  const supabase = useSupabaseClient<Database>()
  const [dialogOpened, setDialogOpened] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const refreshAppointments = useAppointmentsStore(
    (state) => state.refreshAppointments,
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getAppointments = useCallback(async () => {
    setIsLoading(true)
    const { data } = await supabase.from('appointments').select()
    if (data?.length) {
      refreshAppointments(data)
      setAppointments(data)
    }
    setIsLoading(false)
  }, [refreshAppointments, supabase])

  useEffect(() => {
    getAppointments()
  }, [getAppointments])

  return (
    <div>
      <CreateEventDialog
        dialogOpened={dialogOpened}
        setDialogOpened={setDialogOpened}
      />
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          {t('myAppointments')}
          {isLoading && <BiLoaderAlt className="animate-spinner" />}
        </h2>
        <Dropdown>
          <DropdownTrigger
            className="simple-btn"
            aria-label="Appointments options"
          >
            <BiMenu />
          </DropdownTrigger>
          <DropdownContent align="end">
            <DropdownLabel className="dropdown-label">
              {t('options')}
            </DropdownLabel>
            <DropdownItem
              disabled={isLoading}
              className="dropdown-item"
              onClick={getAppointments}
            >
              <div className="dropdown-indicator">
                <BiRefresh />
              </div>
              {t('refresh')}
            </DropdownItem>
            <DropdownItem
              className="dropdown-item"
              onClick={() => setDialogOpened(true)}
            >
              <div className="dropdown-indicator">
                <BiCalendarPlus />
              </div>
              {t('createAppointmentTitle')}
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
      <div className="grid grid-cols-3 gap-2 max-md:grid-cols-1">
        {appointments.map((appointment) => {
          const {
            id,
            attendees,
            created_at,
            ends_in,
            organizer,
            summary,
            description,
          } = appointment
          const createdAt = dateToLocaleString(new Date(created_at))
          const endsIn = dateToLocaleString(new Date(ends_in))
          const today = dateToLocaleString(new Date(Date.now()))
          const isExpired = endsIn < today

          return (
            <div
              key={id}
              className="flex flex-col justify-between gap-2 rounded-md border p-4 text-sm dark:border-zinc-800"
            >
              <div className="mb-4">
                <h4 className="mb-4 text-lg font-semibold">{summary}</h4>
                <p>{description}</p>
                {/* <p>
                  Organizer: <span className="font-semibold">{organizer}</span>
                </p> */}
                {/* <p>
                  Attendees:{' '}
                  {attendees.map((a: any) => (
                    <span
                      key={`${a.user_id}}-${created_at}`}
                      className="font-semibold"
                    >
                      {a.user_id}
                    </span>
                  ))}
                </p> */}
              </div>
              <div className="flex flex-col items-center justify-between gap-2">
                <div className="w-full text-sm">
                  {isExpired && (
                    <span className="flex items-center gap-1 opacity-60">
                      {t('eventCompleted')} <BiCheck />
                    </span>
                  )}
                  <span>{createdAt}</span>
                </div>
                <button
                  title={t('delete')}
                  disabled={isLoading}
                  className="simple-btn w-full text-sm"
                >
                  Details
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
