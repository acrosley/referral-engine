# Referral Engine Project Summary

## 🎯 Project Overview

**Project Name**: Crosley Law Group Referral Engine  
**Technology Stack**: Next.js 14, Neon Database, TypeScript, Tailwind CSS  
**Status**: ✅ Development Ready  
**Last Updated**: October 15, 2025  

## 📁 Project Structure

```
referral-engine/
├── landing-page/                 # Main Next.js application
│   ├── app/                     # Next.js App Router
│   │   ├── api/intake/          # API routes for form submissions
│   │   ├── intake/             # Intake form page
│   │   ├── neon-demo/          # Neon database demo page
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components
│   │   ├── Hero.tsx           # Landing page hero section
│   │   ├── IntakeForm.tsx     # Main referral form
│   │   └── Disclaimer.tsx    # Legal disclaimer
│   ├── lib/                   # Utility libraries
│   │   ├── db.ts             # Database service (Neon)
│   │   ├── notifications.ts  # Email notifications
│   │   ├── scoring.ts        # AI scoring logic
│   │   └── validation.ts     # Form validation
│   ├── scripts/              # Database setup scripts
│   │   ├── neon-setup.sql    # Database schema
│   │   └── test-neon-connection.ts
│   └── package.json          # Dependencies
├── financial_sensitivity_model.py  # AI scoring model
└── README.md
```

## 🗄️ Database Architecture

### **Neon Database Integration**
- **Provider**: Neon (serverless PostgreSQL)
- **Connection**: `@neondatabase/serverless` driver
- **Environment**: `DATABASE_URL` in `.env.local`

### **Database Tables**

#### `case_submissions`
Primary table for storing referral submissions:
- Personal information (name, email, phone)
- Incident details (type, date, location, description)
- Medical information (treatment, hospitalization)
- Insurance and attorney status
- AI scoring and grading
- Assignment tracking

#### `partner_firms`
Law firm partner information:
- Contact details
- Specialties and capabilities
- Acceptance criteria
- Referral fee structure

#### `comments`
Simple demo table for testing Neon integration.

## 🔧 Technical Implementation

### **Database Service (`lib/db.ts`)**
```typescript
// Neon serverless driver integration
import { neon } from '@neondatabase/serverless';

export class DatabaseService {
  private static getSql() {
    return neon(process.env.DATABASE_URL!);
  }
  
  // CRUD operations for submissions
  // Partner firm management
  // Analytics and reporting
}
```

### **Key Features**
- ✅ **Serverless Database**: Auto-scaling Neon PostgreSQL
- ✅ **Form Validation**: Zod schema validation
- ✅ **Email Notifications**: SMTP integration (Outlook)
- ✅ **AI Scoring**: Financial sensitivity model
- ✅ **Partner Assignment**: Automated firm matching
- ✅ **Analytics**: KPI tracking and reporting

## 🚀 Development Setup

### **Prerequisites**
- Node.js v22.20.0
- Neon database account
- SMTP email configuration

### **Environment Variables**
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Email (Outlook)
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-app-password
SMTP_FROM=referrals@crosleylawgroup.com

# Application
NEXT_PUBLIC_APP_URL=https://acrosley-referral-engine.vercel.app
```

### **Installation Steps**
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Up Database**:
   - Run `scripts/neon-setup.sql` in Neon Console
   - Test connection: `npx tsx scripts/test-neon-connection.ts`

3. **Start Development**:
   ```bash
   npm run dev
   ```

## 📊 Workflow Process

### **1. Lead Capture**
- User visits landing page
- Fills out intake form
- Form validation and submission

### **2. AI Processing**
- Financial sensitivity scoring
- Keeper grade assignment (A, B, C, D)
- Automated qualification assessment

### **3. Partner Assignment**
- Match qualified cases to partner firms
- Consider specialties and capacity
- Calculate referral fees

### **4. Notification System**
- Email confirmations to clients
- Partner firm notifications
- Admin dashboard updates

## 🎨 User Interface

### **Landing Page**
- Professional hero section
- Clear value proposition
- Trust indicators and testimonials

### **Intake Form**
- Multi-step form with progress indicator
- Real-time validation
- Mobile-responsive design

### **Demo Page** (`/neon-demo`)
- Simple comment form
- Tests Neon database integration
- Development and testing tool

## 📈 Analytics & Reporting

### **Key Performance Indicators**
- Total submissions
- Qualified submissions (A/B grades)
- Assignment success rate
- Average AI scores
- Grade distribution

### **Admin Dashboard**
- Recent submissions view
- Status tracking
- Partner firm management
- Performance metrics

## 🔒 Security & Compliance

### **Data Protection**
- Secure database connections (SSL)
- Environment variable management
- Input validation and sanitization

### **Legal Compliance**
- Privacy policy integration
- Terms of service
- Data retention policies

## 🚀 Deployment

### **Vercel Integration**
- Automatic deployments from Git
- Environment variable management
- Domain configuration

### **Production Checklist**
- [ ] Database tables created
- [ ] Environment variables set
- [ ] Email configuration tested
- [ ] SSL certificates configured
- [ ] Domain DNS configured

## 📋 Current Status

### **✅ Completed**
- Neon database integration
- Form validation system
- Email notification setup
- AI scoring implementation
- Partner assignment logic
- Development environment

### **🔄 In Progress**
- Database table setup
- Email configuration
- Production deployment

### **📝 Next Steps**
1. Complete database setup in Neon Console
2. Configure production email settings
3. Deploy to Vercel
4. Test end-to-end workflow
5. Set up monitoring and analytics

## 🛠️ Troubleshooting

### **Common Issues**
1. **Node.js not found**: Add to PATH or restart terminal
2. **Database connection failed**: Check DATABASE_URL and Neon Console
3. **Email not sending**: Verify SMTP credentials
4. **Tables missing**: Run neon-setup.sql script

### **Development Commands**
```bash
# Start development server
npm run dev

# Test database connection
npx tsx scripts/test-neon-connection.ts

# Build for production
npm run build

# Run linting
npm run lint
```

## 📞 Support & Resources

### **Documentation**
- [Neon Setup Guide](landing-page/NEON_SETUP.md)
- [Integration Documentation](landing-page/INTEGRATION.md)
- [Deployment Guide](landing-page/DEPLOYMENT.md)

### **External Resources**
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

**Project Maintainer**: Andrew Crosley  
**Last Updated**: October 15, 2025  
**Version**: 1.0.0  
