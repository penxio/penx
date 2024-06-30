import { FormApp } from '@penxio/preset-ui'

export function main() {
  const app = new FormApp({
    fields: [
      { label: 'First Name', name: 'firstName', component: 'Input' },
      { label: 'Description', name: 'description', component: 'Textarea' },
      { label: 'Open', name: 'isOpen', component: 'Switch', value: true },
      {
        label: 'Color',
        name: 'color',
        component: 'Select',
        options: [
          { label: 'Red', value: 'red' },
          { label: 'Green', value: 'green' },
          { label: 'Blue', value: 'blur' },
        ],
        value: 'red',
      },
    ],
    actions: [
      {
        type: 'SubmitForm',
        onSubmit: async (values) => {
          console.log('======values:', values)
        },
      },
    ],
  }).run()
}
