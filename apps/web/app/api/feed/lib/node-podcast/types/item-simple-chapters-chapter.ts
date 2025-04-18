export interface ItemSimpleChaptersChapter {
  /**
   * Refers to a single point in time relative to the beginning of the media file.
   * This attribute is mandatory.
   * The time is expressed in Normal Play Time [5] which allows for a flexible input of time markers.
   * @example
   *   01:35:52
   *   1 hour 35 minutes 52 seconds
   *
   *   7:48
   *   7 minutes, 48 seconds
   *
   *   35:12.250
   *   35 minutes, 12 seconds, 250 ms
   *
   *   05:12:03.5
   *   5 hours, 12 minutes, 3 seconds, 500 ms
   *
   *   37
   *   37 seconds
   */
  start: string | number
  /**
   * Defines name to be the title of the chapter. The title could be any length,
   * but authors should consider the titles to be displayed on small devices with limited screen estate.
   * Also, shorter titles are easier to grasp. This attribute is mandatory.
   */
  title: string

  /**
   * This is an additional hypertext reference as an extension of the title that refers to a resource that provides related information.
   * This link should be presented to the user only in context with the chapter and its title.
   * This attribute is optional.
   */
  href?: string

  /**
   * This is an URL pointing to an image to be associated with the chapter.
   * This attribute is optional.
   */
  image?: string
}
