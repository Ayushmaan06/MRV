export type UserRole = "NCCR" | "LOCAL_AUTHORITY" | "NGO"

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  region?: string // For Local Authority users
  district?: string
  state?: string
  city?: string
  uniqueId?: string // For NGO users
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  registerLocalAuthority?: (data: {
    district: string
    uniqueName: string
    password: string
    state: string
    city: string
  }) => Promise<{ success: boolean; user: any }>
  registerNGO?: (data: {
    organizationName: string
    uniqueId: string
    password: string
    district: string
    state: string
  }) => Promise<{ success: boolean; user: any }>
}
