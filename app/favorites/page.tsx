import { EmptyList, PropertiesList } from '@/components/home'
import { fetchFavorites } from '@/utils/actions/favoritesActions'

async function FavoritePage() {
  const favorites = await fetchFavorites()

  if (favorites.length === 0) return <EmptyList />
  return <PropertiesList properties={favorites} />
}

export default FavoritePage
