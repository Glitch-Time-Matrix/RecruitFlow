import { Testimonial, ClientLogo, Job, IndustryInfo, ServiceInfo, FeatureItem, LeadershipMember } from "./types";

export const CLIENT_LOGOS: ClientLogo[] = [
  { name: "Global Health Alliance", symbol: "✚" },
  { name: "Nexus Engineering", symbol: "⚙" },
  { name: "Apex Logistics", symbol: "⬡" },
  { name: "Vertex Financial", symbol: "🏛" },
  { name: "Pinnacle Automotive", symbol: "⚡" },
  { name: "Omni Construction", symbol: "🏗" },
];

export const AGENCY_STATS = [
  { value: "12,500+", label: "Successful Placements", desc: "Across 10 core corporate sectors" },
  { value: "98.4%", label: "90-Day Retention", desc: "Industry-leading candidate stability" },
  { value: "11 Days", label: "Avg. Fill Time", desc: "Rapid shortlist delivery protocol" },
  { value: "450+", label: "Corporate Partners", desc: "Enterprise leaders to scaling SMBs" },
];

export const RECRUITMENT_SERVICES: ServiceInfo[] = [
  {
    id: "permanent",
    title: "Permanent Recruitment",
    tagline: "Long-term leadership & specialized individual contributors",
    description: "End-to-end talent acquisition for high-impact roles. We manage talent mapping, behavioral screening, compensation negotiations, and reference verification to ensure lasting cultural and operational fit.",
    keyBenefits: ["3-Month Placement Guarantee", "Rigorous Multi-stage Vetting", "Direct-Headhunting Sourcing"],
    idealFor: "Core leadership, specialized engineers, department heads, and key staff."
  },
  {
    id: "contract",
    title: "Contract Staffing",
    tagline: "Agile talent solutions for peak cycles & specialized projects",
    description: "Rapid deployment of vetted contractors, interim executives, and project consultants. We handle complete payroll compliance, tax documentation, and contractor management.",
    keyBenefits: ["24-48 Hour Shortlist Turnaround", "Full Legal & Tax Compliance", "Flexible Scaling Options"],
    idealFor: "Project-based initiatives, seasonal surges, maternity covers, and interim leadership."
  },
  {
    id: "executive-search",
    title: "Executive Search",
    tagline: "Confidential C-suite & Board-level leadership acquisition",
    description: "Discreet, retained executive headhunting for Senior Vice Presidents, CXOs, and Board Directors. Utilizing confidential industry benchmarking and direct passive candidate mapping.",
    keyBenefits: ["Strict Executive Confidentiality", "Global Leadership Network", "Comprehensive Reference Audits"],
    idealFor: "Board members, Chief Executive Officers, CTOs, CFOs, and VPs."
  },
  {
    id: "bulk-hiring",
    title: "Bulk & Volume Hiring",
    tagline: "Scalable workforce expansion for new facilities & operations",
    description: "High-volume recruitment drives for expanding logistics hubs, manufacturing plants, contact centers, and healthcare networks without compromising candidate quality.",
    keyBenefits: ["Dedicated On-site Recruiters", "Automated Screening Pipelines", "Custom Orientation Programs"],
    idealFor: "Plant launches, call center expansions, seasonal retail, and warehouse scaling."
  },
  {
    id: "campus-hiring",
    title: "Campus & Graduate Hiring",
    tagline: "Building tomorrow's leadership pipeline from top universities",
    description: "Strategic university placement drives, graduate trainee selection programs, and hackathons to source high-potential entry-level talent and technical graduates.",
    keyBenefits: ["Top Tier University Access", "Aptitude & Technical Testing", "Structured Internship Frameworks"],
    idealFor: "Management trainee programs, entry-level engineering cohorts, and graduate rotations."
  },
  {
    id: "payroll-support",
    title: "Payroll & Compliance Support",
    tagline: "Seamless workforce administration & regulatory compliance",
    description: "Offload administrative burden with our full-service payroll management, benefits administration, statutory compliance, tax withholdings, and labor law advisory.",
    keyBenefits: ["Zero Regulatory Non-Compliance", "Transparent Digital Invoicing", "Dedicated HR Operations Team"],
    idealFor: "Companies seeking to streamline HR operations and reduce overhead liabilities."
  },
  {
    id: "rpo",
    title: "Recruitment Process Outsourcing (RPO)",
    tagline: "Embedded recruitment experts acting as your internal team",
    description: "We integrate our senior recruiters directly into your HR department to manage your complete talent acquisition ecosystem, ATS management, and employer branding.",
    keyBenefits: ["Up to 40% Reduction in Cost-per-Hire", "Scalable Talent Infrastructure", "Standardized Employer Branding"],
    idealFor: "Rapidly growing companies needing a scalable internal talent acquisition arm."
  }
];

export const INDUSTRIES_SERVED: IndustryInfo[] = [
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    iconName: "Activity",
    description: "Credentialed medical practitioners, nursing directors, clinical researchers, bio-tech scientists, and healthcare administrative staff.",
    typicalRoles: ["Medical Director", "Registered Nurses (RN)", "Clinical Data Analyst", "Biotech Lab Specialist", "Hospital Administrator"],
    stats: "3,200+ Healthcare Placements",
    sourcingHighlight: "Strict licensing, credential verification, and background compliance."
  },
  {
    id: "it",
    name: "IT & Software Engineering",
    iconName: "Cpu",
    description: "Senior software architects, cloud infrastructure leads, DevOps engineers, cybersecurity experts, and AI/ML data scientists.",
    typicalRoles: ["Principal Software Engineer", "DevOps Architect", "Cybersecurity Analyst", "Data Engineer", "Product Manager"],
    stats: "4,100+ Tech Placements",
    sourcingHighlight: "Hands-on code evaluation and system design assessment."
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industrial",
    iconName: "Factory",
    description: "Plant managers, quality control engineers, CNC machinists, industrial operations leads, and safety compliance managers.",
    typicalRoles: ["Plant Manager", "Quality Assurance Engineer", "Operations Supervisor", "EHS Safety Manager", "Maintenance Technician"],
    stats: "2,500+ Industrial Placements",
    sourcingHighlight: "ISO standard awareness, OSHA safety certification auditing."
  },
  {
    id: "construction",
    name: "Construction & Real Estate",
    iconName: "Building2",
    description: "Project managers, site superintendents, civil engineers, MEP estimators, and safety directors for commercial and civil projects.",
    typicalRoles: ["Project Superintendent", "Civil Engineer", "Cost Estimator", "Safety Inspector", "Construction Manager"],
    stats: "1,800+ Field Placements",
    sourcingHighlight: "On-site safety audits, project portfolio verification."
  },
  {
    id: "retail",
    name: "Retail & E-Commerce",
    iconName: "ShoppingBag",
    description: "Regional retail directors, store managers, e-commerce growth leads, visual merchandisers, and inventory analysts.",
    typicalRoles: ["Regional Retail Manager", "E-Commerce Director", "Store Manager", "Supply Chain Analyst", "Inventory Planner"],
    stats: "2,100+ Retail Placements",
    sourcingHighlight: "Customer experience scoring & multi-unit leadership evaluation."
  },
  {
    id: "finance",
    name: "Finance & Banking",
    iconName: "Landmark",
    description: "Chartered accountants, financial controllers, investment analysts, compliance officers, and risk management specialists.",
    typicalRoles: ["Financial Controller", "Risk & Compliance Officer", "Senior Accountant", "Treasury Manager", "Financial Analyst"],
    stats: "2,900+ Finance Placements",
    sourcingHighlight: "Rigorous credit checks, background auditing, and regulatory alignment."
  },
  {
    id: "hospitality",
    name: "Hospitality & Food Service",
    iconName: "Utensils",
    description: "General managers, executive chefs, food & beverage directors, guest relations leads, and event coordination directors.",
    typicalRoles: ["Hotel General Manager", "Executive Chef", "F&B Director", "Front Office Manager", "Events Director"],
    stats: "1,400+ Hospitality Placements",
    sourcingHighlight: "Service standard audits and multi-outlet management experience."
  },
  {
    id: "logistics",
    name: "Logistics & Supply Chain",
    iconName: "Truck",
    description: "Warehouse distribution leads, supply chain directors, fleet managers, customs compliance managers, and logistics planners.",
    typicalRoles: ["Supply Chain Director", "Warehouse Operations Manager", "Fleet Supervisor", "Logistics Analyst", "Customs Specialist"],
    stats: "2,700+ Logistics Placements",
    sourcingHighlight: "WMS software mastery and throughput metric verification."
  },
  {
    id: "engineering",
    name: "Engineering & Energy",
    iconName: "Wrench",
    description: "Mechanical engineers, electrical power leads, renewable energy specialists, structural designers, and R&D managers.",
    typicalRoles: ["Lead Mechanical Engineer", "Electrical Systems Engineer", "R&D Project Lead", "Renewable Energy Manager", "Structural Engineer"],
    stats: "1,900+ Engineering Placements",
    sourcingHighlight: "PE license auditing and CAD/3D modeling technical verification."
  },
  {
    id: "automotive",
    name: "Automotive & Mobility",
    iconName: "Car",
    description: "Automotive design engineers, EV powertrain specialists, dealership managers, assembly leads, and vehicle electronics leads.",
    typicalRoles: ["EV Battery Engineer", "Automotive Assembly Supervisor", "Service Center Director", "Embedded Systems Lead", "Quality Control Inspector"],
    stats: "1,200+ Automotive Placements",
    sourcingHighlight: "IATF 16949 standards awareness and mobility tech vetting."
  }
];

export const AGENCY_FEATURES: FeatureItem[] = [
  {
    id: "database",
    title: "Proprietary Candidate Database",
    description: "Over 250,000 pre-vetted professionals across technical, executive, and operational disciplines indexed for instant mapping.",
    metric: "250k+ Active Profiles"
  },
  {
    id: "specialists",
    title: "Dedicated Recruitment Specialists",
    description: "Domain-expert recruiters with hands-on industry background who speak your language and understand niche technical requirements.",
    metric: "Dedicated Account Managers"
  },
  {
    id: "expertise",
    title: "Deep Industry Expertise",
    description: "Specialized vertical practices in Healthcare, IT, Manufacturing, Finance, and Logistics with deep market intelligence.",
    metric: "10 Vertical Practices"
  },
  {
    id: "speed",
    title: "Fast Fill Cycles",
    description: "Our structured pipeline delivers pre-screened, interview-ready candidate shortlists within 48 to 72 hours.",
    metric: "Shortlist in 48 Hours"
  },
  {
    id: "screening",
    title: "Quality 5-Point Screening",
    description: "Every candidate undergoes background checks, technical skill assessment, behavioral evaluation, reference audits, and cultural fit mapping.",
    metric: "100% Vetted Quality"
  },
  {
    id: "executive",
    title: "Confidential Executive Search",
    description: "Discreet headhunting protocols for sensitive C-level replacements and confidential corporate expansions.",
    metric: "Strict NDA Protection"
  },
  {
    id: "support",
    title: "Dedicated Client Support",
    description: "End-to-end assistance from initial spec drafting to post-placement onboarding check-ins and performance reviews.",
    metric: "24/7 Response Time"
  },
  {
    id: "network",
    title: "Global Talent Network",
    description: "Access to remote experts and relocation-ready leaders across North America, Europe, Asia-Pacific, and Latin America.",
    metric: "40+ Global Markets"
  }
];

export const RECRUITMENT_PROCESS = [
  {
    step: "01",
    title: "Requirement Mapping & Consultation",
    description: "We meet with your team to dissect job specs, team dynamics, compensation bands, and exact technical/cultural criteria."
  },
  {
    step: "02",
    title: "Targeted Headhunting & Vetting",
    description: "Our sector specialists tap into passive candidate networks, performing rigorous 5-point skill, reference, and background screenings."
  },
  {
    step: "03",
    title: "Shortlist Presentation & Interviewing",
    description: "You receive 3-5 perfectly aligned candidate profiles complete with detailed evaluation notes, scheduling all interview rounds seamlessly."
  },
  {
    step: "04",
    title: "Offer Negotiation & Onboarding Assurance",
    description: "We manage compensation alignment, formal offers, resignation counseling, and 90-day post-placement performance check-ins."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Sarah Jenkins",
    role: "VP of Human Resources",
    company: "Apex Healthcare System",
    category: "HR Partner",
    quote: "RecruitFlow replaced our chaotic manual recruitment process with sheer precision. They filled 14 specialized clinical director positions across three regional facilities in under three weeks, with zero attrition.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "test-2",
    name: "David Sterling",
    role: "Chief Operating Officer",
    company: "Nexus Industrial Group",
    category: "Employer",
    quote: "When we needed a new Operations Director for our manufacturing plant, RecruitFlow conducted a confidential search and delivered three pristine executive candidates within 5 days. The candidate we hired has transformed our throughput.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "test-3",
    name: "Dr. Michael Chen",
    role: "Senior Director of R&D",
    company: "Vanguard Life Sciences",
    category: "Candidate",
    quote: "As a senior candidate, working with RecruitFlow felt completely different from typical headhunters. They respected my confidential job search, negotiated my target compensation seamlessly, and matched me with an exceptional organization.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "test-4",
    name: "Amanda Vance",
    role: "Head of Talent Acquisition",
    company: "Pinnacle Logistics",
    category: "HR Partner",
    quote: "During our seasonal distribution surge, RecruitFlow provided 85 vetted contract warehouse leads and shift supervisors with complete payroll administration. Their team is our most trusted staffing partner.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80",
  }
];

export const LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    name: "Robert Vance",
    role: "Founder & Chief Executive Officer",
    bio: "Over 20 years in executive search and corporate workforce strategy, having scaled staffing operations across Fortune 500 enterprises.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    name: "Victoria Sterling",
    role: "Managing Director - Executive Search",
    bio: "Former HR Director specializing in confidential C-suite placements and board-level talent acquisition across Finance and Healthcare.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    name: "Marcus Thorne",
    role: "Head of Technical & Engineering Staffing",
    bio: "12+ years matching senior software architects, industrial engineers, and operational leadership across global markets.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80"
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Director of Clinical Operations",
    department: "Healthcare & Life Sciences",
    location: "New York, NY / On-site",
    salary: "$175,000 - $210,000",
    type: "Full-Time",
    description: "Oversee multi-site clinical operations, staff scheduling, patient compliance, and budgetary management for a premier regional hospital network.",
    requirements: ["10+ years in healthcare management", "Active BSN or MHA degree", "Proven experience scaling multi-specialty clinical departments"]
  },
  {
    id: "job-2",
    title: "Senior Plant Operations Manager",
    department: "Manufacturing & Industrial",
    location: "Chicago, IL / On-site",
    salary: "$145,000 - $180,000",
    type: "Full-Time",
    description: "Lead 200+ facility staff, manage lean manufacturing protocols, ensure OSHA compliance, and optimize supply chain throughput.",
    requirements: ["7+ years plant leadership in high-volume manufacturing", "Six Sigma Black Belt certification preferred", "Strong safety and regulatory compliance record"]
  },
  {
    id: "job-3",
    title: "Principal Cloud Architect",
    department: "IT & Software Engineering",
    location: "San Francisco, CA / Hybrid",
    salary: "$195,000 - $240,000",
    type: "Full-Time",
    description: "Architect secure multi-cloud environments (AWS/GCP), lead Kubernetes cluster deployments, and enforce zero-trust security standards.",
    requirements: ["8+ years cloud engineering experience", "AWS Solutions Architect Professional or GCP Cloud Architect certified", "Deep expertise in Terraform and containerization"]
  },
  {
    id: "job-4",
    title: "Senior Financial Controller",
    department: "Finance & Banking",
    location: "London, UK / Hybrid",
    salary: "£110,000 - £135,000",
    type: "Full-Time",
    description: "Manage financial reporting, statutory audits, cash flow forecasting, and tax strategy for an expanding commercial enterprise.",
    requirements: ["CPA or ACA qualification required", "6+ years in corporate finance controller roles", "Expertise in IFRS standards and ERP implementations"]
  },
  {
    id: "job-5",
    title: "Senior Construction Superintendent",
    department: "Construction & Real Estate",
    location: "Austin, TX / On-site",
    salary: "$130,000 - $165,000",
    type: "Full-Time",
    description: "Direct daily on-site commercial building construction, subcontractor coordination, schedule enforcement, and site safety management.",
    requirements: ["8+ years managing $20M+ commercial build projects", "OSHA 30-Hour certification", "Deep blueprint and MEP specification mastery"]
  },
  {
    id: "job-6",
    title: "Supply Chain & Logistics Director",
    department: "Logistics & Supply Chain",
    location: "Atlanta, GA / Hybrid",
    salary: "$160,000 - $190,000",
    type: "Full-Time",
    description: "Optimize nationwide distribution center logistics, fleet route planning, vendor contract negotiations, and warehouse management systems.",
    requirements: ["10+ years executive supply chain experience", "Proven ERP/WMS implementation success", "Strong background in cold-chain or high-volume freight"]
  },
  {
    id: "job-7",
    title: "EV Powertrain Lead Engineer",
    department: "Automotive & Mobility",
    location: "Detroit, MI / Hybrid",
    salary: "$150,000 - $185,000",
    type: "Full-Time",
    description: "Drive battery management system (BMS) integration, electric motor thermal design, and vehicle power electronics testing.",
    requirements: ["BS or MS in Electrical/Mechanical Engineering", "5+ years in EV motor or battery development", "Proficiency in MATLAB/Simulink and CAN bus protocols"]
  },
  {
    id: "job-8",
    title: "Regional HR Director",
    department: "Corporate & Human Resources",
    location: "Boston, MA / Hybrid",
    salary: "$140,000 - $170,000",
    type: "Full-Time",
    description: "Oversee employee relations, talent acquisition strategy, benefits administration, and labor law compliance for 1,200+ regional employees.",
    requirements: ["SHRM-SCP or SPHR certification", "8+ years progressive HR management experience", "Strong track record in union relations and retention"]
  }
];

