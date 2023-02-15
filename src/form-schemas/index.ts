import { string, object, ref, number } from 'yup'

export const appointmentsSchema = object().shape({
  summary: string().trim().required('requiredField'),
  description: string().trim().required('requiredField'),
  date: string().required('requiredField'),
  startTime: number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required('requiredField'),
  endTime: number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .moreThan(ref('startTime'), 'invalidRange')
    .required('requiredField'),
})
