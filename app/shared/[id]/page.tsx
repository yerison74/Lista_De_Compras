"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { getShoppingList, type ShoppingList, formatPrice } from "@/lib/storage"

export default function SharedListPage({ params }: { params: { id: string } }) {
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

  if (!list) return null

  const renderSimpleList = () => (
    <div className="space-y-2">
      {list.items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-secondary p-2 rounded-md"
        >
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <Checkbox checked={item.completed} disabled />
            <span className={`${item.completed ? "line-through text-muted-foreground" : ""}`}>{item.name}</span>
          </div>
          <span>{item.quantity}</span>
        </div>
      ))}
    </div>
  )

  const renderComplexList = () => {
    const total = list.items.reduce((sum, item) => sum + (item as any).price * (item as any).quantity, 0)
    const progress = list.budget ? Math.min((total / list.budget) * 100, 100) : 0

    return (
      <>
        <div className="mb-4 space-y-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <p>Presupuesto: {formatPrice(list.budget || 0)}</p>
            <p>Total: {formatPrice(total)}</p>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
        <div className="space-y-2">
          {list.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-secondary p-2 rounded-md"
            >
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <Checkbox checked={item.completed} disabled />
                <span className={`${item.completed ? "line-through text-muted-foreground" : ""}`}>{item.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <span className="text-sm text-muted-foreground">{(item as any).category}</span>
                <span>{formatPrice((item as any).price)}</span>
                <span>x{(item as any).quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <Button variant="ghost" onClick={() => router.push("/")} className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
          <CardTitle className="text-2xl font-bold text-center">{list.name}</CardTitle>
        </CardHeader>
        <CardContent>{list.type === "simple" ? renderSimpleList() : renderComplexList()}</CardContent>
      </Card>
    </div>
  )
}

