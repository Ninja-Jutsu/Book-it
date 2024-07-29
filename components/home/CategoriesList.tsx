import { categories } from '@/utils/categories'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import Link from 'next/link'

function CategoriesList({ category, search }: Props) {
  // combine the search query param with the category
  const searchTerm = search ? `&search=${search}` : ''
  return (
    <section className='flex justify-center'>
      <ScrollArea className='py-2'>
        <div className='flex gap-x-4'>
          {categories.map((item) => {
            const isActive = item.label === category
            return (
              <Link
                key={item.label}
                href={`/?category=${item.label}${searchTerm}`}
              >
                <article
                  className={`p-2 flex flex-col items-center cursor-pointer duration-300 hover:text-primary w-[100px] ${
                    isActive && 'text-primary'
                  }`}
                >
                  <item.icon className='w-8 h-8' />
                  <p className='capitalize text-sm mt-1'>{item.label}</p>
                </article>
              </Link>
            )
          })}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </section>
  )
}

export default CategoriesList

type Props = {
  category?: string
  search?: string
}
