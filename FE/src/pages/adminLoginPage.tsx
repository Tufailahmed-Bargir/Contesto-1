import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

export default function AdminLoginPage() {
  const { adminLogin, isAuthenticated, isAdmin } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    admin_name: "",
    password: "",
  })

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin')
    }
  }, [isAuthenticated, isAdmin, navigate])

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
      await adminLogin(formData.admin_name, formData.password)
      toast({
        title: "Admin login successful",
        description: "You have been logged in as admin",
        variant: "default",
      })
    } catch (error) {
      console.error("Admin login error:", error)
      toast({
        title: "Login failed",
        description: error.response?.data?.msg || "Invalid admin credentials",
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
            <h1 className="mt-2 text-lg font-semibold text-gray-600">
              Admin Login
            </h1>
          </div>

          <div className="mt-8 bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="admin_name">Admin Name</Label>
                <Input
                  id="admin_name"
                  name="admin_name"
                  type="text"
                  required
                  placeholder="Admin name"
                  value={formData.admin_name}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
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
                  {loading ? "Logging in..." : "Login"}
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
