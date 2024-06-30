import { memo, useEffect, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { FormJSON } from '@penxio/preset-ui'
import { Form, useForm } from 'fomir'
import { appEmitter } from '@penx/event'
import { workerStore } from '~/common/workerStore'

interface FormAppProps {
  component: FormJSON
}

export const FormApp = memo(function FormApp({ component }: FormAppProps) {
  const indexRef = useRef(0)
  const form = useForm({
    onSubmit(values) {
      workerStore.currentWorker!.postMessage({
        type: 'action--on-submit',
        values,
        actionIndex: indexRef.current,
      })
    },
    children: [
      ...(component.fields as any),
      // {
      //   label: 'Last Name',
      //   name: 'lastName',
      //   component: 'Input',
      //   value: '',
      //   validators: {
      //     required: 'First Name is required',
      //   },
      // },
    ],
  })

  useEffect(() => {
    function onSubmit(index: number) {
      indexRef.current = index
      form.submitForm()
    }
    appEmitter.on('SUBMIT_FORM_APP', onSubmit)
    return () => {
      appEmitter.off('SUBMIT_FORM_APP', onSubmit)
    }
  }, [form])

  return (
    <Box py2>
      <Form form={form} />
    </Box>
  )
})
