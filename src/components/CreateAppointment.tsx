import {
  Modal,
  Button,
  Group,
  Stack,
  Title,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useState } from 'react'
import { string, object } from 'yup'
import { useSession } from '@supabase/auth-helpers-react'
import useTranslation from '@/hooks/useTranslation'
import { useForm, yupResolver } from '@mantine/form'
import { DatePicker, TimeInput } from '@mantine/dates'
import { BiTime, BiCalendar } from 'react-icons/bi'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { showNotification } from '@mantine/notifications'

interface IFormValues {
  summary: string
  description: string
  date: any
  time: any
}

function roundToNearest1hr() {
  const minutes = 60
  const ms = 1000 * 60 * minutes

  return new Date(Math.ceil(new Date().getTime() / ms) * ms)
}

export default function CreateAppointment() {
  const session = useSession()
  const { t, locale } = useTranslation()
  const appointmentsSchema = object().shape({
    summary: string().required(t('requiredField')),
    description: string().required(t('requiredField')),
    date: string().required(t('requiredField')),
    time: string().required(t('requiredField')),
  })
  const [opened, setOpened] = useState(false)
  const form = useForm({
    initialValues: {
      summary: '',
      description: '',
      date: new Date(),
      // time: dayjs(new Date()).add(1, 'hour').toDate(),
      time: roundToNearest1hr(),
    },
    validate: yupResolver(appointmentsSchema),
  })

  function onCloseModal() {
    setOpened(false)
    if (form.errors) {
      form.reset()
    }
  }

  async function handleSubmit(values: IFormValues) {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const eventData = {
        summary: values.summary,
        description: values.description,
        start: {
          dateTime: values.date,
          timeZome: timezone,
        },
        end: {
          dateTime: dayjs(values.time).add(1, 'hour'),
          timeZone: timezone,
        },
      }
      const res = await fetch('/api/google/create-event', {
        method: 'POST',
        body: JSON.stringify(eventData),
      })

      const event = await res.json()
      onCloseModal()
      showNotification({
        color: 'green',
        title: 'Success',
        message: `Event "${event.summary}" created successufuly`,
      })
    } catch (err) {
      showNotification({
        color: 'red',
        title: 'Error',
        message: t('error'),
      })
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        overlayBlur={2}
        onClose={onCloseModal}
        closeOnClickOutside={false}
        title={<Title size="h4">{t('createAppointmentTitle')}</Title>}
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Stack>
            <TextInput label="Title" {...form.getInputProps('summary')} />
            <Textarea
              label="Description"
              {...form.getInputProps('description')}
            />
            <DatePicker
              label="Date"
              locale={locale}
              icon={<BiCalendar />}
              maxDate={dayjs(new Date())
                .endOf('month')
                .add(1, 'month')
                .toDate()}
              {...form.getInputProps('date')}
              minDate={dayjs(new Date()).startOf('day').toDate()}
            />
            <TimeInput
              clearable
              format="12"
              label="Time"
              icon={<BiTime />}
              {...form.getInputProps('time')}
            />
          </Stack>
          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>

      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group>
    </>
  )
}
