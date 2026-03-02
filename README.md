# Iranian Tech Association (ITA) - Bilingual Website

A comprehensive, institutionally-designed bilingual (English/Farsi) website for the Iranian Tech Association, emphasizing security, transparency, and member safety.

## 🦁 Project Overview

This is a Next.js full-stack application built with:
- **TypeScript** for type safety
- **Tailwind CSS** for responsive, modern design
- **next-intl** for seamless bilingual support (LTR/RTL)
- **React Server Components** for optimal performance
- **Institutional Design** inspired by internetsociety.org

## 🎯 Key Features

### 1. **The Pledge Gateway**
- Interactive pledge stepper component
- Users must accept the Four Pillars before membership
  - Integrity
  - Secularism
  - Equality
  - Self-Determination
- Visual progress tracking with acceptance confirmation

### 2. **Membership Application**
- Comprehensive form with the following fields:
  - Full Name, Email, Organization
  - Areas of Expertise
  - Projects of Interest
  - **Participation Security Level** (new):
    - **Public Advocate**: Listed in public directory
    - **Discrete Contributor**: Anonymous contributor in public records
    - **Confidential Member**: Strictly internal & encrypted involvement
- Secure form submission with encryption assurance
- Bilingual support throughout

### 3. **Trust Center**
- No-Logs Policy documentation
- End-to-End Encryption details
- Security audit information
- Secure jurisdiction explanation
- Industry-standard compliance badges (ISO 27001, SOC 2 Type II)
- Transparency & compliance statements

### 4. **Bilingual Support (i18n)**
- Seamless English ↔ Farsi switching
- Automatic RTL/LTR text direction
- Complete translation of all content
- Stored in `/public/locales/` directory

### 5. **Privacy & Security**
- **No-Logs Policy**: IP addresses, browser fingerprints, and session data are never tracked
- **Encrypted Storage**: All data encrypted at rest in secure, non-extradition jurisdictions
- **Member Safety**: Security level preferences are strictly honored
- **Transparent Communication**: Privacy commitment displayed prominently in footer

## 📁 Project Structure

```
/Users/roham/SLTA/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles
│   └── [locale]/                     # Locale-based routing
│       ├── layout.tsx                # Locale layout with i18n provider
│       ├── page.tsx                  # Home page
│       ├── membership/
│       │   └── page.tsx              # Membership pledge & form
│       └── trust/
│           └── page.tsx              # Trust center
├── components/
│   ├── CircuitLionLogo.tsx           # Minimalist circuit lion SVG logo
│   ├── Pledge/
│   │   └── PledgeStepper.tsx         # Interactive pledge component
│   ├── Forms/
│   │   └── MembershipForm.tsx        # Membership application form
│   ├── Trust/
│   │   └── TrustCenter.tsx           # Trust center content
│   └── Layout/
│       ├── Header.tsx                # Navigation header
│       └── Footer.tsx                # Footer with privacy statement
├── lib/
│   └── i18n.ts                       # i18n configuration
├── public/
│   └── locales/
│       ├── en/
│       │   └── common.json           # English translations
│       └── fa/
│           └── common.json           # Farsi translations
├── middleware.ts                     # next-intl middleware
├── next.config.js                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.js                # Tailwind configuration
└── package.json                      # Dependencies

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
cd /Users/roham/SLTA
npm install
```

### Development

```bash
npm run dev
```

The application will be available at:
- English: [http://localhost:3000/en](http://localhost:3000/en)
- Farsi: [http://localhost:3000/fa](http://localhost:3000/fa)

### Build for Production

```bash
npm run build
npm start
```

## 🛡️ Security & Privacy Features

### No-Logs Infrastructure
- **No IP Logging**: IP addresses are not stored or tracked
- **No Session Tracking**: Browser fingerprints and session data are never collected
- **Encrypted at Rest**: All membership data is encrypted using industry-standard protocols
- **Secure Jurisdiction**: Data stored in non-extradition countries with maximum privacy protections

### Member Privacy Levels
- **Public Advocate**: Full visibility in directory, authorized to represent association
- **Discrete Contributor**: Can contribute technical work while maintaining anonymity
- **Confidential Member**: Involvement strictly internal and never disclosed

### Compliance
- ISO 27001 certified security management
- SOC 2 Type II compliance
- End-to-End Encryption (E2EE)
- Regular independent security audits

## 🌐 Bilingual Implementation

### Language Switching
- Click the language toggle in the header (English/فارسی)
- Automatic RTL/LTR text direction based on language
- All content automatically translated

### Translation Files
- Located in `/public/locales/`
- `en/common.json` - English content
- `fa/common.json` - Farsi content

### Adding New Translations
1. Add new key-value pairs to both `en/common.json` and `fa/common.json`
2. Use `useTranslations()` hook in components: `const t = useTranslations(); t('key')`
3. Restart dev server

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Accents**: Red, Blue, Green, Purple for four pillars
- **Background**: Clean white with subtle gradients
- **Text**: Dark gray (#1f2937) for main content

### Components
- **Responsive Grid**: Mobile-first design, optimized for all screen sizes
- **Accessibility**: Semantic HTML, proper contrast ratios
- **Interactions**: Smooth transitions, hover effects, visual feedback

## 📱 Responsive Design

- **Mobile**: Full responsive layout (< 768px)
- **Tablet**: Optimized grid layouts (768px - 1024px)
- **Desktop**: Multi-column layouts with max-width containers (> 1024px)

## 🔧 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔐 Data Handling

### Form Submission
- All form data is encrypted before storage
- Security level preferences are strictly honored
- Confidential members' data never exposed to public
- Compliance reminder displayed on every form

### Data Storage
- Encrypted at rest
- Stored in non-extradition jurisdiction
- Regular security audits
- No third-party data sharing

## 📚 API Routes

Currently using static generation. For backend integration:

```typescript
// Example: app/api/membership/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  // Handle membership submission with encryption
}
```

## 🌟 Key Pages

### Home (`/[locale]`)
- Hero section with circuit lion logo
- Four pillars explanation
- Trust and security CTA
- Key features showcase

### Membership (`/[locale]/membership`)
- Pledge stepper (required to accept all four pillars)
- Comprehensive membership form
- Security level selection
- Data protection disclaimer

### Trust Center (`/[locale]/trust`)
- No-logs policy details
- Encryption information
- Security audit details
- Compliance badges and transparency report

## 🛠️ Customization

### Changing Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      // ...
    }
  }
}
```

### Updating Content
Edit translation files:
- `/public/locales/en/common.json` (English)
- `/public/locales/fa/common.json` (Farsi)

### Logo
Replace the `CircuitLionLogo` component in `/components/CircuitLionLogo.tsx`

## 📞 Support & Contact

For questions or contributions, please contact the Iranian Tech Association.

## 📄 License

All rights reserved © 2024 Iranian Tech Association.

---

**Built with ❤️ for Trust, Security, and Transparency**

