import { ContentRender } from '@penx/content-render'

interface Props {
  content: any
}

export function PageDefaultUI({ content }: Props) {
  return (
    <div className="mx-auto mt-10 w-full sm:mt-20 lg:max-w-3xl">
      <ContentRender content={content} />
    </div>
  )
}
