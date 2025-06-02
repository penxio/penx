export async function isStoragePersisted() {
  return navigator.storage && navigator.storage.persisted
    ? await navigator.storage.persisted()
    : undefined
}

export async function persist() {
  return navigator.storage && navigator.storage.persist
    ? await navigator.storage.persist()
    : undefined
}

export async function showEstimatedQuota() {
  return navigator.storage && navigator.storage.estimate
    ? await navigator.storage.estimate()
    : undefined
}

export async function tryPersistWithoutPromptingUser() {
  if (!navigator.storage || !navigator.storage.persisted) {
    return 'never'
  }
  let persisted = await navigator.storage.persisted()
  if (persisted) {
    return 'persisted'
  }
  if (!navigator.permissions || !navigator.permissions.query) {
    return 'prompt' // It MAY be successful to prompt. Don't know.
  }
  const permission = await navigator.permissions.query({
    name: 'persistent-storage',
  })

  if (permission.state === 'granted') {
    persisted = await navigator.storage.persist()
    if (persisted) {
      return 'persisted'
    } else {
      throw new Error('Failed to persist')
    }
  }
  if (permission.state === 'prompt') {
    return 'prompt'
  }
  return 'never'
}
