"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getShoppingLists,
  createShoppingList,
  deleteShoppingList,
  type ShoppingList,
  formatPrice,
  formatDate,
} from "@/lib/storage"

export default function Home() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [newListName, setNewListName] = useState("")
  const [newListType, setNewListType] = useState<"simple" | "complex">("simple")
  const [newBudget, setNewBudget] = useState("")

  useEffect(() => {
    setLists(getShoppingLists())
  }, [])

  const addList = () => {
    if (newListName.trim() !== "") {
      if (newListType === "simple") {
        const newList = createShoppingList(newListName, "simple")
        setLists([...lists, newList])
        setNewListName("")
      } else if (newListType === "complex" && newBudget.trim() !== "") {
        const budget = Number.parseFloat(newBudget)
        if (!isNaN(budget)) {
          const newList = createShoppingList(newListName, "complex", budget)
          setLists([...lists, newList])
          setNewListName("")
          setNewBudget("")
        }
      }
    }
  }

  const removeList = (id: string) => {
    deleteShoppingList(id)
    setLists(lists.filter((list) => list.id !== id))
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Mis Listas de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Nombre de la nueva lista..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="flex-grow"
            />
            <Select value={newListType} onValueChange={(value: "simple" | "complex") => setNewListType(value)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Tipo de lista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Lista Simple</SelectItem>
                <SelectItem value="complex">Lista Compleja</SelectItem>
              </SelectContent>
            </Select>
            {newListType === "complex" && (
              <Input
                type="number"
                placeholder="Presupuesto (DOP)"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-full sm:w-auto"
              />
            )}
            <Button onClick={addList} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Lista
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <Card key={list.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{list.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{list.items.length} items</p>
                  {list.type === "complex" && <p>Presupuesto: {formatPrice(list.budget || 0)}</p>}
                  <p>Tipo: {list.type === "simple" ? "Simple" : "Compleja"}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Creada el: {formatDate(new Date(list.createdAt))}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href={`/list/${list.id}`}>Ver Lista</Link>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => removeList(list.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

