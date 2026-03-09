import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Award, Truck, Headphones, Star, Zap } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const FEATURES = [
  {
    icon: Award,
    title: 'Produits originaux',
    description: 'Tous nos produits sont garantis originaux avec certificat d\'authenticite.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Shield,
    title: 'Garantie constructeur',
    description: 'Chaque produit beneficie de la garantie officielle du constructeur.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Zap,
    title: 'Promotions regulieres',
    description: 'Des offres exceptionnelles jusqu\'a -40% tout au long de l\'annee.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Headphones,
    title: 'Service apres vente',
    description: 'Notre equipe technique est disponible pour vous accompagner.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Star,
    title: '10 ans d\'experience',
    description: 'Une decennie d\'expertise au service des foyers ivoiriens.',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    icon: Truck,
    title: 'Livraison a Abidjan',
    description: 'Service de livraison disponible sur toute la ville d\'Abidjan.',
    color: 'bg-pink-100 text-pink-600',
  },
]

export const WhyUs: React.FC = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeader
          title="Pourquoi nous choisir ?"
          subtitle="Saffron Electronics, votre partenaire de confiance depuis plus de 10 ans"
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="p-6 rounded-2xl border border-secondary-100 hover:border-secondary-200 hover:shadow-md transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={22} />
              </div>
              <h3 className="font-display font-semibold text-secondary-900 text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-secondary-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUs