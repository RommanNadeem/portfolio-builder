// ============================================
// TEST SCRIPT - Use Exact Backend Data Format
// Copy and paste this entire script into Browser Console (F12)
// ============================================

console.log('🧪 Starting test with exact backend data format...');

const testData = {
  fullName: "John Smith",
  profession: "Global Marketing Manager",
  email: "john.smith@email.com",
  phone: "+1 (555) 123-4567",
  tagline: "Results-driven marketing executive with extensive experience",
  whoAreYou: "Results-driven marketing executive with extensive experience in global brand management and digital marketing strategy. Proven track record of driving revenue growth through innovative campaigns, with expertise in the Oil & Gas industry.",
  companies: "INTECH Process Automation",
  sliderCompanies: "INTECH Process Automation",
  profileImage: null,
  resume: null,
  
  careerHighlights: [
    {
      id: crypto.randomUUID(),
      organization: "INTECH Process Automation",
      role: "Global Marketing Manager",
      description: "Overall custodian of the INTECH brand reporting directly to CEO. Led global marketing initiatives, brand awareness programs, and digital marketing strategy.",
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
        "Provided strategic direction for Global Product Management",
        "Marketing budget setting and control"
      ],
      
      key_achievements: [
        "Achieved INTECH's Highest Ever revenues (12% growth over last year) for 2014-15",
        "Generated US$ 0.98 million in revenues from leads through digital marketing in 2017-18",
        "Generated quality business leads worth more than US$ 3 million",
        "Achieved organic SEO worth US$ 4,500 per month",
        "Increased revenues for Advance Software Solutions by average 165%"
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

// Save to localStorage
localStorage.setItem('portfolioData', JSON.stringify(testData));
console.log('✅ Test data saved to localStorage');

// Verify impacts are in the data
console.log('📊 Checking impacts in data:');
console.log('  Has impacts:', !!testData.careerHighlights[0].impacts);
console.log('  Impact categories:', Object.keys(testData.careerHighlights[0].impacts));
console.log('  Business impacts:', testData.careerHighlights[0].impacts.business.length);
console.log('  Full impacts:', testData.careerHighlights[0].impacts);

// Reload page to trigger editor load
console.log('🔄 Reloading page in 2 seconds...');
console.log('⚠️  WATCH CONSOLE for database save logs after reload!');

setTimeout(() => {
  location.reload();
}, 2000);

