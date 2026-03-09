import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center px-4">
        <div className="font-display text-9xl font-bold text-secondary-100 mb-4">404</div>
        <h1 className="font-display text-3xl font-bold text-secondary-900 mb-3">
          Page introuvable
        </h1>
        <p className="text-secondary-500 mb-8 max-w-sm mx-auto">
          La page que vous recherchez n'existe pas ou a ete deplacee.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Home size={16} />
            Accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-white hover:bg-secondary-50 text-secondary-700 font-semibold px-6 py-3 rounded-lg border border-secondary-200 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage