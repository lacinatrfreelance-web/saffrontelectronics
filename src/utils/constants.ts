export const COMPANY = {
  name: 'Saffron Electronics',
  fullName: 'Saffron Electronics Cote d\'Ivoire',
  phone: '+225 27 22 47 40 44',
  email: 'info@saffronelectronics.net',
  whatsapp: '+22527224740 44',
  address: 'Rond-point de la Riviera Palmeraie, pres de la BICICI, Abidjan',
  city: 'Abidjan',
  country: 'Cote d\'Ivoire',
  facebook: 'https://facebook.com/saffronelectronics2016',
  hours: {
    weekdays: 'Lundi - Samedi : 8h00 - 19h00',
    sunday: 'Dimanche : 9h00 - 19h00',
  },
}

export const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Plus recents' },
  { value: 'created_at_asc', label: 'Plus anciens' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix decroissant' },
  { value: 'name_asc', label: 'Nom A-Z' },
  { value: 'name_desc', label: 'Nom Z-A' },
]

export const DEFAULT_PER_PAGE = 12

export const ADMIN_TOKEN_KEY = 'saffron_admin_token'
export const ADMIN_USER_KEY = 'saffron_admin_user'