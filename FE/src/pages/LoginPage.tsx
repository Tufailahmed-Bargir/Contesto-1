import type React from "react"
 
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
 
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await login(formData.email, formData.password, formData.name)
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.response?.data?.msg || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with pink accent */}
      <div className="w-full h-2 bg-blue-500" />

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-blue-500 p-3 rounded-full">
                <Code className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">Welcome to Contest Tracker</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to track contests from Codeforces, CodeChef, and LeetCode in one place
            </p>
          </div>

          <div className="mt-8 bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-500 hover:bg-blue-300 text-white"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>

      <footer className="py-4 text-center text-sm text-gray-500">© 2025 Contest Tracker. All rights reserved.</footer>
    </div>
  )
}
