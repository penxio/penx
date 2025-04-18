import {
  ItemSimpleChaptersChapterElement,
  ItemSimpleChaptersChapters,
  ItemSimpleChaptersChaptersElement,
} from './types/index'

export const buildSimpleChaptersElement = (
  chapters: ItemSimpleChaptersChapters,
) => {
  const chaptersElement: ItemSimpleChaptersChaptersElement = {
    'psc:chapters': [
      {
        _attr: {
          version: chapters.version,
          'xmlns:psc': 'http://podlove.org/simple-chapters',
        },
      },
    ],
  }

  if (Array.isArray(chapters.chapter)) {
    for (const chapter of chapters.chapter) {
      const chapterElement: ItemSimpleChaptersChapterElement = {
        'psc:chapter': {
          _attr: chapter,
        },
      }
      chaptersElement['psc:chapters'].push(chapterElement)
    }
  }

  return chaptersElement
}
