// ============================================
// LOAD TEST DATA AND TRIGGER SAVE
// 
// Instructions:
// 1. Login to your app with haris15@gmail.com / 12345678
// 2. Go to /editor
// 3. Press F12 to open console
// 4. Paste this ENTIRE script
// 5. Press Enter
// 6. Wait for the page to reload
// 7. After reload, wait 3 seconds for auto-save
// ============================================

console.log('🚀 Starting test data load...');

// Step 1: Load test data with specific UUID
const testData = {
  fullName: "John Smith",
  heading: "Hi, I'm John Smith — Global Marketing Manager",
  profession: "Global Marketing Manager",
  email: "john.smith@email.com",
  phone: "+1 (555) 123-4567",
  tagline: "Results-driven marketing executive with extensive experience",
  whoAreYou: "Results-driven marketing executive with extensive experience in global brand management and digital marketing strategy.",
  companies: "INTECH Process Automation",
  sliderCompanies: "INTECH Process Automation",
  profileImage: null,
  resume: null,
  
  careerHighlights: [
    {
      id: '0599ee92-a9e5-4cfe-851f-c929173c0f08',  // Your specific UUID
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
        "Generated US$ 0.98 million in revenues from digital marketing"
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

// Step 2: Save to localStorage
localStorage.setItem('portfolioData', JSON.stringify(testData));

console.log('✅ Test data saved to localStorage!');
console.log('\n📊 Data Summary:');
console.log('  - Career ID:', testData.careerHighlights[0].id);
console.log('  - Organization:', testData.careerHighlights[0].organization);
console.log('  - Has impacts:', !!testData.careerHighlights[0].impacts);
console.log('  - Impact categories:', Object.keys(testData.careerHighlights[0].impacts));
console.log('  - Business impacts:', testData.careerHighlights[0].impacts.business.length);
console.log('  - Performance impacts:', testData.careerHighlights[0].impacts.performance.length);
console.log('  - Growth impacts:', testData.careerHighlights[0].impacts.growth.length);
console.log('  - Total impacts:', 
  testData.careerHighlights[0].impacts.business.length +
  testData.careerHighlights[0].impacts.performance.length +
  testData.careerHighlights[0].impacts.growth.length
);

console.log('\n🔄 Reloading page in 2 seconds...');
console.log('\n⚠️  AFTER RELOAD - WATCH FOR THESE LOGS:');
console.log('   1. [Database Debug] Career has impacts to save');
console.log('   2. [Database Debug] Prepared career for upsert: { hasImpacts: true }');
console.log('   3. [Database Debug] Career highlights upsert result');
console.log('\n   Wait 3 seconds after reload for auto-save to trigger!');

// Step 3: Reload to trigger save
setTimeout(() => {
  location.reload();
}, 2000);

