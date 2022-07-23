import type { WritableComputedRef } from '@vue/reactivity'
import { useState } from '#app'
import useProject from '~/composables/useProject'

export interface TabItem {
  type: 'table' | 'view'
  title: string
  id: string
}

export default () => {
  const tabs = useState<TabItem[]>('tabs', () => [])
  // const activeTab = useState<number>('activeTab', () => 0)

  const route = useRoute()
  const router = useRouter()
  const { tables } = useProject()

  const activeTab: WritableComputedRef<number> = computed({
    get() {
      if ((route?.name as string)?.startsWith('nc-projectId-index-index-table-title') && tables?.value?.length) {
        const tab: Partial<TabItem> = { type: 'table', title: route.params.title as string }
        const id = tables.value?.find((t) => t.title === tab.title)?.id
        tab.id = id as string
        let index = tabs.value.findIndex((t) => t.id === tab.id)
        if (index === -1) {
          tabs.value.push(tab as TabItem)
          index = tabs.value.length - 1
        }
        return index
      }
      return -1
    },
    set(index: number) {
      if (index === -1) {
        router.push(`/nc/${route.params.projectId}`)
      } else {
        router.push(`/nc/${route.params.projectId}/table/${tabs.value?.[index]?.title}`)
      }
    },

    // if (route.params.title) {
    //   const tab = tabs.value.find(t => t.id === route.params.tab)
    //   if (tab) {
    //     activeTab.value = tabs.value.indexOf(tab)
    //   }
    // }
  })

  const addTab = (tabMeta: TabItem) => {
    const tabIndex = tabs.value.findIndex((tab) => tab.id === tabMeta.id)
    // if tab already found make it active
    if (tabIndex > -1) {
      activeTab.value = tabIndex
    }
    // if tab not found add it
    else {
      tabs.value = [...(tabs.value || []), tabMeta]
      activeTab.value = tabs.value.length - 1
    }
  }
  const clearTabs = () => {
    tabs.value = []
  }
  const closeTab = (index: number) => {
    if (activeTab.value === index) {
      activeTab.value = -1
    }
    tabs.value.splice(index, 1)
  }

  return { tabs, addTab, activeTab, clearTabs, closeTab }
}
