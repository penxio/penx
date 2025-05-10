export const redisKeys = {
  areaCreations(areaId: string) {
    return `area-creations:${areaId}`
  },

  moldCreations(siteId: string, moldId: string) {
    return `site-creations:${siteId}:${moldId}`
  },

  sitePages(siteId: string) {
    return `site-pages:${siteId}`
  },

  site(siteId: string) {
    return `site:${siteId}`
  },

  notes(areaId: string) {
    return `notes:${areaId}`
  },

  creation(creationId: string) {
    return `creation:id:${creationId}`
  },

  area(areaId: string) {
    return `area:${areaId}`
  },

  publishedCreations() {
    return `publishedCreations`
  },

  spaceLogo(address: string) {
    return `space:logo:${address}`
  },

  mySites(uid: string) {
    return `my_sites:${uid}`
  },

  homeSites() {
    return `sites:home`
  },

  postImportTasks(taskId: string) {
    return `post-import-tasks:${taskId}`
  },

  postEngagement(creationId: string) {
    return `post:pv:${creationId}`
  },

  emailLoginCode(code: string) {
    return `login-code:${code}`
  },
}
