'use client'

import ProviderLayout from '../../portal-layout'
import { Users, Search, Filter, MoreVertical, Shield, UserX, CheckCircle, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

export default function AdminUsersPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const searchFromQuery = searchParams.get('search')
    if (searchFromQuery) {
      setSearchTerm(searchFromQuery)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users')
        if (!res.ok) throw new Error('Failed to fetch users')
        const data = await res.json()
        setUsers(data)
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Monitor and manage all users across the platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-sm">User Info</th>
                  <th className="px-6 py-4 font-semibold text-sm">Role</th>
                  <th className="px-6 py-4 font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 font-semibold text-sm">Joined Date</th>
                  <th className="px-6 py-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-muted-foreground">Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm capitalize px-2 py-1 rounded font-medium
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                            user.role === 'doctor' ? 'bg-blue-100 text-blue-700' : 
                            user.role === 'pharmacy' ? 'bg-amber-100 text-amber-700' : 
                            user.role === 'clinic' ? 'bg-indigo-100 text-indigo-700' : 
                            'bg-slate-100 text-slate-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1
                          ${user.status === 'active' || user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                            user.status === 'pending' || user.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                            'bg-rose-100 text-rose-700'}`}>
                          {(user.status === 'active' || user.status === 'Active') && <CheckCircle className="w-3 h-3" />}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.joined}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors" title="Manage Permissions">
                            <Shield className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-md transition-colors" title="Suspend User">
                            <UserX className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">No users found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  )
}
