import { useCallback, useEffect, useRef } from 'react'
import { t } from '@lingui/core/macro'
import { set } from 'idb-keyval'
import { toast } from 'sonner'
import { tinykeys } from 'tinykeys'
import { api } from '@penx/api'
import {
  settingsAtom,
  SettingsNav,
} from '@penx/components/SettingsDialog/useSettingsDialog'
import { isDesktop } from '@penx/constants'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useAppShortcuts } from '@penx/hooks/useAppShortcuts'
import { localDB } from '@penx/local-db'
import {
  getAddress,
  getNewMnemonic,
  getPublicKey,
  setMnemonicToLocal,
} from '@penx/mnemonic'
import { queryClient } from '@penx/query-client'
import { refreshSession, useSession } from '@penx/session'
import { store } from '@penx/store'
import { currentCommandAtom } from '../hooks/useCurrentCommand'
import { currentCreationAtom } from '../hooks/useCurrentCreation'
import { navigation, setNavigations } from '../hooks/useNavigation'
import { Selection } from '../hooks/useSelection'
import { creationToCommand } from '../lib/creationToCommand'
import { openCommand } from '../lib/openCommand'

tinykeys(window, {
  // '$mod+Alt+KeyS': (event) => {
  //   event.preventDefault()
  //   toast.promise(
  //     async () => {
  //       await syncNodesToServer()
  //     },
  //     {
  //       loading: t`Syncing...`,
  //       success: t`Sync successful!`,
  //       error: () => {
  //         return t`Sync failed, please try again.`
  //       },
  //     },
  //   )
  // },
})

if (isDesktop) {
  window.customElectronApi.shortcut.onPressed((shortcut) => {
    // console.log('=========shortcut:', shortcut)

    if (shortcut.commandId) {
      window.customElectronApi.togglePanelWindow()
      openCommand({
        id: shortcut.commandId,
      })
    }
  })

  window.electron.ipcRenderer.on('edit-shortcuts', () => {
    openCommand({
      id: 'settings',
    })

    store.set(settingsAtom, {
      open: true,
      navName: SettingsNav.EDIT_SHORTCUTS,
    })
  })

  window.electron.ipcRenderer.on('translate', (_, text) => {
    if (!text) return
    window.customElectronApi.openPanelWindow()
    openCommand({
      id: 'translate',
      data: {
        text,
      },
    })
  })

  window.electron.ipcRenderer.on('open-chat-to-browser', (_, text) => {
    console.log('=========open-chat-to-browser...')
    openCommand({
      id: 'chat-to-browser',
    })
  })

  window.electron.ipcRenderer.on('open-quick-input', () => {
    openCommand({
      id: 'quick-input',
    })

    setTimeout(() => {
      window.customElectronApi.openPanelWindow()
    }, 0)
  })

  window.electron.ipcRenderer.on('open-window-after-subscription', () => {
    console.log('name......')
    refreshSession()
  })

  window.electron.ipcRenderer.on(
    'open-ai-command',
    async (
      _,
      { creationId, selection }: { creationId: string; selection: Selection },
    ) => {
      const creation = await localDB.getCreation(creationId)

      store.set(currentCreationAtom, creation)
      store.set(currentCommandAtom, creationToCommand(new Creation(creation)))
      navigation.push({
        path: '/ai-command',
        data: selection,
      })

      setTimeout(() => {
        window.customElectronApi.openPanelWindow()
      }, 0)
    },
  )
}

export function WatchEvent() {
  useEffect(() => {
    if (isDesktop) {
      window.electron.ipcRenderer.on('quick-input-success', () => {
        store.creations.refetchCreations()
      })
    }
  }, [])

  useEffect(() => {
    if (isDesktop) {
      window.electron.ipcRenderer.on('quit-and-install', () => {
        toast.loading(t`New version available, restarting to update...`)
      })
    }
  }, [])

  useEffect(() => {
    appEmitter.on('DESKTOP_LOGIN_SUCCESS', async (session) => {
      await set('SESSION', session)
      queryClient.setQueryData(['SESSION'], session)
      location.reload()
    })
  }, [])

  const { shortcuts } = useAppShortcuts()
  const registered = useRef(false)

  function registerShortcuts() {
    for (const item of shortcuts) {
      // console.log('=============shortcut:', item)
      window.customElectronApi.shortcut.unregister(item)
      window.customElectronApi.shortcut.register(item)
    }
  }

  useEffect(() => {
    if (registered.current) return
    registered.current = true
    // console.log('===========shortcuts:', shortcuts)
    registerShortcuts()
  }, [])

  const { session } = useSession()
  const doingRef = useRef(false)
  const initMnemonic = useCallback(async () => {
    try {
      const mnemonic = await getNewMnemonic()
      const publicKey = getPublicKey(mnemonic)
      const address = getAddress(mnemonic)
      await api.updateMnemonicInfo({
        mnemonic,
        publicKey,
        address,
      })
      await setMnemonicToLocal(session.spaceId!, mnemonic)
      // store.user.setMnemonic(mnemonic)
      refreshSession()
    } catch (error) {
      console.log('=====error:', error)
    }
  }, [session])

  useEffect(() => {
    if (!session || session.publicKey || doingRef.current) return
    console.log('init=======session:', session)
    doingRef.current = true
    initMnemonic()
  }, [session])

  return null
}

const a = {
  currentTab: {
    id: 1857260701,
    url: 'https://orm.drizzle.team/',
    title: 'Drizzle ORM - next gen TypeScript ORM.',
  },
  language: 'en-US',
  id: 'F24Q9ubNiJ20ziut',
  messages: [
    {
      parts: [{ type: 'text', text: 'Summarize the current page' }],
      id: 'BIffAyndjcHvJqjc',
      role: 'user',
      metadata: {
        currentTab: {
          id: 1857260701,
          url: 'https://orm.drizzle.team/',
          title: 'Drizzle ORM - next gen TypeScript ORM.',
        },
      },
    },
    {
      id: '9GR9WByaCITyGsI5',
      role: 'assistant',
      parts: [
        { type: 'step-start' },
        {
          type: 'text',
          text: 'I will now get the content of the current page to summarize it for you.\n',
          state: 'done',
        },
        {
          type: 'tool-getTabContent',
          toolCallId: 'call_7d31280595b94228bc4291defd259b4e',
          state: 'output-available',
          input: { tabIds: [1857260701] },
          output: {
            contents: [
              {
                tabId: 1857260701,
                title: 'Drizzle ORM - next gen TypeScript ORM.',
                url: 'https://orm.drizzle.team/',
                markdown:
                  "We ship decently fast\n---------------------\n\n### Drizzle Team and Active Contributors\n\nAndrew Sherman ![Andrew Sherman](/_astro/sherman.UDJRB3k5_ZkLUOp.webp)\n\nDan Kochetov ![Dan Kochetov](/_astro/bloberenober.CK43HITJ_Z2kw5F3.webp)\n\nAlex Blokh ![Alex Blokh](/_astro/blokh.Bc1_d43p_Z2p1f3Q.webp)\n\nMykhailo Stratovych ![Mykhailo Stratovych](/_astro/mike.BujdKICH_Z8fiUF.webp)\n\nRoman Nabukhotnyi ![Roman Nabukhotnyi](/_astro/roman.d06WfHk2_1U5afG.webp)\n\nVladislav Stohnii ![Vladislav Stohnii](/_astro/vlad.akhSVFbV_ZHiOxY.webp)\n\nSerhii Reka ![Serhii Reka](/_astro/reka.a4HZ6_0K_Z1bpOcH.webp)\n\nOleksii Khomenko ![Oleksii Khomenko](/_astro/homenko.vAPxMUAE_ZL4979.webp)\n\nArtem Odiiko ![Artem Odiiko](/_astro/artem.Cipququs_19I5Yn.webp)\n\nVitalii Staryk ![Vitalii Staryk](/_astro/vitalii.CTiDFulE_1VkFLC.webp)\n\nangelelz ![angelelz](/_astro/angelelz.9_7ycTdn_Zt7V8W.webp)\n\nrphlmr ![rphlmr](/_astro/rphlmr.CvKO5CzH_ZGI6DX.webp)\n\nmario564 ![mario564](/_astro/mario564.BvDiiWft_1SFbkx.webp)\n\nSimon Sardorf ![Simon Sardorf](/_astro/intelligently.DeIcNR4v_ZNO0tP.webp)\n\nJune 2024\n\nJuly 2024\n\n*   We've had podcast on [syntax.fm](https://www.youtube.com/watch?v=Hh9xqRWYEJs) 🎙️ Drizzle <> Syntax merch drop - [see here](https://x.com/DrizzleORM/status/1815793307877871912)\n    \n*   **ORM release**\n    \n    *   improved indexes API and typings\n    *   support for limit 0\n    *   array and notInArray accept empty \\[\\]\n    \n*   **Community highlights** • [drizzle.run](https://drizzle.run) ships [schema visualizer](https://drizzle.run/visualizer) 👀 • [sst dev](https://x.com/thdxr/status/1818439495361937781) & drizzle studio update • [Hono + Drizzle](https://github.com/rhinobase/honohub) headless CMS • TypeScript based [down migrations](https://github.com/drepkovsky/drizzle-migrations)\n    \n*   **Drizzle Kit goes open-source 🎉** • 2hrs release stream on Jul 30th • added programmatic access • with bugfixes\n    \n*   **Landing page update 🎉** • our team is 10 devs, now you know • showcase active contributors • TypeScript and JavaScript mention • v1.0 release timeline with a roadmap! • calendar section for our iterations • quick access docs search and ask ai • snake game board 🐍\n    \n*   added [announcments](/announcements) page\n    \n*   **Updated tutorials:**• [Drizzle <> Vercel Postgres](/docs/tutorials/drizzle-with-vercel) • [Drizzle <> Turso](/docs/tutorials/drizzle-with-turso) • [Drizzle <> Neon Postgres](/docs/tutorials/drizzle-with-neon) • [Todo App with Neon Postgres](/docs/tutorials/drizzle-nextjs-neon)\n    \n\nAugust 2024\n\n*   [**Drizzle Gateway**](https://x.com/DrizzleORM/status/1820462321942036749) closed alpha release 🎉\n    \n*   [**Brocli**](https://github.com/drizzle-team/brocli) - our new open-source library 👀\n    \n*   [Snake Game](https://3310snake.com/) released 🎉 have some fun we've had a lot of fun\n    \n*   **Kit release** **Breaking changes:**\n    \n    *   Fixed [Composite primary key order is not consistent](https://github.com/drizzle-team/drizzle-kit-mirror/issues/342) by removing `sort` in SQLite\n    \n    **Bug fixes:**\n    \n    *   [\\[BUG\\] When using double type columns, import is not inserted](https://github.com/drizzle-team/drizzle-kit-mirror/issues/403)\n    *   [\\[BUG\\] A number value is specified as the default for a column of type char](https://github.com/drizzle-team/drizzle-kit-mirror/issues/404)\n    *   [\\[BUG\\]: Array default in migrations are wrong](https://github.com/drizzle-team/drizzle-orm/issues/2621)\n    *   [\\[FEATURE\\]: Simpler default array fields](https://github.com/drizzle-team/drizzle-orm/issues/2709)\n    *   [\\[BUG\\]: drizzle-kit generate succeeds but generates invalid SQL for default(\\[\\]) - Postgres](https://github.com/drizzle-team/drizzle-orm/issues/2432)\n    *   [\\[BUG\\]: Incorrect type for array column default value](https://github.com/drizzle-team/drizzle-orm/issues/2334)\n    *   [\\[BUG\\]: error: column is of type integer\\[\\] but default expression is of type integer](https://github.com/drizzle-team/drizzle-orm/issues/2224)\n    *   [\\[BUG\\]: Default value in array generating wrong migration file](https://github.com/drizzle-team/drizzle-orm/issues/1003)\n    *   [\\[BUG\\]: enum as array, not possible?](https://github.com/drizzle-team/drizzle-orm/issues/1564)\n    \n*   **ORM release** **Breaking changes:**\n    \n    *   [\\[BUG\\]: jsonb always inserted as a json string when using postgres-js](https://github.com/drizzle-team/drizzle-orm/issues/724)\n    *   [\\[BUG\\]: jsonb type on postgres implement incorrectly](https://github.com/drizzle-team/drizzle-orm/issues/1511)\n    \n    **Bug fixes:**\n    \n    *   [\\[BUG\\]: boolean mode not working with prepared statements (bettersqlite)](https://github.com/drizzle-team/drizzle-orm/issues/2568)\n    *   [\\[BUG\\]: isTable helper function is not working](https://github.com/drizzle-team/drizzle-orm/issues/2672)\n    *   [\\[BUG\\]: Documentation is outdated on inArray and notInArray Methods](https://github.com/drizzle-team/drizzle-orm/issues/2690)\n    \n*   **Kit release**\n    \n    *   fixed a bug in PostgreSQL with push and introspect where the `**schemaFilter**` object was passed. It was detecting enums even in schemas that were not defined in the **`schemaFilter`**.\n    *   fixed the `**drizzle-kit up**` command to work as expected, starting from the sequences release\n    \n*   **ORM release**\n    \n    *   fix AWS Data API type hints bugs in RQB\n    *   fix set transactions in MySQL bug\n    *   add forwaring dependencies within useLiveQuery, fixes [#2651](https://github.com/drizzle-team/drizzle-orm/issues/2651)\n    *   export additional types from SQLite package, like `AnySQLiteUpdate`\n    \n*   **Updated tutorials:**• [Drizzle with Supabase Database](/docs/tutorials/drizzle-with-supabase) • [Drizzle with Vercel Edge Functions](/docs/tutorials/drizzle-with-vercel-edge-functions)\n    \n*   We've updated [benchmarks](https://x.com/DrizzleORM/status/1826693369357369712) 🚀\n    \n\nSeptember 2024\n\n*   Some Tweets\n    \n\nOctober 2024\n\n*   **ORM release** **Row-Level Security Support for PostgreSQL**\n    \n    *   Manage roles\n    *   Manage policies\n    *   Enable RLS for tables\n    *   Enable RLS for views!\n    *   Special import `drizzle-orm/neon` for `Neon`\n    *   Special import `drizzle-orm/supabase` for `Supabase`\n    \n*   **Kit release** **Row-Level Security Support for PostgreSQL**\n    \n    *   Manage roles\n    *   Manage policies\n    *   Enable RLS for tables\n    *   Enable RLS for views!\n    *   Special import `drizzle-orm/neon` for `Neon`\n    *   Special import `drizzle-orm/supabase` for `Supabase`\n    \n*   **ORM release** **Breaking changes:**\n    \n    *   Added new dialect \"Turso\" that needs a newer libsql version\n    \n    **Features:**\n    \n    *   LibSQL/Turso and SQLite migration updates\n    *   SQLite \"generate\" and \"push\" statement updates\n    *   LibSQL/Turso \"generate\" and \"push\" statement updates\n    *   New `casing` param in `drizzle-orm`\n    *   Monodriver: A new and easy way to start using Drizzle\n    *   Schema improvements: Optional names for columns and callback in Drizzle table\n    *   New \"count\" API\n    *   Ability to execute raw strings\n    *   Exposed db.$client\n    \n*   **Kit release** **Breaking changes:**\n    \n    *   Added new dialect \"Turso\" that needs a newer libsql version\n    \n    **Features:**\n    \n    *   LibSQL/Turso and SQLite migration updates\n    *   SQLite \"generate\" and \"push\" statement updates\n    *   LibSQL/Turso \"generate\" and \"push\" statement updates\n    *   New `casing` param in `drizzle-kit`\n    \n\nNovember 2024\n\n*   **🎉 OneDollarStats is now available in Open Alpha release!**[OneDollarStats](https://onedollarstats.com/) is a $1 per month web analytics built by Drizzle Team\n    \n*   **🎉 New `drizzle-seed` package is now available** For more info check our [seed documentation](https://orm.drizzle.team/docs/seed-overview)\n    \n*   **ORM release**\n    \n    *   Added.$withAuth() API for Neon HTTP driver\n    *   Added OVERRIDING SYSTEM VALUE api to db.insert()\n    \n*   **ORM release**\n    \n    *   Support for UPDATE... FROM in PostgreSQL and SQLite\n    *   Support for INSERT INTO... SELECT in all dialects\n    \n*   **Kit release** and **ORM release**\n    \n    *   Support more types in like, notLike, ilike and notIlike expressions\n    *   Fixed typos in repository: thanks @armandsalle, @masto, @wackbyte, @Asher-JH, @MaxLeiter\n    *   fix: wrong dialect set in mysql/sqlite introspect\n    *   Fixed.generated behavior with non-strict tsconfig\n    *   Fix Drizzle ORM for expo-sqlite\n    *   Fixed lack of schema name on columns in sql\n    *   fix: Adjust neon http driver entity kind\n    *   Export PgIntegerBuilderInitial type\n    *   \\[MySQL\\] Correct $returningId() implementation to correctly store selected fields\n    \n*   **Kit release** and **ORM release**\n    \n    *   Added an OHM static imports checker to identify unexpected imports within a chain of imports in the drizzle-kit repo. For example, it checks if drizzle-orm is imported before drizzle-kit and verifies if the drizzle-orm import is available in your project.\n    *   Adding more columns to Supabase auth.users table schema\n    \n    **Bug Fixes***   \\[BUG\\]: Using sql.placeholder with limit and/or offset for a prepared statement produces TS error\n    *   \\[BUG\\] If a query I am trying to modify with a dynamic query (....$dynamic()) contains any placeholders, I'm getting an error that says No value for placeholder.... provided\n    *   \\[BUG\\]: Error thrown when trying to insert an array of new rows using generatedAlwaysAsIdentity() for the id column\n    *   \\[BUG\\]: Unable to Use BigInt Types with Bun and Drizzle\n    *   \\[BUG\\]: \\[drizzle-kit\\]: Fix breakpoints option cannot be disabled\n    *   \\[BUG\\]: drizzle-kit introspect: SMALLINT import missing and incorrect DECIMAL UNSIGNED handling\n    *   Unsigned tinyints preventing migrations\n    *   \\[BUG\\]: Can't parse float(8,2) from database (precision and scale and/or unsigned breaks float types)\n    *   \\[BUG\\]: PgEnum generated migration doesn't escape single quotes\n    *   \\[BUG\\]: single quote not escaped correctly in migration file\n    *   \\[BUG\\]: Migrations does not escape single quotes\n    *   \\[BUG\\]: Issue with quoted default string values\n    *   \\[BUG\\]: SQl commands in wrong roder\n    *   \\[BUG\\]: Time with precision in drizzle-orm/pg-core adds double-quotes around type\n    *   \\[BUG\\]: Postgres push fails due to lack of quotes\n    *   \\[BUG\\]: TypeError: Cannot read properties of undefined (reading 'compositePrimaryKeys')\n    *   \\[BUG\\]: drizzle-kit introspect generates CURRENT\\_TIMESTAMP without sql operator on date column\n    *   \\[BUG\\]: Drizzle-kit introspect doesn't pull correct defautl statement\n    *   \\[BUG\\]: Problem on MacBook - This statement does not return data. Use run() instead\n    *   \\[BUG\\]: Enum column names that are used as arrays are not quoted\n    *   \\[BUG\\]: drizzle-kit generate ignores index operators\n    *   dialect param config error message is wrong\n    *   \\[BUG\\]: Error setting default enum field values\n    *   \\[BUG\\]: drizzle-kit does not respect the order of columns configured in primaryKey()\n    *   \\[BUG\\]: Cannot drop Unique Constraint MySQL\n    \n*   **Kit release**\n    \n    *   Fix \\[BUG\\]: Undefined properties when using drizzle-kit push\n    *   Fix TypeError: Cannot read properties of undefined (reading 'isRLSEnabled')\n    *   Fix push bugs, when pushing a schema with linked policy to a table from drizzle-orm/supabase\n    \n*   **Kit release**\n    \n    *   Fix: \\[BUG\\]: When using RLS policies and Views, the view is the last clause generated\n    \n\nDecember 2024\n\n*   **drizzle-seed [v0.3.0](https://github.com/drizzle-team/drizzle-orm/blob/main/changelogs/drizzle-seed/0.3.0.md) release**\n    \n    *   The seed function can now accept Drizzle Relations objects and treat them as foreign key constraints\n    \n*   **ORM release**\n    \n    *   Fix incorrect deprecation detection for table declarations\n    *   SingleStore dialect support for all validator packages\n    \n*   **drizzle-seed [v0.2.1](https://github.com/drizzle-team/drizzle-orm/blob/main/changelogs/drizzle-seed/0.2.1.md) release**\n    \n    *   We are introducing a new parameter, version, to the seed function options. This parameter, which controls generator versioning, has been added to make it easier to update deterministic generators in the future.\n    *   interval unique generator was changed and upgraded to v2\n    *   string generators were changed and upgraded to v2\n    \n*   **ORM release**\n    \n    *   New features for MySQL users: USE INDEX, FORCE INDEX and IGNORE INDEX for MySQL\n    \n*   **Kit release**\n    \n    *   New command: drizzle-kit export\n    \n*   **drizzle-seed [v0.1.3](https://github.com/drizzle-team/drizzle-orm/blob/main/changelogs/drizzle-seed/0.1.3.md) release**\n    \n    *   Added support for postgres uuid columns\n    *   Added support for postgres array columns\n    *   Added support for cyclic tables. You can now seed tables with cyclic relations.\n    \n    **Bug Fixes***   \\[BUG\\]: reset fails with a syntax error if using a - in pgTableCreator to prefix tables\n    *   seeding a table with columns that have.default(sql\\`\\`) will result in an error\n    \n*   ORM bug fixes\n    \n    *   \\[FEATURE\\]: publish packages un-minified\n    *   Don't allow unknown keys in drizzle-zod refinement\n    *   \\[BUG\\]:drizzle-zod not working with pgSchema\n    *   Add createUpdateSchema to drizzle-zod\n    *   \\[BUG\\]:drizzle-zod produces wrong type\n    *   \\[BUG\\]:Drizzle-zod:Boolean and Serial types from Schema are defined as enum when using CreateInsertSchema and CreateSelectSchema\n    *   \\[BUG\\]: Drizzle typebox enum array wrong schema and type\n    *   \\[BUG\\]:drizzle-zod not working with pgSchema\n    *   \\[BUG\\]: drizzle-zod not parsing arrays correctly\n    *   \\[BUG\\]: Drizzle typebox not supporting array\n    *   \\[FEATURE\\]: Export factory functions from drizzle-zod to allow usage with extended Zod classes\n    *   \\[FEATURE\\]: Add support for new pipe syntax for drizzle-valibot\n    *   \\[BUG\\]: drizzle-zod's createInsertSchema() can't handle column of type vector\n    *   \\[BUG\\]: drizzle-typebox fails to map geometry column to type-box schema\n    *   \\[BUG\\]: drizzle-valibot does not provide types for returned schemas\n    *   \\[BUG\\]: Drizzle-typebox types SQLite real field to string\n    *   \\[BUG\\]: drizzle-zod: documented usage generates type error with exactOptionalPropertyTypes\n    *   \\[BUG\\]: drizzle-zod does not respect/count db type range\n    *   \\[BUG\\]: drizzle-zod not overriding optional\n    *   \\[BUG\\]:drizzle-zod doesn't accept custom id value\n    *   \\[FEATURE\\]: Support for Database Views in Drizzle Zod\n    *   \\[BUG\\]: drizzle-valibot return type any\n    *   \\[BUG\\]: drizzle-zod Type generation results in undefined types\n    *   \\[BUG\\]: GeneratedAlwaysAs\n    *   \\[FEATURE\\]: $inferSelect on a view\n    *   \\[BUG\\]:Can't infer props from view in schema\n    \n*   **ORM release**\n    \n    *   Added new function getViewSelectedFields\n    *   Added $inferSelect function to views\n    *   Added InferSelectViewModel type for views\n    *   Added isView function\n    \n*   **Kit release** Starting from this update, the PostgreSQL dialect will align with the behavior of all other dialects. It will no longer include IF NOT EXISTS, $DO, or similar statements, which could cause incorrect DDL statements to not fail when an object already exists in the database and should actually fail.\n    \n*   **Kit release** and **ORM release**\n    \n    *   New dialect **SingleStore** is available in Drizzle\n    *   New driver for **Durable Objects SQLite** is available in Drizzle\n    *   \\[BUG\\]: $with is undefined on withReplicas\n    *   \\[BUG\\]: Neon serverless driver accepts authToken as a promise, but the $withAuth does not\n    \n\nJanuary\n\n*   **ORM release**\n    \n    *   Fixed SQLite onConflict clauses being overwritten instead of stacked\n    *   Added view support to aliasedTable()\n    *   Fixed sql builder prefixing aliased views and tables with their schema\n    \n*   **Kit release**\n    \n    *   Fix bug that generates incorrect syntax when introspect in mysql\n    *   Fix a bug that caused incorrect syntax output when introspect in unsigned columns\n    \n*   **ORM release**\n    \n    *   You can now use the new Bun SQL driver released in Bun v1.2.0 with Drizzle\n    *   WITH now supports INSERT, UPDATE, DELETE and raw sql template\n    *   New tables in /neon import\n    *   Added getViewName util function\n    \n*   **Kit release**\n    \n    *   As SingleStore did not support certain DDL statements before this release, you might encounter an error indicating that some schema changes cannot be applied due to a database issue. Starting from this version, drizzle-kit will detect such cases and initiate table recreation with data transfer between the tables\n    \n\nFebruary\n\n*   **Drizzle Studio updates:**\n    \n    *   Added the ability to create/alter tables.\n    *   Added the ability to create/alter views.\n    *   Added the ability to refresh db schema.\n    *   Improved dropdowns.\n    *   Improved style customization.\n    *   Added filter by entity type (table/view).\n    *   Revised dependency tree and reduced bundle size.\n    *   Added database metadata to bug report.\n    *   Added range selection with copy/paste capability.\n    \n*   **ORM release**\n    \n    *   Drizzle is getting a new Gel dialect with its own types and Gel-specific logic. In this first iteration, almost all query-building features have been copied from the PostgreSQL dialect since Gel is fully PostgreSQL-compatible. The only change in this iteration is the data types. The Gel dialect has a different set of available data types, and all mappings for these types have been designed to avoid any extra conversions on Drizzle's side. This means you will insert and select exactly the same data as supported by the Gel protocol.\n    \n*   **Kit release**\n    \n    *   Drizzle is getting a new Gel dialect with its own types and Gel-specific logic. Kit is getting new \"gel\" dialect option\n    \n\nMarch\n\n*   **ORM release**\n    \n    *   `bigint`, `number` modes for `SQLite`, `MySQL`, `PostgreSQL`, `SingleStore` `decimal` & `numeric` column types\n    *   Changed behavior of `sql-js` query preparation\n    *   Fixed `MySQL`, `SingleStore` `varchar` allowing not specifying `length` in config\n    *   Fixed `MySQL`, `SingleStore` `binary`, `varbinary` data\\\\\\\\type mismatches\n    *   Fixed `numeric` \\\\\\\\ `decimal` data\\\\\\\\type mismatches\n    *   Fixed `drizzle-studio` + `AWS Data Api` connection issue\n    *   Fixed `isConfig` utility function checking types of wrong fields\n    *   Enabled `supportBigNumbers` in auto-created `mysql2` driver instances\n    *   Fixed custom schema tables querying in RQBv1\n    *   Removed in-driver mapping for postgres types\n    *   Fixed `SQLite` `buffer` -mode `blob` sometimes returning `number[]`\n    \n*   **ORM release**\n    \n    *   Updates to neon-http for @neondatabase/serverless@1.0.0. Starting from this version, drizzle-orm will be compatible with both @neondatabase/serverless <1.0 and >1.0\n    \n\nApril\n\n*   **Drizzle ORM Beta branch:**\n    \n    *   Relational Queries V2 released in Beta!\n    \n*   **Drizzle Studio updates:**\n    \n    *   Added fontSize settings option.\n    *   Added a multiline editor.\n    *   Changed JSON editor ui.\n    *   Fixed incorrect bigserial value handling.\n    \n*   **ORM release**\n    \n    *   Fixed incorrect types of schema enums in PostgreSQL\n    \n*   **ORM release**\n    \n    *   Added cross join\n    *   Added lateral left, inner, cross joins to PostgreSQL, MySQL, Gel, SingleStore\n    *   Added drizzle connection attributes to SingleStore's driver instances\n    *   Removed unsupported by dialect full join from MySQL select api\n    *   Forced Gel columns to always have explicit schema & table prefixes due to potential errors caused by lack of such prefix in subquery's selection when there's already a column bearing same name in context\n    *   Added missing export for PgTextBuilderInitial type\n    *   Removed outdated IfNotImported type check from SingleStore driver initializer\n    *   Fixed incorrect type inference for insert and update models with non-strict tsconfigs\n    *   Fixed invalid spelling of nowait flag\n    \n*   **Kit release**\n    \n    *   Enum DDL improvements\n    *   `esbuild` version upgrade\n    *   \\[\\[BUG\\]: Error on Malformed Array Literal\\](https://github.com/drizzle-team/drizzle-orm/issues/2715)\n    *   \\[\\[BUG\\]: Postgres drizzle-kit: Error while pulling indexes from a table with json/jsonb deep field index\\](https://github.com/drizzle-team/drizzle-orm/issues/2744)\n    *   \\[goog-vulnz flags CVE-2024-24790 in esbuild 0.19.7\\](https://github.com/drizzle-team/drizzle-orm/issues/4045)\n    \n*   **ORM release**\n    \n    *   Duplicate imports removal. When importing from drizzle-orm using custom loaders, you may encounter issues such as: `SyntaxError: The requested module 'drizzle-orm' does not provide an export named 'eq'`\n    *   `pgEnum` and `mysqlEnum` \\` now can accept both strings and TS enums\n    *   Make inArray accept ReadonlyArray as a value\n    *   Pass row type parameter to @planetscale/database's execute\n    *   New InferEnum type\n    \n\nMay\n\n*   **Drizzle ORM pre-release features:**List of features that are currently in open beta and will soon go live.\n    \n    *   Fully updated alternation engine for drizzle-kit. This change also increased drizzle-kit tests from 600 to 3000+ so far and is growing\n    *   MSSQL Support\n    *   CockroachDB Support\n    \n*   **Drizzle Studio updates:**\n    \n    *   Fixed saving bug in json cell editor.\n    *   Fixed resizing of columns in Safari browser.\n    *   Fixed a bug where FK constraints were not displayed if CHECK constraints existed.\n    \n*   **`drizzle-zod` v0.8.1 release** This version was released to resolve several compatibility issues with the ZodObject type, which were fixed in drizzle-orm@0.8.1, so version 0.8.0 was skipped\n    \n    *   Support for Zod v4: Starting with this release, drizzle-zod now requires Zod v3.25.1 or later\n    *   TS language server performance improvements\n    \n*   **Kit release**\n    \n    *   Fixed `drizzle-kit` pull bugs when using Gel extensions\n    \n\nJune\n\n*   **Drizzle ORM/Kit pre-release features: `alternation-engine` branch**\n    \n    *   Updated test cases for defaults values across all dialects\n    *   Updated test cases for constraints values across all dialects\n    *   Make each test run ~6-7 scenarios for generate, push and pull\n    *   Grow from 600 test cases to >7k test units\n    *   Implement Cockroach support in validator packages\n    *   Implement MSSQL support in validator packages\n    \n*   **Drizzle Seed pre-release features: `alternation-engine` branch**\n    \n    *   Add support for CockroachDB\n    *   Add support for MSSQL\n    *   Add support for SingleStore\n    \n*   **Drizzle Studio updates**\n    \n    *   Introduced a new page(`Database studio`) for managing the full database schema.\n    *   Integrated introspection and alternation engine from drizzle-kit.\n    *   Fixed JSONB datatype when exporting to csv.\n    *   Fix relation names.\n    *   Added data reload to cmd+R.\n    \n*   **ORM release**\n    \n    *   \\[BUG\\]: Fixed type issues with joins with certain variations of tsconfig: #4535, #4457\n    \n*   **OneDollarStats updates**\n    \n    *   B2B solutions: embedded UI and infrastructure\n    *   Database migration (accelerated by ~14x)\n    *   Time range comparison charts\n    *   Filters\n    *   Date range picker\n    \n\nthis month\n\n*   **ORM release**\n    \n    *   Fixed types of $client for clients created by drizzle function\n    *   Added the updated\\_at column to the neon\\_auth.users\\_sync table definition.\n    \n*   **Drizzle ORM pre-release features: `beta` branch**\n    \n    *   Possibility to split `defineRelations` into several configs\n    *   Type performance improvements\n    \n*   **Drizzle ORM/Kit pre-release features: `alternation-engine` branch**\n    \n    *   More work on defaults handling for push and pull commands\n    \n*   **OneDollarStats updates**\n    \n    *   Standardized charts for time zones using UTC\n    *   New stepped chart view\n    *   Added functionality to compare data with the previous time period.\n    *   Switched to UTM to standardize charts across different time zones.\n    *   Added a new stepped chart variant for the dashboard.\n    \n\nPerformance\n\nDrizzle doesn't slow you down\n\n[Go to benchmark results](/benchmarks)\n\nDrizzle\n\nv0.33.0\n\nPrisma\n\nv5.18.0\n\nLive on the edge\n\nWe support every major serverful and serverless runtime\n\n![live on the edge](/_astro/LiveOnTheEdgeDark.CgPTxF4M_Z2nI5Vo.webp)\n\nCloudflare Workers\n\nSupabase functions\n\nVercel functions\n\nCreated by potrace 1.15, written by Peter Selinger 2001-2017 Created by potrace 1.15, written by Peter Selinger 2001-2017 Deno deploy\n\nBun\n\nLagon\n\nFly.io\n\nElectronJS\n\nExpo\n\nReact Native\n\nBrowser\n\nConnect to any database\n\nWe support all platform-specific, tcp, http and websocket based drivers\n\n![connect everywhere](/_astro/ConnectEverywhereDark.Bw4Ib36a_1cSHm7.webp)\n\n[\n\nGel\n\n](https://driz.link/edgedb)\n\nPlanetScale\n\n[\n\nNeon\n\n](https://driz.link/neon)\n\nVercel Postgres\n\n[\n\nTurso\n\n](https://driz.link/turso)\n\nSupabase\n\n[\n\nXata\n\n](https://driz.link/xataio)\n\nPostgreSQL\n\n[\n\nTiDB\n\n](https://driz.link/silver-sponsor-tidb)\n\nMySQL\n\n[\n\nTembo\n\n](https://driz.link/tembo)\n\nLiteFS\n\n[\n\nSQLite Cloud\n\n](https://driz.link/sqlitecloud)\n\nSQLite\n\n[\n\nSingleStore\n\n](https://driz.link/singlestore)\n\nWeb SQLite\n\n[\n\nPrisma Postgres\n\n](https://driz.link/rickroll)\n\nDrizzle Studio\n\nExplore and manipulate your data\n\n![Drizzle Studio](/_astro/drizzle-studio-light.DiZyyUz0_29YhhA.webp) ![Drizzle Studio](/_astro/drizzle-studio-dark.DOdmLQgL_14oPWM.webp)\n\n[Documentation](/drizzle-studio/overview) [Live demo](https://demo.drizzle.studio)\n\nPricing\n\nJust kidding, Drizzle is free and open-source  \nYou can still make your contribution!\n\n[\n\nDax\n\n@thdxr\n\nI hate Drizzle\n\n](https://x.com/thdxr/status/1719129834901721353?s=20)[\n\nAnthony Shew\n\n@anthonysheww\n\nI hate @DrizzleOrm so much that I wrote the Auth.js adapter for it.\n\n](https://x.com/anthonysheww/status/1688973391917969408?s=20)\n\nSome Body\n\n@dont\\_know\n\nDjango had it in 2008\n\n[\n\nEddy Vinck\n\n@EddyVinckk\n\nI love @DrizzleORM that's it, that's the tweet\n\n](https://x.com/EddyVinckk/status/1770052528941478333?s=20)[\n\nJacob Wolf 🐝\n\n@JacobWolf\n\nI love @DrizzleORM.\n\n](https://x.com/JacobWolf/status/1768061278776349151?s=20)[\n\nTheo\n\n@t3dotgg\n\nDrizzle is terrible. It doesn’t even support Mongo.\n\n](https://x.com/t3dotgg/status/1787604253860847775)[\n\nAaron Francis\n\n@aarondfrancis\n\nY'all should just copy everything Eloquent has\n\n](https://x.com/aarondfrancis/status/1641145228189892613?s=20)[\n\nOfelquis Gimenes\n\n@imfelquis\n\nunpredictable results is what feeds the human race, ban Drizzle now and all this typing gibberish all together\n\n](https://x.com/imfelquis/status/1709919386931462516?s=20)[\n\nJames Perkins\n\n@james\\_r\\_perkins\n\nSorry @DrizzleORM you suck!\n\n![James Perkins](/_astro/jamesrperkinsTweet.3gik7CyO_Z4GoTR.webp)](https://x.com/james_r_perkins/status/1766156735155196201?s=20)[\n\ntslamoon\n\n@tslamoon1\n\nI'll shave my head if drizzle adds MSSQL support by the end of September.\n\n](https://x.com/tslamoon1/status/1700416378237530419?s=20)[\n\nfks\n\n@FredKSchott\n\nAstro DB is powered by Drizzle!... and we regret everything omg this thing sucks\n\n](https://x.com/FredKSchott/status/1767646959656194473?s=20)[\n\nRay\n\n@\\_raynirola\n\nDrizzleOrm is not an \"ORM\", it's merely a overrated typesafe sql wrapper, not even a query builder.\n\n](https://x.com/_raynirola/status/1666028176789872642?s=20)[\n\nSaltyAom\n\n@saltyAom\n\nPrisma Bun: 1.4 MB/s Drizzle Bun: 9.8 MB/s\n\n![SaltyAom](/_astro/saltyAomTweet.ClXMDolh_ZuFrDh.webp)](https://x.com/saltyAom/status/1767783124342276526?s=20)[\n\nChristoffer Bjelke\n\n@chribjel\n\nHow many times has this little shit snuck into your dependencies?\n\n![Christoffer Bjelke](/_astro/chribjelTweet.dH7N-57d_Z5EWgW.webp)](https://x.com/chribjel/status/1778851727954837727)[\n\nRoma Zvarych\n\n@hisbvdis\n\nI have finally switched from @prisma to @DrizzleORM. It was not easy. Dear Drizzle Team, you have created an awesome orm with awfull documentation. Anyway, good for you, thanks and good luck.\n\n](https://x.com/hisbvdis/status/1807783878515400977)[\n\nAoki\n\n@aokijs\n\nHonestly, fuck the benchmarks. I don‘t care which one‘s faster. All I can say is that Drizzle made my life working with databases dramastically better and that‘s all that matters for me. Thanks for your hard work 🙏🏻\n\n](https://x.com/aokijs/status/1833840766839325109)[\n\nMatija Marohnić\n\n@silvenon\n\nEvery time I hear about @DrizzleORM.\n\n![Matija Marohnić](/_astro/silvenonTweet.DyefeQXN_IADlq.webp)](https://x.com/silvenon/status/1843003214402314695)[\n\nJoseph Mama 🐀\n\n@spacesexdragon\n\n![Joseph Mama 🐀](/_astro/spacesexdragonTweet.CSDcE1N1_ZXbfMD.webp)](https://x.com/spacesexdragon/status/1843381135134675236)[\n\nBroda Noel\n\n@BrodaNoel\n\nIs this a joke? Because if this is a joke, it's really really really bad joke, because now I'm fucking hating @DrizzleORM without even knowing who they are. I mean, this is not a good marketing strategy if this was a marketing-joke. And if it's actually true, I'll hate them more.\n\n](https://x.com/BrodaNoel/status/1913248949252616287)\n\nThe action has been successful\n\n![Logo](chrome-extension://pdhckheipnhhebkofhgmbfjneblopace/assets/logoCricle.png)",
              },
            ],
          },
        },
      ],
    },
  ],
  trigger: 'submit-tool-result',
}
