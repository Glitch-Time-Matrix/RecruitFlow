import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const app = express();
const PORT = 3000;

// Initialize Gemini Client safely
// It uses process.env.GEMINI_API_KEY. We supply the user-agent header for telemetry as instructed.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Mock active premium roles in our agency
const ACTIVE_JOBS = [
  {
    id: "job-1",
    title: "Lead Product Designer",
    department: "Creative & Design",
    location: "New York, NY / Hybrid",
    salary: "$185,000 - $220,000",
    type: "Full-Time",
    description: "Lead spatial computing UX/UI and our premium cross-platform design systems for a revolutionary developer-tooling scaleup.",
    requirements: ["5+ years experience in product design", "Proven experience with highly interactive design systems", "Proficient in Figma, prototyping, and WebGL or Spatial UX/UI"]
  },
  {
    id: "job-2",
    title: "Senior Machine Learning Engineer",
    department: "Engineering",
    location: "San Francisco, CA / Hybrid",
    salary: "$210,000 - $250,000",
    type: "Full-Time",
    description: "Scale large language models (LLMs) and advanced vector search pipelines. Lead model evaluation and customized alignment techniques.",
    requirements: ["Deep understanding of LLMs, PyTorch, and Transformer architectures", "Experience with vector search (Qdrant, Pinecone) and RAG system optimization", "Strong background in Python and distributed system scalability"]
  },
  {
    id: "job-3",
    title: "Creative Director",
    department: "Executive & Creative",
    location: "London, UK / Hybrid",
    salary: "£120,000 - £150,000",
    type: "Contract-to-Hire",
    description: "Oversee global brand identity, artistic direction for photoshoots, and editorial campaign production for high-fashion clients.",
    requirements: ["Creative direction experience in editorial, fashion, or lifestyle sectors", "Deep visual storytelling, typography pairing, and concept curation expertise", "Strong leadership with active agency-side experience"]
  },
  {
    id: "job-4",
    title: "Principal Frontend Engineer",
    department: "Engineering",
    location: "NYC / Remote",
    salary: "$190,000 - $230,000",
    type: "Full-Time",
    description: "Craft highly performant, custom-engineered user interfaces with sophisticated layout loops, custom canvas rendering, and layout animations.",
    requirements: ["Expert-level React, TypeScript, and modern styling compilers (Tailwind, CSS-in-JS)", "Experience with canvas architectures (Konva, Fabric.js, WebGL) and motion layouts", "Strong eye for typography pairing, spacing grids, and negative space rhythm"]
  },
  {
    id: "job-5",
    title: "VP of Engineering",
    department: "Executive & Engineering",
    location: "New York, NY / Hybrid",
    salary: "$250,000 - $300,000",
    type: "Full-Time",
    description: "Own our technical roadmap, lead scale-to-zero container deployments, and scale an elite team of full-stack and platform engineers.",
    requirements: ["8+ years engineering experience with 3+ years in VP or Director roles", "Proven architecture scaling on GCP/AWS with container architectures", "Empathy-first leadership with a strong history of high team retention and talent development"]
  },
  {
    id: "job-6",
    title: "Lead Full-Stack Developer",
    department: "Engineering",
    location: "Remote (Global)",
    salary: "$160,000 - $195,000",
    type: "Full-Time",
    description: "Own the build pipeline, client-to-server state sync, and implement scalable API route proxy layers.",
    requirements: ["Extensive full-stack TypeScript expertise (Node.js, Express, React, Vite)", "Hands-on experience with modern ORMs and serverless deployments", "Familiarity with lazy SDK integrations, environment configuration, and robust linter setups"]
  },
  {
    id: "job-7",
    title: "Director of Brand Marketing",
    department: "Marketing",
    location: "Los Angeles, CA / Hybrid",
    salary: "$150,000 - $185,000",
    type: "Full-Time",
    description: "Own the brand strategy, editorial identity, social distribution metrics, and curated creator campaigns across cultural hubs.",
    requirements: ["Deep understanding of social-first brand marketing and modern storytelling", "Experience managing multi-channel campaign budgets and editorial output", "Highly analytical with a focus on community density and placement retention"]
  }
];

// In-memory data stores for submitted forms (transient persistence)
const SUBMITTED_CANDIDATES: any[] = [];
const SUBMITTED_HIRING_REQUESTS: any[] = [];
const SUBMITTED_CONTACT_MESSAGES: any[] = [];

app.use(express.json());

// API endpoints
app.get("/api/jobs", (req, res) => {
  res.json({ jobs: ACTIVE_JOBS });
});

// Candidate Registration submission endpoint
app.post("/api/candidates", (req, res) => {
  try {
    const candidateData = req.body;
    if (!candidateData.fullName || !candidateData.email || !candidateData.phone) {
      return res.status(400).json({ error: "Full Name, Email, and Phone are required fields." });
    }
    const registrationId = `CAND-${Date.now().toString(36).toUpperCase()}`;
    const newCandidate = {
      id: registrationId,
      ...candidateData,
      submittedAt: new Date().toISOString()
    };
    SUBMITTED_CANDIDATES.push(newCandidate);
    console.log("New candidate registered:", registrationId, candidateData.fullName);
    res.json({ 
      success: true, 
      registrationId, 
      message: "Candidate profile registered successfully in the agency portal." 
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to process candidate submission." });
  }
});

// Employer Hiring Request submission endpoint
app.post("/api/employers", (req, res) => {
  try {
    const hiringData = req.body;
    if (!hiringData.companyName || !hiringData.contactName || !hiringData.email || !hiringData.jobTitle) {
      return res.status(400).json({ error: "Company Name, Contact Person, Email, and Job Title are required." });
    }
    const requestId = `HIRING-${Date.now().toString(36).toUpperCase()}`;
    const newRequest = {
      id: requestId,
      ...hiringData,
      submittedAt: new Date().toISOString()
    };
    SUBMITTED_HIRING_REQUESTS.push(newRequest);
    console.log("New employer hiring request received:", requestId, hiringData.companyName);
    res.json({ 
      success: true, 
      requestId, 
      message: "Hiring request received. A dedicated recruitment specialist will be assigned." 
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to process hiring request." });
  }
});

// Contact Inquiry submission endpoint
app.post("/api/contact", (req, res) => {
  try {
    const contactData = req.body;
    if (!contactData.fullName || !contactData.email || !contactData.message) {
      return res.status(400).json({ error: "Name, Email, and Message are required." });
    }
    const messageId = `MSG-${Date.now().toString(36).toUpperCase()}`;
    const newMessage = {
      id: messageId,
      ...contactData,
      submittedAt: new Date().toISOString()
    };
    SUBMITTED_CONTACT_MESSAGES.push(newMessage);
    console.log("New contact message received:", messageId, contactData.fullName);
    res.json({ 
      success: true, 
      messageId, 
      message: "Thank you for reaching out to Aura Staffing Agency. We will respond within 24 hours." 
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to submit contact message." });
  }
});

// SECURE Server-side Gemini endpoint for candidate role matching
app.post("/api/match-candidate", async (req, res) => {
  try {
    const { resumeText, targetIndustry, experienceLevel } = req.body;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Candidate resume or experience text is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback if no API key is provided
      console.warn("GEMINI_API_KEY is not configured. Returning deterministic matches.");
      const mockMatches = ACTIVE_JOBS.slice(0, 3).map((job, idx) => ({
        jobId: job.id,
        matchScore: 92 - (idx * 8),
        whyYouMatch: `Based on your impressive experience as a candidate, you demonstrate strong alignment with the requirements for the ${job.title} position, particularly in core systems design and execution.`,
        interviewTips: [
          `Prepare to discuss your past projects that heavily align with ${job.title} expectations.`,
          `Highlight your ability to work inside ${job.department} departments.`,
          `Demonstrate your leadership and technical agility for modern stacks.`
        ]
      }));
      return res.json({ matches: mockMatches });
    }

    // Prepare systemic instructions and context for Gemini
    const systemInstruction = `You are a world-class senior recruitment algorithm and executive talent matcher.
Analyze the candidate's experience text against the list of active job descriptions provided in the prompt.
Determine which jobs match best, and assign a match score from 0 to 100.
Provide a highly tailored, sophisticated 'whyYouMatch' summary of 2-3 sentences explaining exactly why their skills make them a strong candidate or what gaps they might need to address, and write 3 tailored, elite interview preparation questions or tips for them.
Return matches for ONLY the jobs in the active roles list that have a match score above 40. Limit output to at most 4 match objects.`;

    const prompt = `Active jobs to match against:
${JSON.stringify(ACTIVE_JOBS, null, 2)}

Candidate details:
- Experience Level: ${experienceLevel || "Mid-to-Senior"}
- Target Industry: ${targetIndustry || "Technology / Corporate"}
- Candidate's Resume/Skills Summary:
"${resumeText}"

Analyze this candidate and return matches strictly adhering to the JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  jobId: { type: Type.STRING, description: "The matching job's id (e.g. 'job-1', 'job-2')" },
                  matchScore: { type: Type.INTEGER, description: "Match score percentage from 0 to 100" },
                  whyYouMatch: { type: Type.STRING, description: "Personalized explanation of alignment with requirements" },
                  interviewTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 highly tailored interview prep tips or targeted screening questions"
                  }
                },
                required: ["jobId", "matchScore", "whyYouMatch", "interviewTips"]
              }
            }
          },
          required: ["matches"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedResult);
  } catch (error: any) {
    console.error("Error in candidate matching endpoint:", error);
    res.status(500).json({ error: "Failed to perform matching analysis.", details: error.message });
  }
});

// SECURE Server-side Gemini endpoint for employer talent spec generation
app.post("/api/employer-pipeline", async (req, res) => {
  try {
    const { companyName, companySize, targetHireText } = req.body;

    if (!targetHireText || targetHireText.trim().length === 0) {
      return res.status(400).json({ error: "Hiring requirement details are required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not configured. Returning deterministic talent pipeline.");
      return res.json({
        idealTitle: "Principal Systems Designer",
        requiredSkills: ["Figma Spatial Design", "High-Fidelity Prototyping", "Design System Orchestration", "WebGL Rendering"],
        estimatedBaseSalary: "$190,000 - $230,000",
        screeningQuestions: [
          "Describe a time you scaled a comprehensive, multi-platform design token system across dozens of product streams.",
          "How do you approach performance limitations when rendering complex spatial environments in the browser?",
          "How do you balance structural design standards with creative, avant-garde interactions?"
        ],
        sourcingStrategy: "Source directly from top-tier digital product agencies and spatial engineering startups. Prioritize candidates who maintain active visual design portfolios on platforms like Read.cv and Cosmos.",
        marketInsights: "Candidate market density is currently sparse. Average search cycles for this caliber range from 14-25 days. Anticipate strong counteroffers; offering flexible hybrid terms will improve retention rates."
      });
    }

    const systemInstruction = `You are an elite staffing advisor and lead recruiting strategist.
Given an employer's company metadata and their casual target hire description, generate a polished, highly professional Target Candidate Specification and Talent Pipeline Strategy in JSON format.
Ensure the questions, skills, and strategies are incredibly sophisticated, specific, and directly aligned with the employer's words. Make the vocabulary polished, professional, and descriptive.`;

    const prompt = `Employer Metadata:
- Company Name: ${companyName || "Confidential Executive Client"}
- Size: ${companySize || "11-50 employees"}
- What they need:
"${targetHireText}"

Generate candidate specs based on this role.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idealTitle: { type: Type.STRING, description: "Polished, industry-standard title for this specific hiring requirement" },
            requiredSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4-5 highly specific modern skill keywords (e.g. LLM fine-tuning, Spatial UI prototyping)"
            },
            estimatedBaseSalary: { type: Type.STRING, description: "Estimated base salary range in the current market, matching the role seniority" },
            screeningQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 deep, behavioral screening questions tailored precisely to evaluate these skills"
            },
            sourcingStrategy: { type: Type.STRING, description: "A highly tactical, professional 2-sentence plan of where and how to find these candidates" },
            marketInsights: { type: Type.STRING, description: "Brief overview of candidate pool availability, hiring friction, and target cycle times" }
          },
          required: ["idealTitle", "requiredSkills", "estimatedBaseSalary", "screeningQuestions", "sourcingStrategy", "marketInsights"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedResult);
  } catch (error: any) {
    console.error("Error in employer pipeline endpoint:", error);
    res.status(500).json({ error: "Failed to generate recruitment pipeline specifications.", details: error.message });
  }
});

// Vite dev server middleware / Production static assets serve
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
