import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ComboboxProps {
  options: { label: string; value: string }[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  onCreate?: (val: string) => void
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  emptyText = 'Nenhum resultado encontrado.',
  onCreate,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const selectedLabel = options.find((o) => o.value === value)?.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          <span className="truncate">{selectedLabel || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Pesquisar..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>
              {onCreate && search ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2 py-1.5 text-sm font-normal"
                  onClick={() => {
                    onCreate(search)
                    setOpen(false)
                    setSearch('')
                  }}
                >
                  Criar "{search}"
                </Button>
              ) : (
                <span className="py-2 px-4 text-sm text-muted-foreground block">{emptyText}</span>
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value === value ? '' : option.value)
                    setOpen(false)
                    setSearch('')
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
