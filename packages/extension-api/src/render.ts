import { DataListBuilder } from './components/DataListBuilder'
import { ListBuilder } from './components/ListBuilder'
import { MarkdownBuilder } from './components/MarkdownBuilder'
import { EventType } from './constants'

export function render(
  component: ListBuilder | MarkdownBuilder | DataListBuilder,
) {
  console.log('render component', component.toJSON())

  postMessage({
    type: EventType.Render,
    payload: component.toJSON(),
  })
}
