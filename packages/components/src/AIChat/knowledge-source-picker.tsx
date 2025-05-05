'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Check, ChevronDown, Database, Search, X } from 'lucide-react'
import { localDB } from '@penx/local-db'
import { IArea } from '@penx/model-type/IArea'
import { Button } from '@penx/uikit/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@penx/uikit/dropdown-menu'
import { Input } from '@penx/uikit/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@penx/uikit/tooltip'
import { cn, getUrl } from '@penx/utils'

interface KnowledgeSourcePickerProps {
  onSourceChange?: (areaId: string | null) => void
  className?: string
}

export const KnowledgeSourcePicker = ({
  onSourceChange,
  className,
}: KnowledgeSourcePickerProps) => {
  const [areas, setAreas] = useState<IArea[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredAreas, setFilteredAreas] = useState<IArea[]>([])

  // Fetch areas from localDB
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true)
        const areasData = await localDB.area.toArray()
        setAreas(areasData)
        setFilteredAreas(areasData)
      } catch (error) {
        console.error('Error fetching areas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAreas()
  }, [])

  // Filter areas when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAreas(areas)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = areas.filter(
      (area) =>
        area.name.toLowerCase().includes(query) ||
        (area.description && area.description.toLowerCase().includes(query)),
    )
    setFilteredAreas(filtered)
  }, [searchQuery, areas])

  const handleSelectArea = (areaId: string | null) => {
    setSelectedArea(areaId)
    onSourceChange?.(areaId)
    setIsOpen(false)
    setSearchQuery('')
  }

  const getSelectedAreaName = () => {
    if (!selectedArea) return 'All Knowledge'
    const area = areas.find((a) => a.id === selectedArea)
    return area ? area.name : 'All Knowledge'
  }

  return (
    <div className={cn('relative px-2', className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-foreground/10 flex h-7 items-center justify-center gap-1 rounded-md px-2"
              >
                <BookOpen size={16} />
                <span className="max-w-24 truncate text-xs">
                  {getSelectedAreaName()}
                </span>
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>{getSelectedAreaName()}</TooltipContent>
        </Tooltip>

        <DropdownMenuContent
          align="start"
          className="w-64 rounded-md shadow-md"
        >
          {/* Search Input */}
          <div className="p-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
              <Input
                placeholder="Search knowledge bases..."
                className="h-8 pl-7 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 size-6 -translate-y-1/2 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          <DropdownMenuSeparator className="my-0.5" />

          <DropdownMenuGroup>
            <DropdownMenuItem
              className={cn('flex items-center justify-between p-2 text-sm')}
              onClick={() => handleSelectArea(null)}
            >
              <div className="flex items-center">
                <Database className="mr-2 h-4 w-4" />
                <span className="font-medium">All Knowledge</span>
              </div>
              {!selectedArea && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {loading ? (
            <div className="text-muted-foreground py-4 text-center text-xs">
              Loading...
            </div>
          ) : filteredAreas.length > 0 ? (
            <>
              <div className="max-h-60 overflow-y-auto">
                <DropdownMenuGroup>
                  {filteredAreas.map((area) => (
                    <DropdownMenuItem
                      key={area.id}
                      className={cn(
                        'flex items-center justify-between p-2 text-sm',
                      )}
                      onClick={() => handleSelectArea(area.id)}
                    >
                      <div className="flex items-center">
                        {area.logo ? (
                          <img
                            src={getUrl(area.logo)}
                            alt={area.name}
                            className="mr-2 h-4 w-4 rounded-sm object-cover"
                          />
                        ) : (
                          <BookOpen className="mr-2 h-4 w-4" />
                        )}
                        <span className="truncate font-medium">
                          {area.name}
                        </span>
                      </div>
                      {selectedArea === area.id && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground py-4 text-center text-xs">
              No knowledge bases found
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
