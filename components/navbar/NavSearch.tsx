'use client'
import { Input } from '../ui/input'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useState, useEffect } from 'react'
function NavSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParam = searchParams.get('search')

  const [search, setSearch] = useState(searchParam?.toString() || '')

  // we don't want this func to run on every key stroke: we use debounce to set a time-frame
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    // replace to the home page with the other params untouched
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  // Every time searchParam has no value, remove it:
  useEffect(() => {
    if (!searchParam) {
      setSearch('')
    }
  }, [searchParam])

  return (
    <Input
      type='text'
      placeholder='Find a property'
      className='max-w-md py-6 dark:bg-muted text-xl'
      value={search}
      onChange={(e) => {
        const value = e.target.value
        setSearch(value)
        handleSearch(value)
      }}
    />
  )
}

export default NavSearch
