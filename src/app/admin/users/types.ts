export interface Admin {
  id: number
  username: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AdminFormData {
  username: string
  password: string
  name?: string
}
