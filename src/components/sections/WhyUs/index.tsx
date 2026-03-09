import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Shield, Award, Truck, Headphones, Star, Zap } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

export const WhyUs: React.FC = () => {
  const { t } = useTranslation()

  const FEATURES = [
    {
      icon: Award,
      titleKey: 'whyUs.original.title',
      descKey:  'whyUs.original.desc',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Shield,
      titleKey: 'whyUs.guarantee.title',
      descKey:  'whyUs.guarantee.desc',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: Zap,
      titleKey: 'whyUs.promotions.title',
      descKey:  'whyUs.promotions.desc',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Headphones,
      titleKey: 'whyUs.service.title',
      descKey:  'whyUs.service.desc',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Star,
      titleKey: 'whyUs.experience.title',
      descKey:  'whyUs.experience.desc',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Truck,
      titleKey: 'whyUs.delivery.title',
      descKey:  'whyUs.delivery.desc',
      color: 'bg-pink-100 text-pink-600',
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeader
          title={t('whyUs.title')}
          subtitle={t('whyUs.subtitle')}
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
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
                {t(feature.titleKey)}
              </h3>
              <p className="text-secondary-500 text-sm leading-relaxed">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUs