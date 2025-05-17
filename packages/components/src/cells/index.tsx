// import { imageCellRenderer } from '@glideapps/glide-data-grid'
import { dateCellRenderer } from './date-cell'
import { fileCellRenderer } from './file-cell'
import { imageCellRenderer } from './image-cell'
import { multipleSelectCellRenderer } from './multiple-select-cell'
import { passwordCellRenderer } from './password-cell'
import { primaryCellRenderer } from './primary-cell'
import { RateCellRenderer } from './rate-cell'
import { singleSelectCellRenderer } from './single-select-cell'
import { systemDateCellRenderer } from './system-date-cell'

export const cellRenderers = [
  dateCellRenderer,
  singleSelectCellRenderer,
  multipleSelectCellRenderer,
  systemDateCellRenderer,
  passwordCellRenderer,
  primaryCellRenderer,
  RateCellRenderer,
  fileCellRenderer,
  imageCellRenderer,
]
