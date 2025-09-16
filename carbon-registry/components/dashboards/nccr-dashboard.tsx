"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, Award, TrendingUp, Users, MapPin, Calendar, Hash, UserPlus } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface VerifiedSubmission {
  id: string
  ngoName: string
  projectTitle: string
  verificationDate: string
  location: string
  localAuthority: string
  estimatedCredits: number
  status: "verified" | "credits_issued"
  ipfsHash: string
}

export function NCCRDashboard() {
  const { user, registerLocalAuthority } = useAuth()
  const [verifiedSubmissions, setVerifiedSubmissions] = useState<VerifiedSubmission[]>([
    {
      id: "1",
      ngoName: "Green Earth NGO",
      projectTitle: "Forest Restoration Project - Phase 1",
      verificationDate: "2024-01-15",
      location: "Ganges Basin, Brazil",
      localAuthority: "Regional Authority - Brazil",
      estimatedCredits: 150,
      status: "credits_issued",
      ipfsHash: "QmX7Vz9K2mN8pL4qR6sT3uW1yE5oI9nM7kJ6hG4fD2cA8b",
    },
    {
      id: "2",
      ngoName: "Coastal Conservation Corp",
      projectTitle: "Mangrove Restoration",
      verificationDate: "2024-01-18",
      location: "Chittagong, India",
      localAuthority: "Regional Authority - India",
      estimatedCredits: 85,
      status: "verified",
      ipfsHash: "QmZ9Xa1M4oP0rN6sU8vY7wZ1aG2qK9nM8lJ7iI6hF4eC0d",
    },
    {
      id: "3",
      ngoName: "Solar Future Initiative",
      projectTitle: "Rural Solar Panel Installation",
      verificationDate: "2024-01-19",
      location: "Nairobi County, Sikkim",
      localAuthority: "Regional Authority - Sikkim",
      estimatedCredits: 120,
      status: "verified",
      ipfsHash: "QmY8Wz0L3nO9qM5rS7tU2vX6zF0pJ8oL7mK9iH5gE3dB9c",
    },
  ])

  // Mock data for charts
  const creditsOverTime = [
    { month: "Oct", credits: 120 },
    { month: "Nov", credits: 180 },
    { month: "Dec", credits: 240 },
    { month: "Jan", credits: 355 },
  ]

  const creditsByNGO = [
    { ngo: "Green Earth", credits: 150 },
    { ngo: "Solar Future", credits: 120 },
    { ngo: "Coastal Corp", credits: 85 },
  ]

  const handleIssueCredits = (submissionId: string) => {
    setVerifiedSubmissions((prev) =>
      prev.map((sub) => (sub.id === submissionId ? { ...sub, status: "credits_issued" as const } : sub)),
    )
  }

  const totalCreditsIssued = verifiedSubmissions
    .filter((s) => s.status === "credits_issued")
    .reduce((sum, s) => sum + s.estimatedCredits, 0)

  const pendingVerifications = verifiedSubmissions.filter((s) => s.status === "verified").length
  const totalNGOs = new Set(verifiedSubmissions.map((s) => s.ngoName)).size

  const [laForm, setLaForm] = useState({
    district: "",
    uniqueName: "",
    password: "",
    state: "",
    city: "",
  })
  const [isRegistering, setIsRegistering] = useState(false)

  const handleRegisterLA = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)
    try {
      await registerLocalAuthority(laForm)
      setLaForm({ district: "", uniqueName: "", password: "", state: "", city: "" })
      alert("Local Authority registered successfully!")
    } catch (error) {
      alert("Registration failed. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">NCCR Admin Dashboard</h1>
          <p className="text-muted-foreground">National Carbon Credit Registry - Administrative Overview</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Register Local Authority</span>
            </CardTitle>
            <CardDescription>
              Register a new Local Authority to verify carbon offset projects in their region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterLA} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={laForm.district}
                    onChange={(e) => setLaForm({ ...laForm, district: e.target.value })}
                    placeholder="Enter district name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uniqueName">Unique Name</Label>
                  <Input
                    id="uniqueName"
                    value={laForm.uniqueName}
                    onChange={(e) => setLaForm({ ...laForm, uniqueName: e.target.value })}
                    placeholder="Enter unique identifier"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={laForm.password}
                    onChange={(e) => setLaForm({ ...laForm, password: e.target.value })}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={laForm.state} onValueChange={(value) => setLaForm({ ...laForm, state: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="west-bengal">West Bengal</SelectItem>
                      <SelectItem value="kerala">Kerala</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={laForm.city}
                    onChange={(e) => setLaForm({ ...laForm, city: e.target.value })}
                    placeholder="Enter city name"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={isRegistering} className="w-full md:w-auto">
                {isRegistering ? "Registering..." : "Register Local Authority"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits Issued</CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCreditsIssued}</div>
              <p className="text-xs text-muted-foreground">Carbon credits in circulation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Finalizations</CardTitle>
              <CheckCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingVerifications}</div>
              <p className="text-xs text-muted-foreground">Awaiting credit issuance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active NGOs</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNGOs}</div>
              <p className="text-xs text-muted-foreground">Registered organizations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+47%</div>
              <p className="text-xs text-muted-foreground">Credits issued this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Credits Issued Over Time</CardTitle>
              <CardDescription>Monthly carbon credit issuance trend</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={creditsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="credits" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credits by NGO</CardTitle>
              <CardDescription>Distribution of issued credits across organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={creditsByNGO}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ngo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="credits" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Verified Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Verified Submissions</CardTitle>
            <CardDescription>Projects verified by local authorities awaiting final credit issuance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {verifiedSubmissions.map((submission) => (
                <div key={submission.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{submission.projectTitle}</h3>
                        <Badge
                          className={
                            submission.status === "credits_issued"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }
                        >
                          {submission.status === "credits_issued" ? "Credits Issued" : "Ready for Issuance"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {submission.ngoName} • Verified by {submission.localAuthority}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">{submission.estimatedCredits}</div>
                      <div className="text-xs text-muted-foreground">Credits</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{submission.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Verified: {submission.verificationDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs truncate">{submission.ipfsHash}</span>
                    </div>
                  </div>

                  {submission.status === "verified" && (
                    <div className="flex justify-end pt-4 border-t">
                      <Button onClick={() => handleIssueCredits(submission.id)} className="flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span>Issue Carbon Credits</span>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
