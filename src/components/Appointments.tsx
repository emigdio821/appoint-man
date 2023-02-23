import { dateToLocaleString } from '@/utils'
import { useEffect, useState, useCallback } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { BiLoaderAlt } from 'react-icons/bi'
import CreateEvent from './CreateEvent'

export default function Appointments() {
  const supabase = useSupabaseClient()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getAppointments = useCallback(async () => {
    const { data } = await supabase.from('appointments').select()
    if (data?.length) {
      setAppointments(data)
    }
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    getAppointments()
  }, [getAppointments])

  return (
    <div>
      <h2 className="mb-4 flex items-center justify-between gap-2 text-lg font-semibold">
        <span className="flex items-center gap-2">
          My Appointments{' '}
          {isLoading && <BiLoaderAlt className="animate-spinner" />}
        </span>
        <CreateEvent />
      </h2>
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
          const createAt = dateToLocaleString(new Date(created_at))
          const endsIn = dateToLocaleString(new Date(ends_in))

          return (
            <div
              key={id}
              className="flex flex-col gap-2 rounded-md border p-4 text-sm dark:border-zinc-800"
            >
              <h4 className="text-md font-semibold">{summary}</h4>
              <div>
                <p>{description}</p>
                <p>
                  Organizer: <span className="font-semibold">{organizer}</span>
                </p>
                <p>
                  Attendees:{' '}
                  {attendees.map((a) => (
                    <span
                      key={`${a.user_id}}-${created_at}`}
                      className="font-semibold"
                    >
                      {a.user_id}
                    </span>
                  ))}
                </p>
                <p>
                  {createAt} - {endsIn}
                </p>
              </div>

              <button disabled={isLoading} className="simple-btn text-sm">
                Cancel
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
