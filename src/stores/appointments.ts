import { create } from 'zustand'
import { Appointment } from '@/types'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AppointmentsState {
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  removeAppointment: (appointment: Appointment) => void
  removeAppointments: () => void
  refreshAppointments: (appointments: Appointment[]) => void
}

const useAppointmentsStore = create<AppointmentsState>()(
  persist(
    (set, get) => ({
      appointments: get()?.appointments || [],
      addAppointment: (appointment) =>
        set((state) => ({
          ...state,
          appointments: [...state.appointments, appointment],
        })),
      removeAppointment: (appointment) =>
        set((state) => ({
          ...state,
          appointments: state.appointments.filter(
            (apt: any) => apt.id !== appointment.id,
          ),
        })),
      removeAppointments: () =>
        set((state) => ({
          ...state,
          appointments: [],
        })),
      refreshAppointments: (appointments) =>
        set((state) => ({
          ...state,
          appointments,
        })),
    }),
    {
      name: 'appointments-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useAppointmentsStore
