import { string, object } from 'yup'

export const appointmentsSchema = object().shape({
  summary: string().required('requiredField'),
  description: string().required('requiredField'),
  // date: string().required('requiredField'),
  // time: string().required('requiredField'),
})
