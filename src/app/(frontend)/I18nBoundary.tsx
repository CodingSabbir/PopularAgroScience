'use client'

import { useEffect, useRef, type ReactNode } from 'react'

const exact: Record<string, string> = {
  'ব্যবসার সারসংক্ষেপ': 'Business overview',
  'শুভ সকাল, আব্দুল মোমিন': 'Good morning, Abdul Momin',
  'আপনার দোকানের আজকের হিসাব এক নজরে দেখুন': "See today's shop accounts at a glance",
  'এই মাস': 'This month',
  'এই সপ্তাহ': 'This week',
  'এই বছর': 'This year',
  গতকাল: 'Yesterday',
  আজ: 'Today',
  কাস্টম: 'Custom',
  'মোট বিক্রয়': 'Total sales',
  'মোট লাভ': 'Total profit',
  'ক্যাশ পেয়েছি': 'Cash received',
  'বাজারে বাকি': 'Market due',
  'মোট ক্রয়': 'Total purchase',
  'স্টকের মূল্য': 'Stock value',
  খরচ: 'Expenses',
  'আগের সময়ের তুলনায়': 'compared with previous period',
  'দ্রুত কাজ': 'Quick actions',
  'নতুন বিক্রয়': 'New sale',
  'স্টক যোগ': 'Add stock',
  'কাস্টমার যোগ': 'Add customer',
  'বাকি আদায়': 'Collect due',
  'খরচ যোগ': 'Add expense',
  'মেয়াদ শেষ পণ্য': 'Expired products',
  '৯০ দিনের মধ্যে মেয়াদ': 'Expiring within 90 days',
  'লো স্টক পণ্য': 'Low-stock products',
  'বেশি বাকি কাস্টমার': 'High-due customers',
  'বিক্রয় বনাম লাভ': 'Sales vs profit',
  'শেষ ১২ দিন': 'Last 12 days',
  বিক্রয়: 'Sales',
  লাভ: 'Profit',
  'ক্যাটাগরি অনুযায়ী বিক্রয়': 'Sales by category',
  'সবচেয়ে বেশি বিক্রিত পণ্য': 'Top-selling products',
  'সাম্প্রতিক বিক্রয়': 'Recent sales',
  'আসন্ন মেয়াদ': 'Upcoming expiry',
  'সব দেখুন': 'View all',
  পরিশোধ: 'Paid',
  বাকি: 'Due',
  'বিক্রয় কেন্দ্র': 'Point of sale',
  'FEFO চালু': 'FEFO enabled',
  'পণ্যের নাম, কোম্পানি বা বারকোড দিয়ে খুঁজুন...': 'Search by product, company or barcode...',
  'সব পণ্য': 'All products',
  কীটনাশক: 'Insecticide',
  ছত্রাকনাশক: 'Fungicide',
  আগাছানাশক: 'Herbicide',
  সার: 'Fertilizer',
  বীজ: 'Seed',
  'বিক্রয় তালিকা': 'Sale cart',
  'সব মুছুন': 'Clear all',
  কাস্টমার: 'Customer',
  'ওয়াক-ইন কাস্টমার': 'Walk-in customer',
  'পণ্য যোগ করতে বাম পাশ থেকে পণ্য চাপুন': 'Select a product to add it to the sale',
  পিস: 'Piece',
  কার্টন: 'Carton',
  ডিসকাউন্ট: 'Discount',
  সাবটোটাল: 'Subtotal',
  সর্বমোট: 'Grand total',
  'বিক্রয় সম্পন্ন করুন': 'Complete sale',
  'বিক্রয়ের পর A4 / 80mm রসিদ প্রিন্ট বা শেয়ার করা যাবে':
    'Print or share an A4 / 80mm receipt after completing the sale',
  পণ্যসমূহ: 'Products',
  'নতুন পণ্য': 'New product',
  'পণ্য, জেনেরিক বা কোম্পানি খুঁজুন': 'Search product, generic or company',
  'সব ক্যাটাগরি': 'All categories',
  'সব কোম্পানি': 'All companies',
  'পণ্য / SKU': 'Product / SKU',
  কোম্পানি: 'Company',
  ক্যাটাগরি: 'Category',
  'প্যাক ও কার্টন': 'Pack & carton',
  মূল্য: 'Price',
  স্টক: 'Stock',
  'স্টক ব্যবস্থাপনা': 'Stock management',
  'স্টক অ্যাডজাস্ট': 'Adjust stock',
  'মোট স্টক মূল্য': 'Total stock value',
  'মোট পিস': 'Total pieces',
  'লো স্টক': 'Low stock',
  'মেয়াদ শেষ ক্ষতি': 'Expired stock loss',
  'সব স্টক': 'All stock',
  'মেয়াদ আসন্ন': 'Expiring soon',
  'মেয়াদ শেষ': 'Expired',
  'কোম্পানি অনুযায়ী': 'By company',
  'মোট স্টক': 'Total stock',
  'ব্যাচ নম্বর': 'Batch number',
  মেয়াদ: 'Expiry',
  'নতুন ক্রয় / স্টক ইন': 'New purchase / stock in',
  'ক্রয় ইতিহাস': 'Purchase history',
  'চালানের তথ্য': 'Invoice details',
  'কোম্পানি / সাপ্লায়ার *': 'Company / supplier *',
  'ইনভয়েস নম্বর *': 'Invoice number *',
  তারিখ: 'Date',
  'পণ্য যোগ করুন': 'Add products',
  'লাইন যোগ': 'Add line',
  পণ্য: 'Product',
  পরিমাণ: 'Quantity',
  ইউনিট: 'Unit',
  ব্যাচ: 'Batch',
  'ক্রয় মূল্য': 'Buying price',
  'পেমেন্ট সারাংশ': 'Payment summary',
  আংশিক: 'Partial',
  'কোম্পানি বাকি': 'Supplier due',
  'পেমেন্ট মাধ্যম': 'Payment method',
  'ক্রয় সংরক্ষণ': 'Save purchase',
  'স্টক ও supplier ledger স্বয়ংক্রিয়ভাবে আপডেট হবে':
    'Stock and supplier ledger will update automatically',
  'কোম্পানি ও সাপ্লায়ার': 'Companies & suppliers',
  'কোম্পানি যোগ': 'Add company',
  পরিশোধযোগ্য: 'Payable',
  'এই সপ্তাহে': 'This week',
  বিস্তারিত: 'Details',
  'কাস্টমার ও বাকি খাতা': 'Customers & due ledger',
  'মোট বাজার বাকি': 'Total market due',
  '৩০ দিনের বেশি': 'Over 30 days',
  'আজ আদায়': 'Collected today',
  'দ্রুত বাকি আদায়': 'Quick due collection',
  'নাম, ফোন বা গ্রাম দিয়ে খুঁজুন': 'Search by name, phone or village',
  সবাই: 'All',
  বাকিসহ: 'With due',
  'বাকি নেই': 'No due',
  'লিমিটের বেশি': 'Over limit',
  'বর্তমান বাকি': 'Current due',
  'ক্রেডিট লিমিট': 'Credit limit',
  রিমাইন্ডার: 'Reminder',
  'আদায়ের পরিমাণ': 'Collection amount',
  সম্পূর্ণ: 'Full amount',
  'পেমেন্ট গ্রহণ করুন': 'Receive payment',
  'দৈনিক খরচ': 'Daily expenses',
  'আজকের খরচ': "Today's expenses",
  'মাসিক বাজেট': 'Monthly budget',
  'খরচ খুঁজুন': 'Search expenses',
  'খরচের বিবরণ': 'Expense details',
  পেমেন্ট: 'Payment',
  'হিসাব ও রিপোর্ট': 'Accounts & reports',
  'রিপোর্ট নির্বাচন': 'Select report',
  'বিক্রয় রিপোর্ট': 'Sales report',
  'লাভ ও ক্ষতি': 'Profit & loss',
  'ক্যাশ বুক': 'Cash book',
  'বাকি রিপোর্ট': 'Due report',
  'কাস্টমার অনুযায়ী': 'By customer',
  'কোম্পানি ক্রয়-বিক্রয়': 'Company purchase & sales',
  'পণ্য অনুযায়ী বিক্রয়': 'Product-wise sales',
  'স্টক ভ্যালুয়েশন': 'Stock valuation',
  'মেয়াদ রিপোর্ট': 'Expiry report',
  'লো-স্টক রিপোর্ট': 'Low-stock report',
  'খরচ রিপোর্ট': 'Expense report',
  'বর্তমান রিপোর্ট': 'Current report',
  দৈনিক: 'Daily',
  সাপ্তাহিক: 'Weekly',
  মাসিক: 'Monthly',
  বার্ষিক: 'Yearly',
  'মাসের প্রবণতা': 'Monthly trend',
  স্ট্যাটাস: 'Status',
  সেটিংস: 'Settings',
  'দোকানের প্রোফাইল': 'Shop profile',
  'ইনভয়েস সেটিংস': 'Invoice settings',
  'অ্যালার্ট ও স্টক': 'Alerts & stock',
  'ইউজার ও ভূমিকা': 'Users & roles',
  'ভাষা ও থিম': 'Language & theme',
  'ব্যাকআপ ও ডেটা': 'Backup & data',
  'লোগো পরিবর্তন': 'Change logo',
  'দোকানের নাম': 'Shop name',
  'মালিকের নাম': 'Owner name',
  'ফোন নম্বর': 'Phone number',
  ইমেইল: 'Email',
  ঠিকানা: 'Address',
  'বাংলা + English': 'Bangla',
  'প্রাথমিক ভাষা বাংলা': 'Primary language: Bangla',
  'ডার্ক মোড': 'Dark mode',
  'চোখের আরামের জন্য গাঢ় রঙ': 'Dark colors for comfortable viewing',
  'পরিবর্তন সংরক্ষণ': 'Save changes',
  বাতিল: 'Cancel',
  'সম্পূর্ণ ডেটা Export': 'Export all data',
  'লোকাল Backup তৈরি করুন': 'Create local backup',
  'সব পড়া হয়েছে': 'Mark all read',
  নোটিফিকেশন: 'Notifications',
  'আজই ব্যবস্থা নিন': 'Take action today',
  'Reminder পাঠান': 'Send reminder',
  'Reorder করুন': 'Reorder now',
  আরও: 'More',
  বাং: 'BN',
  'নতুন পণ্য যোগ হয়েছে': 'Product added',
  'নতুন কোম্পানি যোগ হয়েছে': 'Company added',
  'নতুন কাস্টমার যোগ হয়েছে': 'Customer added',
  'নতুন খরচ যোগ হয়েছে': 'Expense added',
  'খরচ মুছে ফেলা হয়েছে': 'Expense deleted',
  'স্টক সফলভাবে অ্যাডজাস্ট হয়েছে': 'Stock adjusted successfully',
  'সব পণ্যের ব্যাচ, মেয়াদ, পরিমাণ ও মূল্য দিন':
    'Enter batch, expiry, quantity and price for every product',
  'বাকি বিক্রয়ের জন্য একজন কাস্টমার নির্বাচন করুন': 'Select a customer for a due sale',
  'পরিবর্তন বাতিল হয়েছে': 'Changes cancelled',
  'সেটিংস সফলভাবে সংরক্ষিত হয়েছে': 'Settings saved successfully',
  'সম্পূর্ণ ডেটা Export হয়েছে': 'All data exported',
  'লোকাল Backup তৈরি হয়েছে': 'Local backup created',
  'মেয়াদোত্তীর্ণ ব্যাচ বিক্রি করা যাবে না': 'Expired batches cannot be sold',
  'আগে অন্তত একটি পণ্য যোগ করুন': 'Add at least one product first',
  'সার ও PGR': 'Fertilizer & PGR',
}

const parts: Array<[RegExp, string]> = [
  [/(\d+)টি পণ্য/g, '$1 products'],
  [/(\d+)টি SKU পাওয়া গেছে/g, '$1 SKUs found'],
  [/(\d+) জন কাস্টমার/g, '$1 customers'],
  [/(\d+) দিন বাকি/g, '$1 days left'],
  [/(\d+) দিন আগে শেষ/g, 'expired $1 days ago'],
  [/(\d+) কার্টন \+ (\d+) পিস/g, '$1 cartons + $2 pcs'],
  [/ব্যাচ:/g, 'Batch:'],
  [/মে/g, 'May'],
  [/ক্রয়/g, 'Purchase'],
  [/মোট/g, 'Total'],
]

const bengaliDigits = '০১২৩৪৫৬৭৮৯'
const toEnglishDigits = (value: string) =>
  value.replace(/[০-৯]/g, (digit) => String(bengaliDigits.indexOf(digit)))

function englishFor(value: string) {
  const leading = value.match(/^\s*/)?.[0] ?? ''
  const trailing = value.match(/\s*$/)?.[0] ?? ''
  const core = value.trim()
  if (!core) return value
  let translated = exact[core] ?? core
  for (const [pattern, replacement] of parts) translated = translated.replace(pattern, replacement)
  translated = toEnglishDigits(translated)
  return `${leading}${translated}${trailing}`
}

export default function I18nBoundary({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const originals = new WeakMap<Node, string>()
    const originalAttributes = new WeakMap<Element, Map<string, string>>()
    let applying = false

    const translate = () => {
      if (applying) return
      applying = true
      const english = root.querySelector<HTMLElement>('.app')?.dataset.locale === 'en'
      document.documentElement.lang = english ? 'en' : 'bn'

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node) {
        if (!originals.has(node)) originals.set(node, node.nodeValue ?? '')
        const original = originals.get(node) ?? ''
        const next = english ? englishFor(original) : original
        if (node.nodeValue !== next) node.nodeValue = next
        node = walker.nextNode()
      }

      root.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((element) => {
        let values = originalAttributes.get(element)
        if (!values) {
          values = new Map()
          originalAttributes.set(element, values)
        }
        const placeholder = element.getAttribute('placeholder') ?? ''
        if (!values.has('placeholder')) values.set('placeholder', placeholder)
        const original = values.get('placeholder') ?? ''
        element.setAttribute('placeholder', english ? englishFor(original) : original)
      })
      applying = false
    }

    translate()
    const observer = new MutationObserver(() => queueMicrotask(translate))
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-locale'],
      childList: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [])

  return <div ref={rootRef}>{children}</div>
}
