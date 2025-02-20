interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white text-gray-900 antialiased">
      {children}
    </div>
  )
}

export default Layout 