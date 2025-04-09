import { v4 as uuidv4 } from "uuid"

export type SimpleItem = {
  id: string
  name: string
  quantity: number
  completed: boolean
}

export type ComplexItem = SimpleItem & {
  category: string
  price: number
}

export type ShoppingList = {
  id: string
  name: string
  type: "simple" | "complex"
  items: SimpleItem[] | ComplexItem[]
  budget?: number
  createdAt: Date
}

const STORAGE_KEY = "shopping-lists"

export function getShoppingLists(): ShoppingList[] {
  if (typeof window === "undefined") return []
  const lists = localStorage.getItem(STORAGE_KEY)
  return lists ? JSON.parse(lists) : []
}

export function saveShoppingLists(lists: ShoppingList[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
}

export function getShoppingList(id: string): ShoppingList | undefined {
  const lists = getShoppingLists()
  return lists.find((list) => list.id === id)
}

export function createShoppingList(name: string, type: "simple" | "complex", budget?: number): ShoppingList {
  const newList: ShoppingList = {
    id: uuidv4(),
    name,
    type,
    items: [],
    budget,
    createdAt: new Date(),
  }
  const lists = getShoppingLists()
  lists.push(newList)
  saveShoppingLists(lists)
  return newList
}

export function updateShoppingList(updatedList: ShoppingList) {
  const lists = getShoppingLists()
  const index = lists.findIndex((list) => list.id === updatedList.id)
  if (index !== -1) {
    lists[index] = updatedList
    saveShoppingLists(lists)
  }
}

export function deleteShoppingList(id: string) {
  const lists = getShoppingLists()
  const updatedLists = lists.filter((list) => list.id !== id)
  saveShoppingLists(updatedLists)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" }).format(price)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

