"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthContextType } from "@/types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo purposes
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@nccr.gov",
    password: "admin123",
    role: "NCCR",
    name: "NCCR Administrator",
  },
  {
    id: "2",
    email: "authority@region1.gov",
    password: "auth123",
    role: "LOCAL_AUTHORITY",
    name: "Regional Authority",
    region: "Region 1",
  },
  {
    id: "3",
    email: "ngo@greenearth.org",
    password: "ngo123",
    role: "NGO",
    name: "Green Earth NGO",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("carbon-registry-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (!foundUser) {
      setIsLoading(false)
      throw new Error("Invalid credentials")
    }

    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem("carbon-registry-user", JSON.stringify(userWithoutPassword))
    setIsLoading(false)
  }

  const registerLocalAuthority = async (data: {
    district: string
    uniqueName: string
    password: string
    state: string
    city: string
  }) => {
    const newUser = {
      id: Date.now().toString(),
      email: `${data.uniqueName.toLowerCase().replace(/\s+/g, "")}@${data.district.toLowerCase()}.gov`,
      password: data.password,
      role: "LOCAL_AUTHORITY" as const,
      name: data.uniqueName,
      region: `${data.district}, ${data.state}`,
      district: data.district,
      state: data.state,
      city: data.city,
    }

    mockUsers.push(newUser)
    return { success: true, user: newUser }
  }

  const registerNGO = async (data: {
    organizationName: string
    uniqueId: string
    password: string
    district: string
    state: string
  }) => {
    const newUser = {
      id: Date.now().toString(),
      email: `${data.uniqueId.toLowerCase()}@${data.organizationName.toLowerCase().replace(/\s+/g, "")}.org`,
      password: data.password,
      role: "NGO" as const,
      name: data.organizationName,
      uniqueId: data.uniqueId,
      district: data.district,
      state: data.state,
    }

    mockUsers.push(newUser)
    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("carbon-registry-user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        registerLocalAuthority,
        registerNGO,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
