import { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui"
import { UserCheck, FileCheck, LogOut } from "lucide-react"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">JewishID</span>
          </Link>
          <nav className="flex flex-1 items-center space-x-2">
            <Link to="/verification">
              <Button variant="ghost" size="sm">
                <UserCheck className="mr-2 h-4 w-4" />
                Verification
              </Button>
            </Link>
            <Link to="/documents">
              <Button variant="ghost" size="sm">
                <FileCheck className="mr-2 h-4 w-4" />
                Documents
              </Button>
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
    </div>
  )
}
