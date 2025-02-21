import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { Layout } from './components/layout'
import { Button } from './components/ui/button'
import { UserCheck, Shield, Users, ChevronRight } from 'lucide-react'
import Verification from './pages/verification'

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="jns-theme">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verification" element={<Verification />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  )
}

function Home() {
  return (
    <div className="space-y-16">
      <section className="min-h-[80vh] flex flex-col justify-center py-12 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Secure Identity Verification for the Jewish Network State
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
          A decentralized platform for verifying and managing Jewish identity credentials with
          blockchain security and privacy-first design.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <UserCheck className="h-8 w-8 text-blue-600" />
          <h3 className="text-xl font-semibold">Secure Verification</h3>
          <p className="text-muted-foreground">
            Multi-level identity verification with blockchain-backed security
          </p>
        </div>
        <div className="space-y-2">
          <Shield className="h-8 w-8 text-green-600" />
          <h3 className="text-xl font-semibold">Privacy First</h3>
          <p className="text-muted-foreground">
            End-to-end encryption and zero-knowledge proofs protect your data
          </p>
        </div>
        <div className="space-y-2">
          <Users className="h-8 w-8 text-purple-600" />
          <h3 className="text-xl font-semibold">Community Trust</h3>
          <p className="text-muted-foreground">
            Rabbi-verified credentials and community attestations
          </p>
        </div>
      </section>

      <section className="border rounded-lg p-8 bg-muted/50">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-2xl font-bold">Progressive Trust System</h2>
          <p className="text-muted-foreground">
            Our multi-level verification system ensures the highest standards of identity
            verification while maintaining privacy and security.
          </p>
          <div className="space-y-4 mt-8">
            {[
              {
                title: 'Baseline Trust',
                description: 'Email and phone verification for basic identity confirmation'
              },
              {
                title: 'Community Trust',
                description: 'Rabbi reference and Hebrew name verification for community integration'
              },
              {
                title: 'Financial Trust',
                description: 'KYC and video verification for financial transactions'
              }
            ].map((level, i) => (
              <div key={i} className="flex items-start gap-4">
                <ChevronRight className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">{level.title}</h3>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
