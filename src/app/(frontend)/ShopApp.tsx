'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Page =
  | 'dashboard'
  | 'sale'
  | 'products'
  | 'stock'
  | 'purchase'
  | 'companies'
  | 'customers'
  | 'expenses'
  | 'reports'
  | 'settings'

type Product = {
  id: number
  name: string
  company: string
  category: string
  generic: string
  pack: string
  carton: number
  buy: number
  sell: number
  stock: number
  reorder: number
  batch: string
  expiry: string
  barcode: string
}

type Customer = {
  id: number
  name: string
  phone: string
  village: string
  due: number
  purchase: number
  lastPurchase: string
  limit: number
}

const navItems: { id: Page; bn: string; en: string; icon: string }[] = [
  { id: 'dashboard', bn: 'ড্যাশবোর্ড', en: 'Overview', icon: 'grid' },
  { id: 'sale', bn: 'নতুন বিক্রয়', en: 'POS', icon: 'cart' },
  { id: 'products', bn: 'পণ্যসমূহ', en: 'Products', icon: 'box' },
  { id: 'stock', bn: 'স্টক', en: 'Inventory', icon: 'layers' },
  { id: 'purchase', bn: 'ক্রয় / স্টক ইন', en: 'Purchase', icon: 'truck' },
  { id: 'companies', bn: 'কোম্পানি', en: 'Suppliers', icon: 'building' },
  { id: 'customers', bn: 'বাকি খাতা', en: 'Customers', icon: 'users' },
  { id: 'expenses', bn: 'খরচ', en: 'Expenses', icon: 'wallet' },
  { id: 'reports', bn: 'হিসাব ও রিপোর্ট', en: 'Reports', icon: 'chart' },
  { id: 'settings', bn: 'সেটিংস', en: 'Settings', icon: 'settings' },
]

const companies = [
  { name: 'Syngenta Bangladesh', phone: '01711-452810', payable: 84200, rep: 'মোঃ সোহেল' },
  { name: 'ACI Crop Care', phone: '01819-773024', payable: 46800, rep: 'রফিকুল ইসলাম' },
  { name: 'Auto Crop Care', phone: '01718-902211', payable: 22500, rep: 'শামীম আহমেদ' },
  { name: 'Square Agro', phone: '01914-340220', payable: 18700, rep: 'আব্দুল কাদের' },
  { name: 'BASF Bangladesh', phone: '01755-881232', payable: 56300, rep: 'সাইফুল ইসলাম' },
  { name: 'Bayer CropScience', phone: '01855-733452', payable: 73500, rep: 'তানভীর হাসান' },
  { name: 'Haychem Bangladesh', phone: '01618-454870', payable: 12600, rep: 'মিজানুর রহমান' },
  { name: 'Metal Agro', phone: '01713-541298', payable: 34800, rep: 'জাহিদুল ইসলাম' },
  { name: 'Lal Teer Seed', phone: '01911-671022', payable: 27900, rep: 'সোহাগ মিয়া' },
  { name: 'Ispahani Agro', phone: '01812-230184', payable: 41200, rep: 'ইমরান হোসেন' },
]

const productSeeds = [
  ['Actara', 'Syngenta Bangladesh', 'কীটনাশক', 'Thiamethoxam', '100gm', 40],
  ['Karate', 'Syngenta Bangladesh', 'কীটনাশক', 'Lambda-cyhalothrin', '100ml', 40],
  ['Ridomil Gold', 'Syngenta Bangladesh', 'ছত্রাকনাশক', 'Metalaxyl-M', '500gm', 10],
  ['Amistar Top', 'Syngenta Bangladesh', 'ছত্রাকনাশক', 'Azoxystrobin', '100ml', 20],
  ['Virtako', 'Syngenta Bangladesh', 'কীটনাশক', 'Chlorantraniliprole', '40gm', 50],
  ['Neemix', 'ACI Crop Care', 'কীটনাশক', 'Azadirachtin', '100ml', 40],
  ['Nitro', 'ACI Crop Care', 'সার', 'Nitrobenzene', '250ml', 20],
  ['Coragen', 'Auto Crop Care', 'কীটনাশক', 'Chlorantraniliprole', '50ml', 20],
  ['Sun Up', 'Auto Crop Care', 'আগাছানাশক', 'Glyphosate', '1L', 12],
  ['Clean Master', 'Square Agro', 'আগাছানাশক', 'Paraquat', '500ml', 20],
  ['Thiovit Jet', 'Syngenta Bangladesh', 'ছত্রাকনাশক', 'Sulphur', '500gm', 10],
  ['Fighter', 'Square Agro', 'কীটনাশক', 'Imidacloprid', '100ml', 40],
  ['Confidor', 'Bayer CropScience', 'কীটনাশক', 'Imidacloprid', '50ml', 20],
  ['Nativo', 'Bayer CropScience', 'ছত্রাকনাশক', 'Tebuconazole', '100gm', 20],
  ['Luna Sensation', 'Bayer CropScience', 'ছত্রাকনাশক', 'Fluopyram', '100ml', 20],
  ['Seltima', 'BASF Bangladesh', 'ছত্রাকনাশক', 'Pyraclostrobin', '100ml', 40],
  ['Regent', 'BASF Bangladesh', 'কীটনাশক', 'Fipronil', '100gm', 40],
  ['Storm', 'Haychem Bangladesh', 'কীটনাশক', 'Cypermethrin', '100ml', 40],
  ['Bio Max', 'Haychem Bangladesh', 'পিজিআর', 'Triacontanol', '100ml', 40],
  ['Root Plus', 'Metal Agro', 'পিজিআর', 'Humic Acid', '500ml', 12],
  ['Bumper Yield', 'Metal Agro', 'সার', 'NPK Mix', '1kg', 10],
  ['লাল তীর টমেটো', 'Lal Teer Seed', 'বীজ', 'Hybrid Tomato', '10gm', 20],
  ['লাল তীর বেগুন', 'Lal Teer Seed', 'বীজ', 'Hybrid Brinjal', '5gm', 20],
  ['লাল তীর লাউ', 'Lal Teer Seed', 'বীজ', 'Bottle Gourd', '10gm', 20],
  ['সবুজ শসা', 'Ispahani Agro', 'বীজ', 'Hybrid Cucumber', '10gm', 20],
  ['হাইব্রিড মরিচ', 'Ispahani Agro', 'বীজ', 'Hybrid Chili', '5gm', 20],
  ['Mancozeb 80', 'ACI Crop Care', 'ছত্রাকনাশক', 'Mancozeb', '500gm', 10],
  ['Zinc Gold', 'ACI Crop Care', 'সার', 'Zinc Sulphate', '1kg', 10],
  ['Gibgro', 'Auto Crop Care', 'পিজিআর', 'Gibberellic Acid', '10gm', 50],
  ['Furadan', 'Bayer CropScience', 'কীটনাশক', 'Carbofuran', '1kg', 10],
  ['Potash Plus', 'Square Agro', 'সার', 'Potassium', '1kg', 10],
  ['Weed Kill', 'Metal Agro', 'আগাছানাশক', 'Pretilachlor', '500ml', 12],
] as const

const products: Product[] = productSeeds.map((p, i) => {
  const expiryOffsets = [-40, 12, 28, 54, 87, 130, 220, 310]
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + expiryOffsets[i % expiryOffsets.length])
  const buy = 85 + ((i * 47) % 620)
  return {
    id: i + 1,
    name: p[0],
    company: p[1],
    category: p[2],
    generic: p[3],
    pack: p[4],
    carton: p[5],
    buy,
    sell: Math.round((buy * 1.24) / 5) * 5,
    stock: i % 8 === 0 ? 4 + i : 35 + ((i * 19) % 210),
    reorder: 20,
    batch: `BT-${String(24120 + i * 7)}`,
    expiry: expiry.toISOString().slice(0, 10),
    barcode: `894110${String(30000 + i)}`,
  }
})

const firstNames = [
  'রহিম',
  'করিম',
  'জসিম',
  'আলমগীর',
  'সাইফুল',
  'মোবারক',
  'জাহাঙ্গীর',
  'রফিক',
  'কামাল',
  'শহিদুল',
  'আনোয়ার',
  'মতিউর',
  'আবুল',
  'নজরুল',
  'সোহেল',
  'মিজান',
  'হাবিব',
]
const lastNames = ['মিয়া', 'হোসেন', 'উদ্দিন', 'সরকার', 'মণ্ডল', 'ব্যাপারী', 'শেখ', 'প্রামাণিক']
const villages = ['গোপালপুর', 'চরপাড়া', 'বালিয়াডাঙ্গা', 'শিবগঞ্জ', 'মহেশপুর', 'কাঠালতলী', 'দেওয়ানগঞ্জ', 'নতুন বাজার']

const initialCustomers: Customer[] = Array.from({ length: 56 }, (_, i) => ({
  id: i + 1,
  name: `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`,
  phone: `01${[7, 8, 9, 6][i % 4]}${String(11452000 + i * 731).slice(-8)}`,
  village: villages[(i * 5) % villages.length],
  due: i % 5 === 0 ? 0 : 850 + ((i * 1290) % 33000),
  purchase: 12400 + ((i * 3760) % 165000),
  lastPurchase: `${String((i % 27) + 1).padStart(2, '0')}/05/2025`,
  limit: [10000, 20000, 30000, 50000][i % 4],
}))

const salesRecords = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2025, 4, 28)
  date.setDate(date.getDate() - i)
  return {
    invoice: `PS-${String(250829 - i)}`,
    date: date.toISOString().slice(0, 10),
    customer: initialCustomers[(i * 7 + 2) % initialCustomers.length].name,
    amount: 1840 + ((i * 937) % 12800),
    paid: i % 5 !== 2,
  }
})

const fmt = (n: number) => `৳${Math.round(n).toLocaleString('en-BD')}`
const dateBD = (date: string) => date.split('-').reverse().join('/')
const daysLeft = (date: string) => Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)

function downloadFile(name: string, contents: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  URL.revokeObjectURL(url)
}

function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState(initialValue)
  const firstSave = useRef(true)
  useEffect(() => {
    const saved = window.localStorage.getItem(key)
    if (!saved) return
    try {
      setValue(JSON.parse(saved) as T)
    } catch {
      window.localStorage.removeItem(key)
    }
  }, [key])
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue] as const
}

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    cart: (
      <>
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="19" cy="20" r="1.5" />
        <path d="M3 4h2l2.5 11h11l2-8H7" />
      </>
    ),
    box: (
      <>
        <path d="M4 7l8-4 8 4v10l-8 4-8-4z" />
        <path d="M4 7l8 4 8-4M12 11v10" />
      </>
    ),
    layers: (
      <>
        <path d="M12 2l9 5-9 5-9-5z" />
        <path d="M3 12l9 5 9-5M3 17l9 5 9-5" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h11v11H3zM14 10h4l3 4v3h-7z" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V4h11v17M15 9h5v12M8 8h3M8 12h3M8 16h3M2 21h20" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21v-2a7 7 0 0114 0v2M16 4a4 4 0 010 8M17 14a6 6 0 015 6" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 6h15a2 2 0 012 2v11H4a2 2 0 01-2-2V5a2 2 0 012-2h15" />
        <path d="M16 11h5v5h-5a2.5 2.5 0 010-5z" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6v.2h-4V21a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 00.3-1.9A1.7 1.7 0 003 14H2.8v-4H3a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 009 4.6 1.7 1.7 0 0010 3v-.2h4V3a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.6 1h.2v4H21a1.7 1.7 0 00-1.6 1z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    moon: <path d="M21 15a9 9 0 01-12-12 9 9 0 1012 12z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    export: (
      <>
        <path d="M12 3v12M7 10l5 5 5-5" />
        <path d="M4 18v3h16v-3" />
      </>
    ),
    dots: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </>
    ),
    close: <path d="M6 6l12 12M18 6L6 18" />,
    check: <path d="M5 12l4 4L19 6" />,
    phone: (
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7 12.8 12.8 0 00.7 2.8 2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5 12.8 12.8 0 002.8.7A2 2 0 0122 16.9z" />
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name] || paths.box}
    </svg>
  )
}

function Badge({
  children,
  tone = 'green',
}: {
  children: React.ReactNode
  tone?: 'green' | 'red' | 'orange' | 'yellow' | 'purple' | 'gray' | 'blue'
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
}) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name="box" size={28} />
      </div>
      <p>{text}</p>
    </div>
  )
}

function SectionTitle({ bn, en, action }: { bn: string; en: string; action?: React.ReactNode }) {
  return (
    <div className="section-title">
      <div>
        <h2>{bn}</h2>
        <p>{en}</p>
      </div>
      {action}
    </div>
  )
}

function Dashboard({ go, notify }: { go: (p: Page) => void; notify: (s: string) => void }) {
  const [scope, setScope] = useState('এই মাস')
  const multipliers: Record<string, number> = {
    আজ: 0.046,
    গতকাল: 0.039,
    'এই সপ্তাহ': 0.24,
    'এই মাস': 1,
    'এই বছর': 8.4,
    কাস্টম: 0.55,
  }
  const m = multipliers[scope]
  const kpis = [
    ['মোট বিক্রয়', 'Total Sales', 684520 * m, 'green', '+12.5%'],
    ['মোট লাভ', 'Total Profit', 128430 * m, 'blue', '+8.2%'],
    ['ক্যাশ পেয়েছি', 'Cash Received', 526300 * m, 'teal', '+10.1%'],
    ['বাজারে বাকি', 'Total Due', 287450 * Math.max(m, 0.4), 'red', '৩৮ জন'],
    ['মোট ক্রয়', 'Total Purchase', 412680 * m, 'purple', '+5.4%'],
    ['স্টকের মূল্য', 'At Cost', 1248600, 'orange', '৩২ SKU'],
    ['খরচ', 'Expenses', 38240 * m, 'gray', '-2.1%'],
  ]
  const sales = [36, 48, 43, 62, 56, 79, 72, 88, 75, 94, 82, 110]
  return (
    <div className="page-stack">
      <div className="dashboard-head">
        <div>
          <p className="eyebrow">
            ব্যবসার সারসংক্ষেপ <span>BUSINESS OVERVIEW</span>
          </p>
          <h1>শুভ সকাল, আব্দুল মোমিন</h1>
          <p className="muted">আপনার দোকানের আজকের হিসাব এক নজরে দেখুন</p>
        </div>
        <div className="date-chip">
          <Icon name="calendar" />
          <div>
            <small>আজ</small>
            <strong>২৮ মে ২০২৫</strong>
          </div>
        </div>
      </div>
      <div className="scope-switch">
        {['আজ', 'গতকাল', 'এই সপ্তাহ', 'এই মাস', 'এই বছর', 'কাস্টম'].map((s) => (
          <button
            className={scope === s ? 'active' : ''}
            onClick={() => {
              if (s === 'কাস্টম') {
                const from = window.prompt('From date (DD/MM/YYYY)')
                if (!from) return
                const to = window.prompt('To date (DD/MM/YYYY)')
                if (!to) return
                notify(`${from} — ${to}`)
              }
              setScope(s)
            }}
            key={s}
          >
            {s}
            {s === 'কাস্টম' && <span> ↗</span>}
          </button>
        ))}
      </div>
      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <div className={`kpi-card kpi-${k[3]}`} key={k[0]}>
            <div className="kpi-top">
              <span>
                {k[0]}
                <small>{k[1]}</small>
              </span>
              <span className="kpi-icon">
                <Icon name={['chart', 'chart', 'wallet', 'users', 'cart', 'box', 'wallet'][i]} />
              </span>
            </div>
            <strong>{fmt(k[2] as number)}</strong>
            <div className="kpi-foot">
              <span>{k[4]}</span>
              <small> আগের সময়ের তুলনায়</small>
            </div>
          </div>
        ))}
      </div>
      <div className="quick-row">
        <strong>
          দ্রুত কাজ <small>QUICK ACTIONS</small>
        </strong>
        <button onClick={() => go('sale')}>
          <span>
            <Icon name="cart" />
          </span>
          নতুন বিক্রয়
        </button>
        <button onClick={() => go('purchase')}>
          <span>
            <Icon name="truck" />
          </span>
          স্টক যোগ
        </button>
        <button onClick={() => go('customers')}>
          <span>
            <Icon name="users" />
          </span>
          কাস্টমার যোগ
        </button>
        <button onClick={() => go('customers')}>
          <span>
            <Icon name="wallet" />
          </span>
          বাকি আদায়
        </button>
        <button onClick={() => go('expenses')}>
          <span>
            <Icon name="plus" />
          </span>
          খরচ যোগ
        </button>
      </div>
      <div className="alert-grid">
        {[
          ['মেয়াদ শেষ পণ্য', 'Expired', '৭', 'red', 'stock'],
          ['৯০ দিনের মধ্যে মেয়াদ', 'Expiring soon', '১২', 'orange', 'stock'],
          ['লো স্টক পণ্য', 'Low stock', '৯', 'yellow', 'stock'],
          ['বেশি বাকি কাস্টমার', 'High due', '১৪', 'purple', 'customers'],
        ].map((a) => (
          <button
            key={a[0]}
            onClick={() => go(a[4] as Page)}
            className={`alert-card alert-${a[3]}`}
          >
            <span className="alert-symbol">
              <Icon name={a[4] === 'stock' ? 'box' : 'users'} />
            </span>
            <span>
              <strong>{a[2]}</strong>
              <b>{a[0]}</b>
              <small>{a[1]}</small>
            </span>
            <Icon name="arrow" />
          </button>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="card chart-card">
          <SectionTitle
            bn="বিক্রয় বনাম লাভ"
            en="Sales vs Profit"
            action={
              <select>
                <option>শেষ ১২ দিন</option>
              </select>
            }
          />
          <div className="legend">
            <span>
              <i className="green-dot" /> বিক্রয়
            </span>
            <span>
              <i className="blue-dot" /> লাভ
            </span>
          </div>
          <div className="line-chart">
            <svg viewBox="0 0 700 230" preserveAspectRatio="none">
              {[30, 80, 130, 180].map((y) => (
                <line key={y} x1="20" x2="690" y1={y} y2={y} className="gridline" />
              ))}
              <polyline
                points={sales.map((v, i) => `${25 + i * 60},${215 - v * 1.65}`).join(' ')}
                className="sales-line"
              />
              <polyline
                points={sales.map((v, i) => `${25 + i * 60},${215 - v * 0.65}`).join(' ')}
                className="profit-line"
              />
            </svg>
            <div className="chart-labels">
              {['১৭ মে', '১৯ মে', '২১ মে', '২৩ মে', '২৫ মে', '২৭ মে'].map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <SectionTitle bn="ক্যাটাগরি অনুযায়ী বিক্রয়" en="Sales by category" />
          <div className="donut-wrap">
            <div className="donut">
              <div>
                <strong>৳৬.৮L</strong>
                <small>মোট বিক্রয়</small>
              </div>
            </div>
            <div className="donut-legend">
              {[
                ['কীটনাশক', 38, 'green'],
                ['ছত্রাকনাশক', 24, 'blue'],
                ['বীজ', 18, 'yellow'],
                ['সার ও PGR', 12, 'purple'],
                ['আগাছানাশক', 8, 'orange'],
              ].map((x) => (
                <div key={x[0]}>
                  <span>
                    <i className={`dot-${x[2]}`} />
                    {x[0]}
                  </span>
                  <b>{x[1]}%</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="three-grid">
        <div className="card">
          <SectionTitle
            bn="সবচেয়ে বেশি বিক্রিত পণ্য"
            en="Top 5 products"
            action={
              <button className="text-link" onClick={() => go('products')}>
                সব দেখুন
              </button>
            }
          />
          <div className="rank-list">
            {products.slice(0, 5).map((p, i) => (
              <div key={p.id}>
                <span className="rank">{i + 1}</span>
                <span className="product-avatar">{p.name.slice(0, 1)}</span>
                <span>
                  <b>
                    {p.name} · {p.pack}
                  </b>
                  <small>{p.company}</small>
                </span>
                <strong>{fmt(68400 - i * 7500)}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <SectionTitle
            bn="সাম্প্রতিক বিক্রয়"
            en="Recent sales"
            action={
              <button className="text-link" onClick={() => go('reports')}>
                সব দেখুন
              </button>
            }
          />
          <div className="simple-list">
            {salesRecords.slice(0, 5).map((sale, i) => (
              <div key={sale.invoice}>
                <span>
                  <b>{sale.invoice}</b>
                  <small>
                    {sale.customer} · {10 + i}:৩২ AM
                  </small>
                </span>
                <span>
                  <strong>{fmt(sale.amount)}</strong>
                  <Badge tone={sale.paid ? 'green' : 'red'}>{sale.paid ? 'পরিশোধ' : 'বাকি'}</Badge>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <SectionTitle
            bn="আসন্ন মেয়াদ"
            en="Upcoming expiry"
            action={
              <button className="text-link" onClick={() => go('stock')}>
                সব দেখুন
              </button>
            }
          />
          <div className="simple-list">
            {products
              .filter((p) => daysLeft(p.expiry) > 0)
              .sort((a, b) => daysLeft(a.expiry) - daysLeft(b.expiry))
              .slice(0, 5)
              .map((p) => (
                <div key={p.id}>
                  <span>
                    <b>
                      {p.name} · {p.pack}
                    </b>
                    <small>ব্যাচ: {p.batch}</small>
                  </span>
                  <span>
                    <Badge tone={daysLeft(p.expiry) < 30 ? 'red' : 'orange'}>
                      {daysLeft(p.expiry)} দিন বাকি
                    </Badge>
                    <small>{dateBD(p.expiry)}</small>
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
      <button
        className="fab"
        onClick={() => {
          go('sale')
          notify('নতুন বিক্রয় পেজ খোলা হয়েছে')
        }}
      >
        <Icon name="plus" size={24} />
        <span>নতুন বিক্রয়</span>
      </button>
    </div>
  )
}

function Sale({
  customers,
  setCustomers,
  notify,
}: {
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
  notify: (s: string) => void
}) {
  const [search, setSearch] = useState('')
  const [productCategory, setProductCategory] = useState('সব পণ্য')
  const [cart, setCart] = useState<{ product: Product; qty: number; unit: 'pcs' | 'carton' }[]>([])
  const [customer, setCustomer] = useState('ওয়াক-ইন কাস্টমার')
  const [discount, setDiscount] = useState(0)
  const [payment, setPayment] = useState('Cash')
  const add = (p: Product) => {
    if (daysLeft(p.expiry) < 0) return notify('মেয়াদোত্তীর্ণ ব্যাচ বিক্রি করা যাবে না')
    setCart((c) =>
      c.some((x) => x.product.id === p.id)
        ? c.map((x) => (x.product.id === p.id ? { ...x, qty: x.qty + 1 } : x))
        : [...c, { product: p, qty: 1, unit: 'pcs' }],
    )
  }
  const total = cart.reduce(
    (s, x) => s + x.product.sell * x.qty * (x.unit === 'carton' ? x.product.carton : 1),
    0,
  )
  const filtered = products
    .filter(
      (p) =>
        (productCategory === 'সব পণ্য' || p.category === productCategory) &&
        `${p.name} ${p.company} ${p.barcode}`.toLowerCase().includes(search.toLowerCase()),
    )
    .slice(0, 12)
  return (
    <div className="page-stack">
      <div className="page-head">
        <div>
          <p className="eyebrow">
            বিক্রয় কেন্দ্র <span>POINT OF SALE</span>
          </p>
          <h1>নতুন বিক্রয়</h1>
        </div>
        <Badge tone="green">FEFO চালু</Badge>
      </div>
      <div className="pos-layout">
        <div className="page-stack">
          <div className="card pos-search">
            <div className="search-field">
              <Icon name="search" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="পণ্যের নাম, কোম্পানি বা বারকোড দিয়ে খুঁজুন..."
              />
              <kbd>F2</kbd>
            </div>
            <div className="filter-chips">
              {['সব পণ্য', 'কীটনাশক', 'ছত্রাকনাশক', 'আগাছানাশক', 'সার', 'বীজ'].map((x) => (
                <button
                  key={x}
                  className={productCategory === x ? 'active' : ''}
                  onClick={() => setProductCategory(x)}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
          <div className="product-pick-grid">
            {filtered.map((p) => (
              <button className="pick-card" key={p.id} onClick={() => add(p)}>
                <div className="product-avatar large">{p.name.slice(0, 1)}</div>
                <div>
                  <b>{p.name}</b>
                  <small>{p.company}</small>
                  <span>
                    {p.pack} · স্টক {p.stock} pcs
                  </span>
                </div>
                <strong>{fmt(p.sell)}</strong>
                <i>
                  <Icon name="plus" size={16} />
                </i>
                {daysLeft(p.expiry) < 60 && (
                  <Badge tone={daysLeft(p.expiry) < 0 ? 'red' : 'orange'}>
                    {daysLeft(p.expiry) < 0 ? 'মেয়াদ শেষ' : `${daysLeft(p.expiry)} দিন`}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="card cart-panel">
          <div className="cart-title">
            <div>
              <h2>বিক্রয় তালিকা</h2>
              <small>{cart.length}টি পণ্য</small>
            </div>
            <button onClick={() => setCart([])}>সব মুছুন</button>
          </div>
          <label className="field-label">কাস্টমার</label>
          <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
            <option>ওয়াক-ইন কাস্টমার</option>
            {customers.map((c) => (
              <option key={c.id}>
                {c.name} · বাকি {fmt(c.due)}
              </option>
            ))}
          </select>
          <div className="cart-items">
            {cart.length === 0 ? (
              <Empty text="পণ্য যোগ করতে বাম পাশ থেকে পণ্য চাপুন" />
            ) : (
              cart.map((x, idx) => (
                <div className="cart-item" key={x.product.id}>
                  <div className="cart-item-head">
                    <span>
                      <b>
                        {x.product.name} · {x.product.pack}
                      </b>
                      <small>
                        {x.product.batch} · {daysLeft(x.product.expiry)} দিন বাকি
                      </small>
                    </span>
                    <button onClick={() => setCart((c) => c.filter((_, i) => i !== idx))}>
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                  <div className="cart-item-controls">
                    <div className="seg">
                      <button
                        className={x.unit === 'pcs' ? 'active' : ''}
                        onClick={() =>
                          setCart((c) => c.map((v, i) => (i === idx ? { ...v, unit: 'pcs' } : v)))
                        }
                      >
                        পিস
                      </button>
                      <button
                        className={x.unit === 'carton' ? 'active' : ''}
                        onClick={() =>
                          setCart((c) =>
                            c.map((v, i) => (i === idx ? { ...v, unit: 'carton' } : v)),
                          )
                        }
                      >
                        কার্টন
                      </button>
                    </div>
                    <div className="stepper">
                      <button
                        onClick={() =>
                          setCart((c) =>
                            c.map((v, i) =>
                              i === idx ? { ...v, qty: Math.max(1, v.qty - 1) } : v,
                            ),
                          )
                        }
                      >
                        −
                      </button>
                      <strong>{x.qty}</strong>
                      <button
                        onClick={() =>
                          setCart((c) =>
                            c.map((v, i) => (i === idx ? { ...v, qty: v.qty + 1 } : v)),
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <strong>
                      {fmt(x.product.sell * x.qty * (x.unit === 'carton' ? x.product.carton : 1))}
                    </strong>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="discount-row">
            <label>ডিসকাউন্ট</label>
            <div>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(+e.target.value)}
              />
              <span>৳</span>
            </div>
          </div>
          <div className="payment-tabs">
            {['Cash', 'bKash', 'Nagad', 'Bank', 'বাকি', 'Partial'].map((x) => (
              <button
                className={payment === x ? 'active' : ''}
                onClick={() => setPayment(x)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="total-box">
            <span>
              সাবটোটাল <b>{fmt(total)}</b>
            </span>
            <span>
              ডিসকাউন্ট <b>− {fmt(discount)}</b>
            </span>
            <strong>
              সর্বমোট <b>{fmt(Math.max(0, total - discount))}</b>
            </strong>
          </div>
          <Button
            className="checkout"
            onClick={() => {
              if (!cart.length) return notify('আগে অন্তত একটি পণ্য যোগ করুন')
              const finalTotal = Math.max(0, total - discount)
              if (payment === 'বাকি' || payment === 'Partial') {
                const selected = customers.find((item) => customer.startsWith(item.name))
                if (!selected) {
                  notify('বাকি বিক্রয়ের জন্য একজন কাস্টমার নির্বাচন করুন')
                  return
                }
                const received =
                  payment === 'Partial'
                    ? Math.max(
                        0,
                        Math.min(finalTotal, Number(window.prompt('Received amount', '0')) || 0),
                      )
                    : 0
                setCustomers((items) =>
                  items.map((item) =>
                    item.id === selected.id
                      ? {
                          ...item,
                          due: item.due + finalTotal - received,
                          purchase: item.purchase + finalTotal,
                        }
                      : item,
                  ),
                )
              }
              notify(`বিক্রয় সম্পন্ন — Invoice #PS-250829`)
              setCart([])
            }}
          >
            <Icon name="check" /> বিক্রয় সম্পন্ন করুন
          </Button>
          <p className="print-note">বিক্রয়ের পর A4 / 80mm রসিদ প্রিন্ট বা শেয়ার করা যাবে</p>
        </div>
      </div>
    </div>
  )
}

function ProductsPage({ notify }: { notify: (s: string) => void }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('সব ক্যাটাগরি')
  const [company, setCompany] = useState('সব কোম্পানি')
  const [productList, setProductList] = useStoredState('populer-products', products)
  useEffect(() => {
    const incoming = window.sessionStorage.getItem('populer-product-search')
    if (incoming) setSearch(incoming)
    window.sessionStorage.removeItem('populer-product-search')
  }, [])
  const list = productList.filter(
    (p) =>
      (category === 'সব ক্যাটাগরি' || p.category === category) &&
      (company === 'সব কোম্পানি' || p.company === company) &&
      `${p.name} ${p.company} ${p.generic}`.toLowerCase().includes(search.toLowerCase()),
  )
  return (
    <PageFrame
      title="পণ্যসমূহ"
      subtitle="PRODUCT MASTER"
      action={
        <Button
          onClick={() => {
            const name = window.prompt('Product name')
            if (!name) return
            const pack = window.prompt('Pack size', '100ml') || '100ml'
            const sell = Number(window.prompt('Selling price', '100')) || 100
            const next: Product = {
              ...products[0],
              id: Date.now(),
              name,
              pack,
              sell,
              buy: Math.round(sell * 0.8),
              stock: 0,
              batch: 'NEW',
              barcode: String(Date.now()),
            }
            setProductList((items) => [next, ...items])
            notify('নতুন পণ্য যোগ হয়েছে')
          }}
        >
          <Icon name="plus" /> নতুন পণ্য
        </Button>
      }
    >
      <div className="card toolbar">
        <div className="search-field">
          <Icon name="search" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="পণ্য, জেনেরিক বা কোম্পানি খুঁজুন"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>সব ক্যাটাগরি</option>
          {['কীটনাশক', 'ছত্রাকনাশক', 'আগাছানাশক', 'সার', 'পিজিআর', 'বীজ'].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select value={company} onChange={(event) => setCompany(event.target.value)}>
          <option>সব কোম্পানি</option>
          {companies.map((x) => (
            <option key={x.name}>{x.name}</option>
          ))}
        </select>
        <Button
          variant="secondary"
          onClick={() => {
            downloadFile(
              'products.csv',
              [
                'Product,Company,Category,Pack,Buy,Sell,Stock,Barcode',
                ...list.map((p) =>
                  [p.name, p.company, p.category, p.pack, p.buy, p.sell, p.stock, p.barcode].join(
                    ',',
                  ),
                ),
              ].join('\n'),
              'text/csv',
            )
            notify('পণ্যের Excel export তৈরি হয়েছে')
          }}
        >
          <Icon name="export" /> Export
        </Button>
      </div>
      <div className="card table-card">
        <div className="table-meta">
          <span>
            <b>{list.length}</b>টি SKU পাওয়া গেছে
          </span>
          <span>প্রতি পেজে ২০</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>পণ্য / SKU</th>
                <th>কোম্পানি</th>
                <th>ক্যাটাগরি</th>
                <th>প্যাক ও কার্টন</th>
                <th>মূল্য</th>
                <th>স্টক</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="table-product">
                      <span className="product-avatar">{p.name[0]}</span>
                      <span>
                        <b>{p.name}</b>
                        <small>
                          {p.generic} · {p.barcode}
                        </small>
                      </span>
                    </div>
                  </td>
                  <td>{p.company}</td>
                  <td>
                    <Badge tone="gray">{p.category}</Badge>
                  </td>
                  <td>
                    <b>{p.pack}</b>
                    <small className="block">{p.carton} pcs / carton</small>
                  </td>
                  <td>
                    <b>{fmt(p.sell)}</b>
                    <small className="block">ক্রয় {fmt(p.buy)}</small>
                  </td>
                  <td>
                    <b>
                      {Math.floor(p.stock / p.carton)} কার্টন + {p.stock % p.carton} পিস
                    </b>
                    <small className="block">{p.stock} total pcs</small>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      aria-label={`View ${p.name}`}
                      onClick={() =>
                        notify(`${p.name} · ${p.pack} · ${p.stock} pcs · ${p.barcode}`)
                      }
                    >
                      <Icon name="dots" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageFrame>
  )
}

function StockPage({ notify }: { notify: (s: string) => void }) {
  const [tab, setTab] = useState('সব স্টক')
  const [adjustments, setAdjustments] = useStoredState<Record<number, number>>(
    'populer-stock-adjustments',
    {},
  )
  const adjustedProducts = products.map((product) => ({
    ...product,
    stock: Math.max(0, product.stock + (adjustments[product.id] || 0)),
  }))
  const list = adjustedProducts.filter(
    (p) =>
      tab === 'সব স্টক' ||
      (tab === 'লো স্টক' && p.stock <= p.reorder) ||
      (tab === 'মেয়াদ আসন্ন' && daysLeft(p.expiry) >= 0 && daysLeft(p.expiry) <= 90) ||
      (tab === 'মেয়াদ শেষ' && daysLeft(p.expiry) < 0),
  )
  const loss = products
    .filter((p) => daysLeft(p.expiry) < 0)
    .reduce((s, p) => s + p.stock * p.buy, 0)
  return (
    <PageFrame
      title="স্টক ব্যবস্থাপনা"
      subtitle="BATCH-WISE INVENTORY"
      action={
        <Button
          onClick={() => {
            const query = window.prompt('Product name')
            const product = adjustedProducts.find((item) =>
              item.name.toLowerCase().includes((query || '').toLowerCase()),
            )
            if (!product || !query) return
            const delta = Number(window.prompt('Adjustment (+/- pieces)', '0'))
            if (!Number.isFinite(delta) || delta === 0) return
            setAdjustments((current) => ({
              ...current,
              [product.id]: (current[product.id] || 0) + delta,
            }))
            notify('স্টক সফলভাবে অ্যাডজাস্ট হয়েছে')
          }}
        >
          <Icon name="plus" /> স্টক অ্যাডজাস্ট
        </Button>
      }
    >
      <div className="summary-strip">
        <div>
          <span>মোট স্টক মূল্য</span>
          <strong>{fmt(1248600)}</strong>
          <small>ক্রয় মূল্যে</small>
        </div>
        <div>
          <span>মোট পিস</span>
          <strong>৪,৮২৯</strong>
          <small>৩২ SKU</small>
        </div>
        <div>
          <span>লো স্টক</span>
          <strong className="yellow-text">৯</strong>
          <small>Reorder প্রয়োজন</small>
        </div>
        <div>
          <span>মেয়াদ শেষ ক্ষতি</span>
          <strong className="red-text">{fmt(loss)}</strong>
          <small>ফেরতযোগ্য ৪ ব্যাচ</small>
        </div>
      </div>
      <div className="tabs">
        {['সব স্টক', 'লো স্টক', 'মেয়াদ আসন্ন', 'মেয়াদ শেষ', 'কোম্পানি অনুযায়ী'].map((x) => (
          <button key={x} className={tab === x ? 'active' : ''} onClick={() => setTab(x)}>
            {x}
            {x === 'মেয়াদ শেষ' && <em>৭</em>}
          </button>
        ))}
      </div>
      <div className="card stock-list">
        {list.length === 0 ? (
          <Empty text="এই ফিল্টারে কোনো পণ্য নেই" />
        ) : (
          list.map((p) => {
            const days = daysLeft(p.expiry)
            const tone = days < 0 ? 'red' : days <= 90 ? 'orange' : 'green'
            return (
              <div className="stock-row" key={p.id}>
                <div className="table-product">
                  <span className="product-avatar large">{p.name[0]}</span>
                  <span>
                    <b>
                      {p.name} · {p.pack}
                    </b>
                    <small>
                      {p.company} · {p.category}
                    </small>
                  </span>
                </div>
                <div>
                  <small>মোট স্টক</small>
                  <b>
                    {Math.floor(p.stock / p.carton)} কার্টন + {p.stock % p.carton} পিস
                  </b>
                  <span>{p.stock} total pcs</span>
                </div>
                <div>
                  <small>ব্যাচ নম্বর</small>
                  <b>{p.batch}</b>
                  <span>ক্রয় {fmt(p.buy)}</span>
                </div>
                <div>
                  <small>মেয়াদ</small>
                  <b>{dateBD(p.expiry)}</b>
                  <Badge tone={tone}>
                    {days < 0 ? `${Math.abs(days)} দিন আগে শেষ` : `${days} দিন বাকি`}
                  </Badge>
                </div>
                <button
                  className="icon-btn"
                  aria-label={`Stock history for ${p.name}`}
                  onClick={() => notify(`${p.name} — ${p.batch} — ${p.stock} pcs`)}
                >
                  <Icon name="dots" />
                </button>
              </div>
            )
          })
        )}
      </div>
    </PageFrame>
  )
}

function PurchasePage({ notify }: { notify: (s: string) => void }) {
  const [supplier, setSupplier] = useState(companies[0].name)
  const [purchasePayment, setPurchasePayment] = useState('পরিশোধ')
  const [rows, setRows] = useState([
    {
      product: products[0].name,
      qty: 2,
      type: 'কার্টন',
      batch: 'BT-25190',
      expiry: '2026-05-30',
      price: products[0].buy,
    },
  ])
  const total = rows.reduce(
    (s, r) =>
      s +
      r.qty *
        r.price *
        (r.type === 'কার্টন' ? products.find((p) => p.name === r.product)?.carton || 1 : 1),
    0,
  )
  return (
    <PageFrame
      title="নতুন ক্রয় / স্টক ইন"
      subtitle="PURCHASE ENTRY"
      action={
        <Button
          variant="secondary"
          onClick={() => {
            downloadFile(
              'purchase-history.csv',
              'Invoice,Date,Supplier,Amount,Status\nSYN-2505-184,28/05/2025,Syngenta Bangladesh,48200,Paid',
              'text/csv',
            )
            notify('ক্রয় ইতিহাস Export হয়েছে')
          }}
        >
          <Icon name="chart" /> ক্রয় ইতিহাস
        </Button>
      }
    >
      <div className="purchase-layout">
        <div>
          <div className="card form-card">
            <SectionTitle bn="চালানের তথ্য" en="Invoice details" />
            <div className="form-grid">
              <label>
                <span>কোম্পানি / সাপ্লায়ার *</span>
                <select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
                  {companies.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>ইনভয়েস নম্বর *</span>
                <input defaultValue="SYN-2505-184" />
              </label>
              <label>
                <span>তারিখ</span>
                <input type="date" defaultValue="2025-05-28" />
              </label>
            </div>
          </div>
          <div className="card form-card">
            <SectionTitle
              bn="পণ্য যোগ করুন"
              en="Add items"
              action={
                <Button
                  variant="secondary"
                  onClick={() =>
                    setRows((r) => [
                      ...r,
                      {
                        product: products[(r.length * 5) % products.length].name,
                        qty: 1,
                        type: 'পিস',
                        batch: '',
                        expiry: '2026-08-30',
                        price: 120,
                      },
                    ])
                  }
                >
                  <Icon name="plus" /> লাইন যোগ
                </Button>
              }
            />
            <div className="purchase-rows">
              {rows.map((r, i) => (
                <div className="purchase-row" key={i}>
                  <label>
                    <span>পণ্য</span>
                    <select
                      value={r.product}
                      onChange={(e) =>
                        setRows((v) =>
                          v.map((x, j) => (j === i ? { ...x, product: e.target.value } : x)),
                        )
                      }
                    >
                      {products.map((p) => (
                        <option key={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>পরিমাণ</span>
                    <input
                      type="number"
                      value={r.qty}
                      onChange={(e) =>
                        setRows((v) =>
                          v.map((x, j) => (j === i ? { ...x, qty: +e.target.value } : x)),
                        )
                      }
                    />
                  </label>
                  <label>
                    <span>ইউনিট</span>
                    <select
                      value={r.type}
                      onChange={(e) =>
                        setRows((v) =>
                          v.map((x, j) => (j === i ? { ...x, type: e.target.value } : x)),
                        )
                      }
                    >
                      <option>কার্টন</option>
                      <option>পিস</option>
                    </select>
                  </label>
                  <label>
                    <span>ব্যাচ</span>
                    <input
                      value={r.batch}
                      onChange={(e) =>
                        setRows((v) =>
                          v.map((x, j) => (j === i ? { ...x, batch: e.target.value } : x)),
                        )
                      }
                    />
                  </label>
                  <label>
                    <span>মেয়াদ</span>
                    <input
                      type="date"
                      value={r.expiry}
                      onChange={(e) =>
                        setRows((v) =>
                          v.map((x, j) => (j === i ? { ...x, expiry: e.target.value } : x)),
                        )
                      }
                    />
                  </label>
                  <label>
                    <span>ক্রয় মূল্য</span>
                    <input
                      type="number"
                      value={r.price}
                      onChange={(e) =>
                        setRows((v) =>
                          v.map((x, j) => (j === i ? { ...x, price: +e.target.value } : x)),
                        )
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card purchase-summary">
          <SectionTitle bn="পেমেন্ট সারাংশ" en="Payment summary" />
          <div className="total-big">
            <span>মোট ক্রয়</span>
            <strong>{fmt(total)}</strong>
          </div>
          <div className="payment-tabs">
            {['পরিশোধ', 'আংশিক', 'কোম্পানি বাকি'].map((option) => (
              <button
                key={option}
                className={purchasePayment === option ? 'active' : ''}
                onClick={() => setPurchasePayment(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <label className="field-label">পেমেন্ট মাধ্যম</label>
          <select>
            <option>Bank Transfer</option>
            <option>Cash</option>
            <option>Cheque</option>
          </select>
          <Button
            className="checkout"
            onClick={() => {
              if (rows.some((row) => !row.batch || !row.expiry || row.qty <= 0 || row.price <= 0)) {
                notify('সব পণ্যের ব্যাচ, মেয়াদ, পরিমাণ ও মূল্য দিন')
                return
              }
              notify('ক্রয় ও নতুন ব্যাচ সফলভাবে স্টকে যোগ হয়েছে')
              setRows([])
            }}
          >
            <Icon name="check" /> ক্রয় সংরক্ষণ
          </Button>
          <p className="print-note">স্টক ও supplier ledger স্বয়ংক্রিয়ভাবে আপডেট হবে</p>
        </div>
      </div>
    </PageFrame>
  )
}

function CompaniesPage({ notify }: { notify: (s: string) => void }) {
  const [companyList, setCompanyList] = useStoredState('populer-companies', companies)
  return (
    <PageFrame
      title="কোম্পানি ও সাপ্লায়ার"
      subtitle="SUPPLIER DIRECTORY"
      action={
        <Button
          onClick={() => {
            const name = window.prompt('Company name')
            if (!name) return
            const phone = window.prompt('Phone', '') || ''
            const rep = window.prompt('Sales representative', '') || ''
            setCompanyList((items) => [{ name, phone, rep, payable: 0 }, ...items])
            notify('নতুন কোম্পানি যোগ হয়েছে')
          }}
        >
          <Icon name="plus" /> কোম্পানি যোগ
        </Button>
      }
    >
      <div className="company-grid">
        {companyList.map((c, i) => (
          <div className="card company-card" key={c.name}>
            <div className="company-logo">{c.name.split(' ')[0].slice(0, 2).toUpperCase()}</div>
            <div className="company-main">
              <h3>{c.name}</h3>
              <p>SR: {c.rep}</p>
              <span>
                <Icon name="phone" size={15} /> {c.phone}
              </span>
            </div>
            <div className="company-stat">
              <small>পরিশোধযোগ্য</small>
              <strong>{fmt(c.payable)}</strong>
              <Badge tone={i % 3 === 0 ? 'orange' : 'red'}>
                {i % 3 === 0 ? 'এই সপ্তাহে' : 'বাকি'}
              </Badge>
            </div>
            <div className="company-foot">
              <span>
                <b>{products.filter((p) => p.company === c.name).length}</b> পণ্য
              </span>
              <span>
                ক্রয় <b>{fmt(145000 + i * 27800)}</b>
              </span>
              <button
                onClick={() =>
                  window.alert(
                    `${c.name}\nSR: ${c.rep}\nPhone: ${c.phone}\nPayable: ${fmt(c.payable)}`,
                  )
                }
              >
                বিস্তারিত <Icon name="arrow" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageFrame>
  )
}

function CustomersPage({
  customers,
  setCustomers,
  notify,
}: {
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
  notify: (s: string) => void
}) {
  const [filter, setFilter] = useState('বাকিসহ')
  const [search, setSearch] = useState('')
  const [collect, setCollect] = useState<Customer | null>(null)
  const [amount, setAmount] = useState(0)
  const [collectionMethod, setCollectionMethod] = useState('Cash')
  const list = customers
    .filter(
      (c) =>
        `${c.name} ${c.phone} ${c.village}`.includes(search) &&
        (filter === 'সবাই' ||
          (filter === 'বাকিসহ' && c.due > 0) ||
          (filter === 'বাকি নেই' && c.due === 0) ||
          (filter === 'লিমিটের বেশি' && c.due > c.limit)),
    )
    .sort((a, b) => b.due - a.due)
  const submit = () => {
    if (!collect || amount <= 0) return
    setCustomers((cs) =>
      cs.map((c) => (c.id === collect.id ? { ...c, due: Math.max(0, c.due - amount) } : c)),
    )
    notify(`${collect.name} থেকে ${fmt(amount)} আদায় হয়েছে`)
    setCollect(null)
    setAmount(0)
  }
  return (
    <PageFrame
      title="কাস্টমার ও বাকি খাতা"
      subtitle="CUSTOMER DUE LEDGER"
      action={
        <Button
          onClick={() => {
            const name = window.prompt('Customer name')
            if (!name) return
            const phone = window.prompt('Phone', '') || ''
            const village = window.prompt('Village / address', '') || ''
            const limit = Number(window.prompt('Credit limit', '20000')) || 20000
            setCustomers((items) => [
              {
                id: Date.now(),
                name,
                phone,
                village,
                limit,
                due: 0,
                purchase: 0,
                lastPurchase: new Date().toLocaleDateString('en-GB'),
              },
              ...items,
            ])
            notify('নতুন কাস্টমার যোগ হয়েছে')
          }}
        >
          <Icon name="plus" /> কাস্টমার যোগ
        </Button>
      }
    >
      <div className="due-overview">
        <div>
          <span>মোট বাজার বাকি</span>
          <strong>{fmt(customers.reduce((s, c) => s + c.due, 0))}</strong>
          <small>{customers.filter((c) => c.due > 0).length} জন কাস্টমার</small>
        </div>
        <div>
          <span>৩০ দিনের বেশি</span>
          <strong>{fmt(164800)}</strong>
          <small>২১ জন</small>
        </div>
        <div>
          <span>আজ আদায়</span>
          <strong className="green-text">{fmt(28750)}</strong>
          <small>৮টি পেমেন্ট</small>
        </div>
        <Button onClick={() => setCollect(list[0])}>
          <Icon name="wallet" /> দ্রুত বাকি আদায়
        </Button>
      </div>
      <div className="card toolbar">
        <div className="search-field">
          <Icon name="search" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম, ফোন বা গ্রাম দিয়ে খুঁজুন"
          />
        </div>
        <div className="filter-chips">
          {['সবাই', 'বাকিসহ', 'বাকি নেই', 'লিমিটের বেশি'].map((x) => (
            <button className={filter === x ? 'active' : ''} onClick={() => setFilter(x)} key={x}>
              {x}
            </button>
          ))}
        </div>
      </div>
      <div className="customer-grid">
        {list.slice(0, 20).map((c, i) => (
          <div className="card customer-card" key={c.id}>
            <div className="customer-top">
              <div className="avatar">{c.name[0]}</div>
              <div>
                <h3>{c.name}</h3>
                <p>
                  {c.village} · {c.phone}
                </p>
              </div>
              <Badge tone={i < 3 ? 'red' : i < 8 ? 'orange' : 'gray'}>
                {i < 3 ? '৯০+ দিন' : i < 8 ? '৩১–৬০ দিন' : '০–৩০ দিন'}
              </Badge>
            </div>
            <div className="customer-numbers">
              <span>
                <small>বর্তমান বাকি</small>
                <strong className={c.due ? 'red-text' : 'green-text'}>{fmt(c.due)}</strong>
              </span>
              <span>
                <small>মোট ক্রয়</small>
                <b>{fmt(c.purchase)}</b>
              </span>
              <span>
                <small>ক্রেডিট লিমিট</small>
                <b>{fmt(c.limit)}</b>
              </span>
            </div>
            <div className="progress">
              <i style={{ width: `${Math.min(100, (c.due / c.limit) * 100)}%` }} />
            </div>
            <div className="customer-actions">
              <Button onClick={() => setCollect(c)}>বাকি আদায়</Button>
              <Button
                variant="secondary"
                onClick={async () => {
                  const message = `${c.name}, Populer Agro Science-এ আপনার বর্তমান বাকি ${fmt(c.due)}। অনুগ্রহ করে পরিশোধ করুন।`
                  try {
                    await navigator.clipboard.writeText(message)
                    notify(`${c.name}-এর reminder কপি হয়েছে`)
                  } catch {
                    window.prompt('Copy reminder', message)
                  }
                }}
              >
                রিমাইন্ডার
              </Button>
              <button
                className="icon-btn"
                aria-label={`View ${c.name}`}
                onClick={() => notify(`${c.name} · ${c.phone} · ${c.village} · ${fmt(c.due)}`)}
              >
                <Icon name="arrow" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {collect && (
        <div className="modal-backdrop" onMouseDown={() => setCollect(null)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>বাকি আদায়</h2>
                <p>Collect due payment</p>
              </div>
              <button onClick={() => setCollect(null)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="collect-person">
              <div className="avatar">{collect.name[0]}</div>
              <span>
                <b>{collect.name}</b>
                <small>
                  {collect.phone} · {collect.village}
                </small>
              </span>
              <strong>
                {fmt(collect.due)}
                <small>বর্তমান বাকি</small>
              </strong>
            </div>
            <label className="big-input">
              <span>আদায়ের পরিমাণ</span>
              <div>
                <b>৳</b>
                <input
                  autoFocus
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(+e.target.value)}
                  placeholder="0"
                />
              </div>
            </label>
            <div className="amount-chips">
              {[500, 1000, 2000, collect.due].map((x) => (
                <button key={x} onClick={() => setAmount(x)}>
                  {x === collect.due ? 'সম্পূর্ণ' : fmt(x)}
                </button>
              ))}
            </div>
            <label className="field-label">পেমেন্ট মাধ্যম</label>
            <div className="payment-tabs">
              {['Cash', 'bKash', 'Nagad'].map((method) => (
                <button
                  key={method}
                  className={collectionMethod === method ? 'active' : ''}
                  onClick={() => setCollectionMethod(method)}
                >
                  {method}
                </button>
              ))}
            </div>
            <Button className="checkout" onClick={submit}>
              <Icon name="check" /> পেমেন্ট গ্রহণ করুন
            </Button>
          </div>
        </div>
      )}
    </PageFrame>
  )
}

function ExpensesPage({ notify }: { notify: (s: string) => void }) {
  const [expenses, setExpenses] = useStoredState<(string | number)[][]>('populer-expenses', [
    ['দোকান ভাড়া', 'ভাড়া', '01/05/2025', 12000],
    ['মাল পরিবহন', 'পরিবহন', '27/05/2025', 2850],
    ['শ্রমিক মজুরি', 'শ্রমিক', '27/05/2025', 1800],
    ['বিদ্যুৎ বিল', 'ইউটিলিটি', '24/05/2025', 2340],
    ['চা ও আপ্যায়ন', 'অন্যান্য', '23/05/2025', 560],
  ])
  const [expenseSearch, setExpenseSearch] = useState('')
  const [expenseCategory, setExpenseCategory] = useState('সব ক্যাটাগরি')
  const visibleExpenses = expenses.filter(
    (expense) =>
      (expenseCategory === 'সব ক্যাটাগরি' || expense[1] === expenseCategory) &&
      String(expense[0]).toLowerCase().includes(expenseSearch.toLowerCase()),
  )
  return (
    <PageFrame
      title="দৈনিক খরচ"
      subtitle="EXPENSE MANAGEMENT"
      action={
        <Button
          onClick={() => {
            const description = window.prompt('Expense description')
            if (!description) return
            const amount = Number(window.prompt('Amount', '0'))
            if (!Number.isFinite(amount) || amount <= 0) return
            const date = new Date().toLocaleDateString('en-GB')
            setExpenses((e) => [[description, 'অন্যান্য', date, amount], ...e])
            notify('নতুন খরচ যোগ হয়েছে')
          }}
        >
          <Icon name="plus" /> খরচ যোগ
        </Button>
      }
    >
      <div className="summary-strip">
        <div>
          <span>আজকের খরচ</span>
          <strong>{fmt(4650)}</strong>
          <small>৪টি এন্ট্রি</small>
        </div>
        <div>
          <span>এই সপ্তাহ</span>
          <strong>{fmt(14850)}</strong>
          <small>গত সপ্তাহ থেকে ৪% কম</small>
        </div>
        <div>
          <span>এই মাস</span>
          <strong>{fmt(38240)}</strong>
          <small>বাজেটের ৭৬%</small>
        </div>
        <div>
          <span>মাসিক বাজেট</span>
          <strong>{fmt(50000)}</strong>
          <small>বাকি {fmt(11760)}</small>
        </div>
      </div>
      <div className="card">
        <div className="toolbar">
          <div className="search-field">
            <Icon name="search" />
            <input
              value={expenseSearch}
              onChange={(event) => setExpenseSearch(event.target.value)}
              placeholder="খরচ খুঁজুন"
            />
          </div>
          <input type="date" defaultValue="2025-05-28" />
          <select
            value={expenseCategory}
            onChange={(event) => setExpenseCategory(event.target.value)}
          >
            <option>সব ক্যাটাগরি</option>
            <option>ভাড়া</option>
            <option>পরিবহন</option>
          </select>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>খরচের বিবরণ</th>
                <th>ক্যাটাগরি</th>
                <th>তারিখ</th>
                <th>পেমেন্ট</th>
                <th>পরিমাণ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleExpenses.map((e, i) => (
                <tr key={i}>
                  <td>
                    <b>{e[0]}</b>
                  </td>
                  <td>
                    <Badge tone="gray">{e[1]}</Badge>
                  </td>
                  <td>{e[2]}</td>
                  <td>Cash</td>
                  <td>
                    <b>{fmt(+e[3])}</b>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      aria-label={`Delete ${String(e[0])}`}
                      onClick={() => {
                        if (window.confirm(`Delete ${String(e[0])}?`)) {
                          setExpenses((items) => items.filter((_, index) => index !== i))
                          notify('খরচ মুছে ফেলা হয়েছে')
                        }
                      }}
                    >
                      <Icon name="dots" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageFrame>
  )
}

const reportNames = [
  'বিক্রয় রিপোর্ট',
  'লাভ ও ক্ষতি',
  'ক্যাশ বুক',
  'বাকি রিপোর্ট',
  'কাস্টমার অনুযায়ী',
  'কোম্পানি ক্রয়-বিক্রয়',
  'পণ্য অনুযায়ী বিক্রয়',
  'স্টক ভ্যালুয়েশন',
  'মেয়াদ রিপোর্ট',
  'লো-স্টক রিপোর্ট',
  'খরচ রিপোর্ট',
  'Supplier Payable',
]

function ReportsPage({ notify }: { notify: (s: string) => void }) {
  const [report, setReport] = useState('বিক্রয় রিপোর্ট')
  const [period, setPeriod] = useState('মাসিক')
  return (
    <PageFrame title="হিসাব ও রিপোর্ট" subtitle="BUSINESS REPORTS">
      <div className="report-layout">
        <div className="card report-menu">
          <h3>রিপোর্ট নির্বাচন</h3>
          {reportNames.map((x, i) => (
            <button key={x} className={report === x ? 'active' : ''} onClick={() => setReport(x)}>
              <span>
                <Icon name={i < 3 ? 'chart' : i < 7 ? 'users' : 'box'} />
                {x}
              </span>
              <Icon name="arrow" size={16} />
            </button>
          ))}
        </div>
        <div className="page-stack">
          <div className="card report-header">
            <div>
              <p className="eyebrow">বর্তমান রিপোর্ট</p>
              <h2>{report}</h2>
            </div>
            <div className="scope-switch compact">
              {['দৈনিক', 'সাপ্তাহিক', 'মাসিক', 'বার্ষিক', 'কাস্টম'].map((x) => (
                <button
                  className={period === x ? 'active' : ''}
                  key={x}
                  onClick={() => setPeriod(x)}
                >
                  {x}
                </button>
              ))}
            </div>
            <div className="report-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  window.print()
                  notify('PDF রিপোর্ট প্রিন্ট ডায়ালগে প্রস্তুত')
                }}
              >
                PDF
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const rows = salesRecords.map((sale) =>
                    [
                      sale.invoice,
                      sale.date,
                      sale.customer,
                      sale.amount,
                      sale.paid ? 'Paid' : 'Due',
                    ].join(','),
                  )
                  downloadFile(
                    'populer-agro-sales.csv',
                    ['Invoice,Date,Customer,Amount,Status', ...rows].join('\n'),
                    'text/csv',
                  )
                  notify('Excel রিপোর্ট তৈরি হয়েছে')
                }}
              >
                Excel
              </Button>
              <Button variant="secondary" onClick={() => window.print()}>
                Print
              </Button>
            </div>
          </div>
          <div className="summary-strip reports">
            <div>
              <span>মোট বিক্রয়</span>
              <strong>{fmt(684520)}</strong>
              <small>৪৮২টি invoice</small>
            </div>
            <div>
              <span>মোট লাভ</span>
              <strong className="green-text">{fmt(128430)}</strong>
              <small>Margin ১৮.৮%</small>
            </div>
            <div>
              <span>বাকি বিক্রয়</span>
              <strong className="red-text">{fmt(158220)}</strong>
              <small>২৩.১%</small>
            </div>
          </div>
          <div className="card chart-card">
            <SectionTitle bn="মাসের প্রবণতা" en="Monthly trend" />
            <div className="bar-chart">
              {[42, 61, 55, 76, 63, 88, 74, 96, 68, 83, 91, 78, 103, 89].map((v, i) => (
                <div key={i}>
                  <i style={{ height: `${v}%` }} />
                  <span>{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card table-card">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>তারিখ</th>
                    <th>ইনভয়েস</th>
                    <th>কাস্টমার</th>
                    <th>বিক্রয়</th>
                    <th>খরচ</th>
                    <th>লাভ</th>
                    <th>স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {initialCustomers.slice(0, 8).map((c, i) => (
                    <tr key={c.id}>
                      <td>{28 - i}/05/2025</td>
                      <td>#PS-250{829 - i}</td>
                      <td>{c.name}</td>
                      <td>
                        <b>{fmt(7450 + i * 1830)}</b>
                      </td>
                      <td>{fmt(5500 + i * 1210)}</td>
                      <td className="green-text">
                        <b>{fmt(1950 + i * 620)}</b>
                      </td>
                      <td>
                        <Badge tone={i % 3 ? 'green' : 'red'}>{i % 3 ? 'পরিশোধ' : 'বাকি'}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  )
}

function SettingsPage({
  dark,
  setDark,
  lang,
  setLang,
  notify,
}: {
  dark: boolean
  setDark: (v: boolean) => void
  lang: boolean
  setLang: (v: boolean) => void
  notify: (s: string) => void
}) {
  const [section, setSection] = useState('দোকানের প্রোফাইল')
  return (
    <PageFrame title="সেটিংস" subtitle="SHOP PREFERENCES">
      <div className="settings-layout">
        <div className="card settings-menu">
          {[
            'দোকানের প্রোফাইল',
            'ইনভয়েস সেটিংস',
            'অ্যালার্ট ও স্টক',
            'ইউজার ও ভূমিকা',
            'ভাষা ও থিম',
            'ব্যাকআপ ও ডেটা',
          ].map((x) => (
            <button className={section === x ? 'active' : ''} onClick={() => setSection(x)} key={x}>
              {x}
              <Icon name="arrow" size={16} />
            </button>
          ))}
        </div>
        <div className="card settings-form">
          <SectionTitle bn={section} en="Configure your shop" />
          {section === 'দোকানের প্রোফাইল' ? (
            <>
              <div className="shop-logo">
                PA<span>লোগো পরিবর্তন</span>
              </div>
              <div className="form-grid">
                <label>
                  <span>দোকানের নাম</span>
                  <input defaultValue="Populer Agro Science" />
                </label>
                <label>
                  <span>মালিকের নাম</span>
                  <input defaultValue="Abdul Momin" />
                </label>
                <label>
                  <span>ফোন নম্বর</span>
                  <input defaultValue="01712-345678" />
                </label>
                <label>
                  <span>ইমেইল</span>
                  <input defaultValue="populeragro@gmail.com" />
                </label>
                <label className="full">
                  <span>ঠিকানা</span>
                  <input defaultValue="কলেজ রোড, নতুন বাজার, বগুড়া" />
                </label>
              </div>
            </>
          ) : section === 'ভাষা ও থিম' ? (
            <div className="setting-options">
              <button className={lang ? 'selected' : ''} onClick={() => setLang(true)}>
                <span>
                  <b>বাংলা + English</b>
                  <small>প্রাথমিক ভাষা বাংলা</small>
                </span>
                <i>{lang && <Icon name="check" />}</i>
              </button>
              <button className={!lang ? 'selected' : ''} onClick={() => setLang(false)}>
                <span>
                  <b>English</b>
                  <small>Use English as primary</small>
                </span>
                <i>{!lang && <Icon name="check" />}</i>
              </button>
              <div className="toggle-row">
                <span>
                  <b>ডার্ক মোড</b>
                  <small>চোখের আরামের জন্য গাঢ় রঙ</small>
                </span>
                <button className={`toggle ${dark ? 'on' : ''}`} onClick={() => setDark(!dark)}>
                  <i />
                </button>
              </div>
            </div>
          ) : section === 'অ্যালার্ট ও স্টক' ? (
            <div className="form-grid">
              <label>
                <span>প্রথম expiry alert (দিন)</span>
                <input type="number" defaultValue="90" />
              </label>
              <label>
                <span>দ্বিতীয় alert (দিন)</span>
                <input type="number" defaultValue="60" />
              </label>
              <label>
                <span>জরুরি alert (দিন)</span>
                <input type="number" defaultValue="30" />
              </label>
              <label>
                <span>ডিফল্ট reorder level</span>
                <input type="number" defaultValue="20" />
              </label>
            </div>
          ) : section === 'ইনভয়েস সেটিংস' ? (
            <div className="form-grid">
              <label>
                <span>ইনভয়েস Prefix</span>
                <input defaultValue="PS-" />
              </label>
              <label>
                <span>ডিফল্ট প্রিন্ট</span>
                <select>
                  <option>80mm Receipt</option>
                  <option>A4 Invoice</option>
                </select>
              </label>
              <label className="full">
                <span>ফুটার বার্তা</span>
                <input defaultValue="আমাদের সাথে কেনাকাটা করার জন্য ধন্যবাদ" />
              </label>
            </div>
          ) : (
            <div className="setting-options">
              <button
                onClick={() => {
                  if (section === 'ইউজার ও ভূমিকা') notify('Owner permissions: Full access')
                  else {
                    downloadFile(
                      'populer-agro-data.json',
                      JSON.stringify(
                        { products, companies, customers: initialCustomers, sales: salesRecords },
                        null,
                        2,
                      ),
                    )
                    notify('সম্পূর্ণ ডেটা Export হয়েছে')
                  }
                }}
              >
                <span>
                  <b>{section === 'ইউজার ও ভূমিকা' ? 'Owner — Abdul Momin' : 'সম্পূর্ণ ডেটা Export'}</b>
                  <small>
                    {section === 'ইউজার ও ভূমিকা' ? 'সব অনুমতি চালু' : 'শেষ backup: আজ, ১০:৩২ AM'}
                  </small>
                </span>
                <Icon name="arrow" />
              </button>
              <button
                onClick={() => {
                  if (section === 'ইউজার ও ভূমিকা') notify('Staff permissions: Sales and stock')
                  else {
                    downloadFile(
                      `populer-agro-backup-${new Date().toISOString().slice(0, 10)}.json`,
                      JSON.stringify(
                        { products, companies, customers: initialCustomers, sales: salesRecords },
                        null,
                        2,
                      ),
                    )
                    notify('লোকাল Backup তৈরি হয়েছে')
                  }
                }}
              >
                <span>
                  <b>
                    {section === 'ইউজার ও ভূমিকা' ? 'Staff — Kamal Hossain' : 'লোকাল Backup তৈরি করুন'}
                  </b>
                  <small>
                    {section === 'ইউজার ও ভূমিকা' ? 'বিক্রয় ও স্টক অনুমতি' : 'Excel / JSON data file'}
                  </small>
                </span>
                <Icon name="arrow" />
              </button>
            </div>
          )}
          <div className="form-actions">
            <Button variant="secondary" onClick={() => notify('পরিবর্তন বাতিল হয়েছে')}>
              বাতিল
            </Button>
            <Button onClick={() => notify('সেটিংস সফলভাবে সংরক্ষিত হয়েছে')}>
              <Icon name="check" /> পরিবর্তন সংরক্ষণ
            </Button>
          </div>
        </div>
      </div>
    </PageFrame>
  )
}

function PageFrame({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="page-stack">
      <div className="page-head">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h1>{title}</h1>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState(true)
  const [customers, setCustomers] = useStoredState('populer-customers', initialCustomers)
  const [toast, setToast] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  useEffect(() => {
    const savedLocale = window.localStorage.getItem('populer-locale')
    const savedTheme = window.localStorage.getItem('populer-theme')
    if (savedLocale) setLang(savedLocale === 'bn')
    if (savedTheme) setDark(savedTheme === 'dark')
  }, [])
  useEffect(() => {
    window.localStorage.setItem('populer-locale', lang ? 'bn' : 'en')
    window.localStorage.setItem('populer-theme', dark ? 'dark' : 'light')
  }, [lang, dark])
  const notify = (s: string) => {
    setToast(s)
    window.setTimeout(() => setToast(''), 2600)
  }
  const go = (p: Page) => {
    setPage(p)
    setMobileMenu(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const pageName = navItems.find((x) => x.id === page)
  const content = useMemo(() => {
    if (page === 'dashboard') return <Dashboard go={go} notify={notify} />
    if (page === 'sale')
      return <Sale customers={customers} setCustomers={setCustomers} notify={notify} />
    if (page === 'products') return <ProductsPage notify={notify} />
    if (page === 'stock') return <StockPage notify={notify} />
    if (page === 'purchase') return <PurchasePage notify={notify} />
    if (page === 'companies') return <CompaniesPage notify={notify} />
    if (page === 'customers')
      return <CustomersPage customers={customers} setCustomers={setCustomers} notify={notify} />
    if (page === 'expenses') return <ExpensesPage notify={notify} />
    if (page === 'reports') return <ReportsPage notify={notify} />
    return (
      <SettingsPage dark={dark} setDark={setDark} lang={lang} setLang={setLang} notify={notify} />
    )
  }, [page, customers, dark, lang])
  return (
    <div className={dark ? 'app dark' : 'app'} data-locale={lang ? 'bn' : 'en'}>
      <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <span>PA</span>
          </div>
          <div>
            <strong>Populer Agro</strong>
            <small>SCIENCE · SHOP MANAGER</small>
          </div>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}>
            <Icon name="close" />
          </button>
        </div>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={page === item.id ? 'active' : ''}
              onClick={() => go(item.id)}
            >
              <Icon name={item.icon} />
              <span>
                {lang ? item.bn : item.en}
                <small>{lang ? item.en : item.bn}</small>
              </span>
              {item.id === 'stock' && <em>9</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="owner-avatar">AM</div>
          <div>
            <b>Abdul Momin</b>
            <small>Owner · Admin</small>
          </div>
          <button aria-label="Open profile settings" onClick={() => go('settings')}>
            <Icon name="dots" />
          </button>
        </div>
      </aside>
      {mobileMenu && <div className="side-overlay" onClick={() => setMobileMenu(false)} />}
      <div className="main-shell">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setMobileMenu(true)}>
            <Icon name="grid" />
          </button>
          <div className="mobile-brand">
            <strong>{lang ? pageName?.bn : pageName?.en}</strong>
            <small>{lang ? pageName?.en : pageName?.bn}</small>
          </div>
          <div className="global-search">
            <Icon name="search" />
            <input
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' || !globalSearch.trim()) return
                window.sessionStorage.setItem('populer-product-search', globalSearch.trim())
                go('products')
                notify(`Search: ${globalSearch.trim()}`)
              }}
              placeholder={
                lang ? 'পণ্য, কাস্টমার, ইনভয়েস খুঁজুন...' : 'Search product, customer or invoice...'
              }
            />
            <kbd>⌘ K</kbd>
          </div>
          <div className="top-actions">
            <button className="language-btn" onClick={() => setLang(!lang)}>
              {lang ? 'বাং' : 'EN'}
              <span>/ {lang ? 'EN' : 'বাং'}</span>
            </button>
            <button className="icon-btn" onClick={() => setDark(!dark)}>
              <Icon name={dark ? 'sun' : 'moon'} />
            </button>
            <div className="notif-wrap">
              <button className="icon-btn bell" onClick={() => setNotifications(!notifications)}>
                <Icon name="bell" />
                <i>4</i>
              </button>
              {notifications && (
                <div className="notification-pop">
                  <div>
                    <h3>নোটিফিকেশন</h3>
                    <button onClick={() => setNotifications(false)}>সব পড়া হয়েছে</button>
                  </div>
                  {[
                    ['৭টি পণ্যের মেয়াদ শেষ', 'আজই ব্যবস্থা নিন', 'red'],
                    ['৯টি পণ্যের স্টক কম', 'Reorder করুন', 'yellow'],
                    ['১৪ জনের বাকি বেশি', 'Reminder পাঠান', 'purple'],
                  ].map((x) => (
                    <button
                      key={x[0]}
                      onClick={() => {
                        go(x[2] === 'purple' ? 'customers' : 'stock')
                        setNotifications(false)
                      }}
                    >
                      <i className={`notice-${x[2]}`} />
                      <span>
                        <b>{x[0]}</b>
                        <small>{x[1]}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="top-user">
              <div className="owner-avatar">AM</div>
              <span>
                <b>Abdul Momin</b>
                <small>Proprietor</small>
              </span>
            </div>
          </div>
        </header>
        <main>{content}</main>
      </div>
      <nav className="bottom-nav">
        {navItems.slice(0, 5).map((x) => (
          <button key={x.id} className={page === x.id ? 'active' : ''} onClick={() => go(x.id)}>
            <Icon name={x.icon} />
            <span>{lang ? x.bn.split(' ')[0] : x.en}</span>
          </button>
        ))}
        <button onClick={() => setMobileMenu(true)}>
          <Icon name="dots" />
          <span>{lang ? 'আরও' : 'More'}</span>
        </button>
      </nav>
      {toast && (
        <div className="toast">
          <span>
            <Icon name="check" />
          </span>
          {toast}
        </div>
      )}
    </div>
  )
}
