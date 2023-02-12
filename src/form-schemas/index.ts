import { string, object } from 'yup'

export const appointmentsSchema = object().shape({
  summary: string().trim().required('requiredField'),
  description: string().trim().required('requiredField'),
  // date: string().required('requiredField'),
  // time: string().required('requiredField'),
})
