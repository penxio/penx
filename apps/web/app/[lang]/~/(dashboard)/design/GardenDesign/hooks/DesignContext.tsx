'use client'

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { defaultLayouts } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { LayoutItem } from '@penx/types'
import { useThemeName } from '../../hooks/useThemeName'

export enum Device {
  MOBILE = 'MOBILE',
  PC = 'PC',
}

export enum BarType {
  COMPONENT = 'COMPONENT',
  SETTINGS = 'SETTINGS',
}

export enum DesignMode {
  CLASSIC = 'CLASSIC',
  GRID = 'GRID',
}

type Context = {
  device: Device
  setDevice: Dispatch<SetStateAction<Device>>
  barType: BarType
  setBarType: Dispatch<SetStateAction<BarType>>
  isMobile: boolean
  config: Config
  setConfig: Dispatch<SetStateAction<Config>>
  setLayout: Dispatch<SetStateAction<LayoutItem[]>>
  layout: LayoutItem[]
  formattedLayout: any
}

export const DesignContext = createContext({} as Context)

export interface Config {
  bgColor: string
  containerWidth: number
  rowHeight: number
  margin: number
}

export const DesignProvider = ({ children }: PropsWithChildren) => {
  const [barType, setBarType] = useState<BarType>(BarType.COMPONENT)
  const [device, setDevice] = useState<Device>(Device.PC)
  const isMobile = device === Device.MOBILE
  const site = useSiteContext()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>
  const { themeName } = useThemeName()

  const initialLayout: LayoutItem[] = themeConfig?.[themeName]?.layout
    ? themeConfig?.[themeName]?.layout
    : defaultLayouts

  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout)
  const [config, setConfig] = useState<Config>({
    bgColor: themeConfig?.[themeName]?.common?.bgColor || '#fff',
    containerWidth: themeConfig?.[themeName]?.common?.containerWidth || 900,
    rowHeight: themeConfig?.[themeName]?.common?.rowHeight || 90,
    margin: themeConfig?.[themeName]?.common?.margin || 30,
  })

  const formattedLayout = layout.map((item) => {
    const getValue = (value: any, isMobile: boolean): number => {
      if (!Array.isArray(value)) return value
      return isMobile ? value[0] : value[1]
    }
    return {
      ...item,
      x: getValue(item.x, isMobile),
      y: getValue(item.y, isMobile),
      h: getValue(item.h, isMobile),
      w: getValue(item.w, isMobile),
    }
  })

  return (
    <DesignContext.Provider
      value={{
        device,
        setDevice,
        config,
        setConfig,
        barType,
        setBarType,
        isMobile,
        layout,
        setLayout,
        formattedLayout,
      }}
    >
      {children}
    </DesignContext.Provider>
  )
}

export function useDesignContext() {
  return useContext(DesignContext)
}
