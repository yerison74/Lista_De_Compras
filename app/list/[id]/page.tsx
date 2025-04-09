"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Share2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getShoppingList, type ShoppingList } from "@/lib/storage"
import { SimpleList } from "@/components/SimpleList"
import { ComplexList } from "@/components/ComplexList"

export default function ShoppingListPage({ params }: { params: { id: string } }) {
  const [list, setList] = useState<ShoppingList | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchedList = getShoppingList(params.id)
    if (fetchedList) {
      setList(fetchedList)
    } else {
      router.push("/")
    }
  }, [params.id, router])

  const shareList = () => {
    const shareUrl = `${window.location.origin}/shared/${params.id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success("Enlace copiado al portapapeles")
  }

  if (!list) return null

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
      <ToastContainer />
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <Button variant="ghost" onClick={() => router.push("/")} className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
          <CardTitle className="text-2xl font-bold text-center">{list.name}</CardTitle>
          <Button variant="ghost" onClick={shareList} className="w-full sm:w-auto">
            <Share2 className="h-4 w-4 mr-2" /> Compartir
          </Button>
        </CardHeader>
        <CardContent>
          {list.type === "simple" ? (
            <SimpleList list={list} onUpdate={setList} />
          ) : (
            <ComplexList list={list} onUpdate={setList} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

