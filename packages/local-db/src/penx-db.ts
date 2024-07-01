import Dexie, { Table } from 'dexie'
import { ICommand, IExtension, IFile, INode, ISpace } from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'

export class PenxDB extends Dexie {
  space!: Table<ISpace, string>
  node!: Table<INode, string>
  file!: Table<IFile, string>
  extension!: Table<IExtension, string>

  constructor() {
    // super('PenxDB')
    super('penx-local')
    this.version(20).stores({
      // Primary key and indexed props
      space: 'id, name, userId',
      node: 'id, spaceId, databaseId, type, date, [type+spaceId+databaseId], [type+spaceId], [type+databaseId]',
      file: 'id, googleDriveFileId, fileHash',
      extension: 'id, name, isDeveloping',
    })
  }

  createExtension = (extension: IExtension) => {
    return this.extension.add(extension)
  }

  getExtension = (extensionId: string) => {
    return this.extension.get(extensionId)
  }

  getExtensionByName = (name: string) => {
    return this.extension.where({ name }).first()
  }

  upsertExtension = async (name: string, data: Partial<IExtension>) => {
    const ext = await this.extension.where({ name }).first()

    if (!ext) {
      await this.createExtension({
        id: uniqueId(),
        spaceId: '',
        name,
        isDeveloping: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      } as IExtension)
    } else {
      await this.updateExtension(ext.id, {
        ...data,
      })
    }
  }

  updateExtension = (extensionId: string, data: Partial<IExtension>) => {
    return this.extension.update(extensionId, data)
  }

  updateCommandAlias = async (extensionId: string, commandName: string, alias: string) => {
    const ext = await this.extension.get(extensionId)

    if (!ext) return
    const index = ext.commands.findIndex((c) => c.name === commandName)

    if (index === -1) return
    ext.commands[index]!.alias = alias
    await this.updateExtension(extensionId, {
      commands: ext.commands,
    })
  }

  updateCommandHotkey = async (extensionId: string, commandName: string, hotkey: string[]) => {
    const ext = await this.extension.get(extensionId)

    if (!ext) return
    const index = ext.commands.findIndex((c) => c.name === commandName)

    if (index === -1) return
    ext.commands[index]!.hotkey = hotkey
    await this.updateExtension(extensionId, {
      commands: ext.commands,
    })
  }

  addCommand = async (extensionId: string, command: ICommand) => {
    const ext = await this.extension.get(extensionId)
    if (!ext) return

    await this.updateExtension(extensionId, {
      commands: [...ext.commands, command],
    })
  }

  listExtensions = async () => {
    const extensions = await this.extension.toArray()
    return extensions
  }

  installExtension = async (extension: Partial<IExtension>) => {
    const list = await this.extension
      .where({
        spaceId: extension.spaceId!,
        name: extension.name!,
      })
      .toArray()

    if (list?.length) {
      const ext = list[0]!
      return this.extension.update(ext.id, {
        ...ext,
        ...extension,
      })
    }

    return this.extension.add({
      id: uniqueId(),
      ...extension,
    } as IExtension)
  }

  deleteExtension = async (id: string) => {
    return this.extension.delete(id)
  }

  createFile = async (data: Omit<IFile, 'id'>): Promise<IFile> => {
    const newNodeId = await this.file.add({
      id: uniqueId(),
      ...data,
    })

    return this.file.get(newNodeId) as any as Promise<IFile>
  }
}

export const penxDB = new PenxDB()
