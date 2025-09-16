"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Leaf, Shield, Users, CheckCircle, Globe, TrendingUp, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    }
  }

  const demoCredentials = [
    { role: "NCCR Admin", email: "admin@nccr.gov", password: "admin123", icon: Shield },
    { role: "Local Authority", email: "authority@region1.gov", password: "auth123", icon: Users },
    { role: "NGO", email: "ngo@greenearth.org", password: "ngo123", icon: Leaf },
  ]

  const features = [
    {
      icon: Lock,
      title: "Secure Authentication",
      description: "Enterprise-grade security with encrypted credentials"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your dashboard from anywhere in the world"
    },
    {
      icon: TrendingUp,
      title: "Real-time Data",
      description: "Live updates on your carbon credit activities"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-purple-50/40 via-green-50/30 to-blue-50/50 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Content */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-lg">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Leaf className="h-10 w-10 text-green-500" />
                </div>
                <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Carbon Registry
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-green-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                Welcome to the Future of Carbon Management
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Access your personalized dashboard to track, verify, and manage carbon credits with cutting-edge blockchain technology.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md space-y-6">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Sign In
                </CardTitle>
                
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-colors"
                      placeholder="Enter your password"
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Demo Credentials</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoCredentials.map((cred, index) => {
                  const Icon = cred.icon
                  return (
                    <div 
                      key={index} 
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-150 transition-all duration-200 cursor-pointer group"
                      onClick={() => {
                        setEmail(cred.email)
                        setPassword(cred.password)
                      }}
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 group-hover:from-green-500/30 group-hover:to-blue-500/30 transition-colors">
                        <Icon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{cred.role}</div>
                        <div className="text-sm text-gray-600">
                          {cred.email} / {cred.password}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
