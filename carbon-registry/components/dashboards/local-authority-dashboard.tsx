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
import { CheckCircle, XCircle, MapPin, Clock, ImageIcon, Hash, UserPlus } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface NGOSubmission {
  id: string
  ngoName: string
  projectTitle: string
  submissionDate: string
  location: {
    coordinates: string
    address: string
  }
  timestamp: string
  ipfsHash: string
  imagePreview: string
  status: "pending" | "verified" | "rejected"
  description: string
}

export function LocalAuthorityDashboard() {
  const { user, registerNGO } = useAuth()
  const [submissions, setSubmissions] = useState<NGOSubmission[]>([
    {
      id: "1",
      ngoName: "Green Earth NGO",
      projectTitle: "Forest Restoration Project - Phase 1",
      submissionDate: "2024-01-20",
      location: {
        coordinates: "-3.4653, -62.2159",
        address: "Ganges Basin, Brazil",
      },
      timestamp: "2024-01-20T14:30:00Z",
      ipfsHash: "QmX7Vz9K2mN8pL4qR6sT3uW1yE5oI9nM7kJ6hG4fD2cA8b",
      imagePreview: "/forest-restoration-project-aerial-view.jpg",
      status: "pending",
      description: "Reforestation of 50 hectares with native species including Brazil nut trees and mahogany.",
    },
    {
      id: "2",
      ngoName: "Solar Future Initiative",
      projectTitle: "Rural Solar Panel Installation",
      submissionDate: "2024-01-19",
      location: {
        coordinates: "-1.2921, 36.8219",
        address: "Nairobi County, Sikkim",
      },
      timestamp: "2024-01-19T10:15:00Z",
      ipfsHash: "QmY8Wz0L3nO9qM5rS7tU2vX6zF0pJ8oL7mK9iH5gE3dB9c",
      imagePreview: "/solar-panels-installation-rural-africa.jpg",
      status: "pending",
      description: "Installation of 200 solar panels providing clean energy to 150 rural households.",
    },
    {
      id: "3",
      ngoName: "Coastal Conservation Corp",
      projectTitle: "Mangrove Restoration",
      submissionDate: "2024-01-18",
      location: {
        coordinates: "22.3569, 91.7832",
        address: "Chittagong, India",
      },
      timestamp: "2024-01-18T16:45:00Z",
      ipfsHash: "QmZ9Xa1M4oP0rN6sU8vY7wZ1aG2qK9nM8lJ7iI6hF4eC0d",
      imagePreview: "/mangrove-restoration-coastal-area.jpg",
      status: "verified",
      description: "Restoration of 25 hectares of mangrove ecosystem along the coastal region.",
    },
  ])

  const handleVerify = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === submissionId ? { ...sub, status: "verified" as const } : sub)),
    )
  }

  const handleReject = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === submissionId ? { ...sub, status: "rejected" as const } : sub)),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const pendingCount = submissions.filter((s) => s.status === "pending").length
  const verifiedCount = submissions.filter((s) => s.status === "verified").length
  const rejectedCount = submissions.filter((s) => s.status === "rejected").length

  const [ngoForm, setNgoForm] = useState({
    organizationName: "",
    uniqueId: "",
    password: "",
    district: user?.region || "",
    state: "",
  })
  const [isRegistering, setIsRegistering] = useState(false)

  const handleRegisterNGO = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)
    try {
      await registerNGO(ngoForm)
      setNgoForm({ organizationName: "", uniqueId: "", password: "", district: user?.region || "", state: "" })
      alert("NGO/Community registered successfully!")
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
          <h1 className="text-3xl font-bold text-foreground">Local Authority Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name} - {user?.region}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Register NGO/Community</span>
            </CardTitle>
            <CardDescription>Register a new NGO or Community organization under your jurisdiction</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterNGO} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    value={ngoForm.organizationName}
                    onChange={(e) => setNgoForm({ ...ngoForm, organizationName: e.target.value })}
                    placeholder="Enter organization name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uniqueId">Unique ID</Label>
                  <Input
                    id="uniqueId"
                    value={ngoForm.uniqueId}
                    onChange={(e) => setNgoForm({ ...ngoForm, uniqueId: e.target.value })}
                    placeholder="Enter unique identifier"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ngoPassword">Password</Label>
                  <Input
                    id="ngoPassword"
                    type="password"
                    value={ngoForm.password}
                    onChange={(e) => setNgoForm({ ...ngoForm, password: e.target.value })}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ngoDistrict">District</Label>
                  <Input
                    id="ngoDistrict"
                    value={ngoForm.district}
                    onChange={(e) => setNgoForm({ ...ngoForm, district: e.target.value })}
                    placeholder="District (auto-filled)"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ngoState">State</Label>
                  <Select value={ngoForm.state} onValueChange={(value) => setNgoForm({ ...ngoForm, state: value })}>
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
              </div>
              <Button type="submit" disabled={isRegistering} className="w-full md:w-auto">
                {isRegistering ? "Registering..." : "Register NGO/Community"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Projects</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifiedCount}</div>
              <p className="text-xs text-muted-foreground">Successfully verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected Submissions</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground">Did not meet criteria</p>
            </CardContent>
          </Card>
        </div>

        {/* NGO Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>NGO Submissions</CardTitle>
            <CardDescription>
              Review and verify carbon offset project submissions from NGOs in your region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {submissions.map((submission) => (
                <div key={submission.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{submission.projectTitle}</h3>
                        <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Submitted by: {submission.ngoName}</p>
                      <p className="text-sm">{submission.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image Preview */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center space-x-1">
                        <ImageIcon className="h-4 w-4" />
                        <span>Project Image</span>
                      </h4>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer border rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                            <img
                              src={submission.imagePreview || "/placeholder.svg"}
                              alt={submission.projectTitle}
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{submission.projectTitle}</DialogTitle>
                            <DialogDescription>Project verification image</DialogDescription>
                          </DialogHeader>
                          <img
                            src={submission.imagePreview || "/placeholder.svg"}
                            alt={submission.projectTitle}
                            className="w-full h-auto rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>Location</span>
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          <p>{submission.location.address}</p>
                          <p className="font-mono text-xs">GPS: {submission.location.coordinates}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Timestamp</span>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(submission.timestamp).toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center space-x-1">
                          <Hash className="h-4 w-4" />
                          <span>IPFS Hash</span>
                        </h4>
                        <p className="text-xs font-mono text-muted-foreground break-all">{submission.ipfsHash}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {submission.status === "pending" && (
                    <div className="flex space-x-2 pt-4 border-t">
                      <Button
                        onClick={() => handleVerify(submission.id)}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Verify</span>
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(submission.id)}
                        className="flex items-center space-x-2"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
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
