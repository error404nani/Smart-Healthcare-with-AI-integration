'use client'

import ProviderLayout from '../../portal-layout'
import { Settings, Shield, Bell, Database, Globe, Lock, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database },
  ]

  return (
    <ProviderLayout>
      <div className="space-y-6 max-w-5xl">
        <header>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">Configure the Smart Healthcare ecosystem and portal parameters</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Settings Navigation */}
          <nav className="w-full md:w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                  ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card hover:bg-muted text-muted-foreground'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Settings Content Area */}
          <div className="flex-1 space-y-6">
            <section className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 capitalize">
                {activeTab} Settings
              </h2>

              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform Name</label>
                    <input type="text" className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50" defaultValue="Smart Healthcare" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Support Email</label>
                    <input type="email" className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50" defaultValue="support@healthcare.com" />
                  </div>
                  <div className="flex items-center justify-between py-4 border-t mt-4">
                    <div className="space-y-1">
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">Temporarily disable patient access for maintenance</p>
                    </div>
                    <div className="w-12 h-6 bg-muted rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-lg flex items-start gap-3 border border-blue-100">
                    <Shield className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm">Two-factor authentication is currently enforced for all medical staff.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password Policy</label>
                      <select className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50">
                        <option>Strong (Min 10 chars, symbols, numbers)</option>
                        <option>Standard (Min 8 chars, mixed case)</option>
                        <option>Basic (Min 6 chars)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between py-4 border-t">
                      <div className="space-y-1">
                        <p className="font-medium">IP Whitelisting</p>
                        <p className="text-sm text-muted-foreground">Restrict admin access to specific IP ranges</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Database Status</p>
                      <p className="text-xl font-bold text-emerald-600 mt-1">Healthy</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Storage Used</p>
                      <p className="text-xl font-bold mt-1">12.4 GB / 100 GB</p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-card border border-rose-200 text-rose-600 rounded-lg flex items-center justify-center gap-2 hover:bg-rose-50 transition-all font-medium">
                    <Trash2 className="w-4 h-4" />
                    Clear System Cache
                  </button>
                </div>
              )}

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t">
                <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors">Discard</button>
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </ProviderLayout>
  )
}
