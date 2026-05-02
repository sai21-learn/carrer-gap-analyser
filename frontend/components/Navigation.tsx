"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useAuth } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "HOME", href: "/" },
  { name: "ABOUT", href: "/about" },
  { name: "CONNECT", href: "/contact" },
]

const authItems = [
  { name: "DASHBOARD", href: "/dashboard" },
  { name: "PROFILE", href: "/profile" },
  { name: "SETTINGS", href: "/settings" },
]

export default function Navigation() {
  const pathname = usePathname()
  const { isSignedIn, isLoaded } = useAuth()

  // Prevent flicker during load
  if (!isLoaded) return null

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/50 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center gap-12">
        <Link href="/" className="text-sm font-bold tracking-[0.2em] hover:opacity-70 transition-opacity">
          CAREER_GAP
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-xs tracking-[0.3em] font-medium transition-colors hover:text-white",
                pathname === item.href ? "text-white" : "text-white/40"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {isSignedIn && authItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-xs tracking-[0.3em] font-medium transition-colors hover:text-white",
                pathname === item.href ? "text-white" : "text-white/40"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {!isSignedIn ? (
          <Link 
            href="/sign-in" 
            className="text-xs tracking-[0.3em] font-medium px-4 py-2 border border-white/10 hover:bg-white hover:text-black transition-all"
          >
            LOGIN
          </Link>
        ) : (
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8 rounded-none border border-white/20",
              }
            }}
          />
        )}
      </div>
    </nav>
  )
}
