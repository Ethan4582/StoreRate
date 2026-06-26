import { SavedStoresList } from "@/components/saved-stores-list"

export default function SavedStoresPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Saved Stores</h1>
        <p className="text-slate-500">View the stores you have bookmarked for quick access</p>
      </div>
      
      <SavedStoresList />
    </>
  )
}
