import { format } from 'date-fns'
import { ICreationNode, NodeType } from '@penx/model-type'
import { StructType } from '@penx/types'
import { getUrl } from '@penx/utils'
import { docToString } from '@penx/utils/editorHelper'

export class Creation {
  props: ICreationNode['props']

  constructor(public raw: ICreationNode) {
    this.props = this.raw?.props || {}
  }

  get id(): string {
    return this.raw?.id || ''
  }

  get siteId(): string {
    return this.raw.siteId
  }

  get userId(): string {
    return this.raw.userId
  }

  get areaId(): string {
    return this.raw.props.areaId || ''
  }

  get slug(): string {
    return this.raw.props.slug
  }

  get date() {
    return this.props.date
  }

  get gateType(): string {
    return this.raw.props.gateType
  }

  get collectible() {
    return this.raw.props.collectible
  }

  get delivered() {
    return this.raw.props.delivered
  }

  get structId(): string {
    return this.raw.props.structId
  }

  get type(): string {
    return this.props?.type || ''
  }

  get title(): string {
    return this.props.title || ''
  }

  get status() {
    return this.props.status
  }

  get image() {
    return this.props.image ? getUrl(this.props.image) : ''
  }

  get checked() {
    return this.props.checked
  }

  get cells() {
    return this.props.cells
  }

  get content() {
    return this.props.content
  }

  get previewedContent() {
    const content = JSON.parse(this.content)
    return this.transcribedText || docToString(content)
  }

  get podcast() {
    return this.props.podcast
  }

  get data() {
    return this.props.data || {}
  }

  get transcribedText() {
    return this.props.data?.transcribedText || ''
  }

  get audioUrl() {
    return this.data?.url ? getUrl(this.data.url) : ''
  }

  get imageUrl() {
    return this.data?.url ? getUrl(this.data.url) : ''
  }

  get isTask() {
    return this.type === StructType.TASK
  }

  get isNote() {
    return this.type === StructType.NOTE
  }

  get isVoice() {
    return this.type === StructType.VOICE
  }

  get isBookmark() {
    return this.type === StructType.BOOKMARK
  }

  get publishedAt() {
    return this.props.publishedAt
  }

  get createdAt() {
    return new Date(this.raw.createdAt)
  }

  get updatedAt() {
    return new Date(this.raw.updatedAt)
  }

  get formattedTime() {
    return format(this.createdAt, 'HH:mm:ss')
  }
}
