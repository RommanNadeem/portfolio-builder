// ============================================
// COMPLETE TEST SCRIPT
// Paste this entire file into your Browser Console (F12)
// after logging in with haris15@gmail.com
// ============================================

console.log('🧪 Starting comprehensive test...');

const testPortfolioData = {
  fullName: "John Smith",
  heading: "Hi, I'm John Smith — Global Marketing Manager",
  profession: "Global Marketing Manager",
  email: "john.smith@email.com",
  phone: "+1 (555) 123-4567",
  tagline: "Results-driven marketing executive with extensive experience in global brand management",
  whoAreYou: "Results-driven marketing executive with extensive experience in global brand management and digital marketing strategy. Proven track record of driving revenue growth through innovative campaigns, with expertise in the Oil & Gas industry. Successfully led teams to achieve record-breaking revenue milestones and business expansion.",
  companies: "INTECH Process Automation",
  sliderCompanies: "INTECH Process Automation",
  profileImage: null,
  resume: null,
  
  careerHighlights: [
    {
      id: crypto.randomUUID(),
      organization: "INTECH Process Automation",
      role: "Global Marketing Manager",
      description: "Overall custodian of the INTECH brand reporting directly to CEO. Led global marketing initiatives, brand awareness programs, and digital marketing strategy across multiple territories.",
      startDate: "Jul 2014",
      endDate: "Feb 2019",
      current: false,
      link: "",
      
      achievements: [
        "Led Global Sales Teams in brand awareness programs",
        "Achieved INTECH's Highest Ever revenues (12% growth)",
        "Generated US$ 0.98 million in revenues from digital marketing",
        "Generated quality business leads worth more than US$ 3 million",
        "Achieved organic SEO worth US$ 4,500 per month",
        "Increased revenues for Advance Software Solutions by 165%"
      ],
      
      responsibilities: [
        "Led and supported Global Sales Teams in development and implementation of brand awareness programs",
        "Provided strategic direction for Global Product Management in INTECH's product portfolio",
        "Marketing budget setting and control, including measurement and return on investment",
        "End to end business reporting including bookings, costing and profitability reports",
        "Provided support to regional business units heads for continuous improvement"
      ],
      
      key_achievements: [
        "Achieved INTECH's Highest Ever revenues (12% growth over last year) for 2014-15",
        "Generated US$ 0.98 million in revenues from leads through digital marketing in 2017-18",
        "Generated quality business leads worth more than US$ 3 million",
        "Achieved organic SEO worth US$ 4,500 per month through digital marketing strategy",
        "Increased revenues for Advance Software Solutions by average 165%",
        "Developed Comprehensive Analysis Framework to drive strategic business decisions",
        "Launched Sales Force Effectiveness Improvement initiative"
      ],
      
      impacts: {
        business: [
          {
            value: "$3M",
            metric: "Lead Value Generated",
            description: "Generated quality business leads worth more than US$ 3 million through digital marketing campaigns",
            category: "business"
          },
          {
            value: "$0.98M",
            metric: "Revenue from Digital Marketing",
            description: "Generated bottom-line US$ 0.98 million in revenues from leads through digital marketing in 2017-18",
            category: "business"
          },
          {
            value: "$4,500",
            metric: "Monthly SEO Value",
            description: "Achieved organic SEO worth US$ 4,500 per month through effective digital channels management",
            category: "business"
          }
        ],
        performance: [
          {
            value: "165%",
            metric: "Revenue Increase",
            description: "Increased revenues for Advance Software Solutions product category by an average 165%",
            category: "performance"
          }
        ],
        growth: [
          {
            value: "12%",
            metric: "Revenue Growth",
            description: "Achieved INTECH's Highest Ever revenues with 12% growth over last year for 2014-15",
            category: "growth"
          }
        ],
        quality: [],
        team: [],
        scale: []
      },
      
      companyGroup: "intech process automation",
      companyOccurrence: 1,
      sameCompanyCount: 2,
      hasMultipleRolesAtCompany: true,
      sameCompanyRoles: [
        "Marketing & Business Development Manager"
      ],
      companyTenure: {
        firstStarted: "May 2017",
        lastEnded: "Feb 2019",
        isContinuous: true,
        totalRoles: 2
      }
    },
    
    {
      id: crypto.randomUUID(),
      organization: "INTECH Process Automation",
      role: "Marketing & Business Development Manager",
      description: "Led marketing department while managing business development activities for INTECH's Advance Software Solutions product category.",
      startDate: "May 2017",
      endDate: "Jun 2018",
      current: false,
      link: "",
      
      achievements: [
        "Headed marketing department",
        "Led business development for Advance Software Solutions",
        "Achieved Highest Ever product category revenues"
      ],
      
      responsibilities: [
        "Headed marketing department",
        "Led and managed business development activities for Advance Software Solutions",
        "Set strategic direction for category development"
      ],
      
      key_achievements: [
        "Achieved Highest Ever product category revenues for 2017-18",
        "Surpassed annual revenue target by 25% (57% increase against last year)",
        "Successfully opened new accounts while targeting existing accounts"
      ],
      
      impacts: {
        business: [],
        performance: [],
        growth: [
          {
            value: "57%",
            metric: "Year-over-Year Growth",
            description: "Achieved 57% increase in product category revenues against last year for 2017-18",
            category: "growth"
          },
          {
            value: "25%",
            metric: "Target Exceeded",
            description: "Surpassed annual revenue target by 25% for the year 2017-18",
            category: "growth"
          }
        ],
        quality: [],
        team: [],
        scale: []
      },
      
      companyGroup: "intech process automation",
      companyOccurrence: 2,
      sameCompanyCount: 2,
      hasMultipleRolesAtCompany: true,
      sameCompanyRoles: [
        "Global Marketing Manager"
      ],
      companyTenure: {
        firstStarted: "May 2017",
        lastEnded: "Feb 2019",
        isContinuous: true,
        totalRoles: 2
      }
    }
  ],
  
  socialLinks: [
    {
      id: crypto.randomUUID(),
      platform: "LinkedIn",
      url: "https://linkedin.com/in/johnsmith",
      icon: "linkedin"
    }
  ],
  
  strengths: [],
  projects: [],
  testimonials: [],
  customSections: []
};

// Save to localStorage
localStorage.setItem('portfolioData', JSON.stringify(testPortfolioData));

console.log('✅ Test data loaded successfully!');
console.log('📊 Data summary:');
console.log('  - Career highlights:', testPortfolioData.careerHighlights.length);
console.log('  - First career impacts:', testPortfolioData.careerHighlights[0].impacts);
console.log('  - Impact categories:', Object.keys(testPortfolioData.careerHighlights[0].impacts));
console.log('  - Business impacts count:', testPortfolioData.careerHighlights[0].impacts.business.length);

console.log('\n🔄 Reloading page in 2 seconds...');
console.log('⚠️  WATCH CONSOLE FOR:');
console.log('   1. [Database Debug] Career has impacts to save');
console.log('   2. [Database Debug] Prepared career for upsert: { hasImpacts: true }');

setTimeout(() => {
  location.reload();
}, 2000);

