# NYAYAAI (நியாயாAI / न्यायAI / న్యాయAI)
> *"Understand your legal problem. Know your next step."*

An AI-powered multilingual legal information and legal-access assistant engineered specifically for India.

---

## 1. Project Overview

In India, navigating civil legal disputes (rental security deposits, unpaid employee wages, consumer grievances, digital financial fraud) is often fraught with intimidation, complex legalese, and lack of awareness of statutory protections like Free Legal Aid under the **Legal Services Authorities Act, 1987**.

**NYAYAAI** bridges this justice gap by translating everyday citizen grievances into clear, actionable procedural pathways:
- **No Legalese:** Express your issue naturally via text or voice in English, Tamil (தமிழ்), Telugu (తెలుగు), or Hindi (हिंदी).
- **Zero Paid Dependencies:** Runs out-of-the-box on free-tier Google Gemini API or an offline, high-fidelity `MockProvider`.
- **Anti-Hallucination Source Backing:** Cites exclusively verified official portals (NALSA, State Legal Services Authorities, eCourts, Consumer Commissions, Tenancy Acts).
- **Deterministic Urgency Scanner:** Identifies domestic violence, police intimidation, illegal eviction, or limitation deadlines before standard AI analysis, routing immediately to emergency helplines (112, 181, 15100).
- **1-Click Judge Demo Mode:** Instantly pre-loads an end-to-end Chennai rental deposit dispute, allowing hackathon judges and evaluators to review the entire 10-step flow in under 3 minutes.

---

## 2. End-to-End Workflow

```
USER PROBLEM (Text/Voice/File)
  │
  ▼
DISCLAIMER & CIVIC ADVISORY
  │
  ▼
DETERMINISTIC URGENCY FILTER (riskDetectionService.ts)
  ├── High / Critical ──► IMMEDIATE SAFETY ESCALATION (112, 181, 15100, 1930)
  └── Low / Medium
        │
        ▼
ADAPTIVE QUESTIONS (Progressive 1-by-1 Inquiry with Legal Explanations)
  │
  ▼
ISSUE CLASSIFICATION (Calibrated Uncertainty Language)
  │
  ▼
SIMPLE EXPLANATION (Plain language + Key Legal Concepts + Limitations)
  │
  ▼
SOURCE-BACKED INFORMATION (Verified Official Government Badges)
  │
  ▼
EVIDENCE ORGANIZER & TIMELINE (Bento Cards + User Verification Toggle)
  │
  ▼
PROCEDURAL ACTION PLAN (User Action / Evidence / Source / Escalation)
  │
  ▼
DOCUMENT GENERATOR STUDIO (6 Templates + Pre-flight Checklist + Watermarked PDF)
  │
  ▼
LEGAL HELP FINDER (NALSA 15100, DLSA, Directions, Call Desks)
```

---

## 3. Technology Stack

- **Frontend:**
  - React 18 & TypeScript
  - Vite 6
  - Tailwind CSS (Configured verbatim to Stitch Civic Design System tokens)
  - React Router 7
  - Lucide React & Google Material Symbols Outlined
  - Web Speech API (Voice input in English, Tamil, Telugu, Hindi)
  - SpeechSynthesis API (Text-to-speech audio reader)
  - jsPDF (Client-side professional watermarked PDF generation)
- **Backend:**
  - Node.js (v20+) & Express
  - TypeScript
  - Multer (Safe in-memory document ingestion)
  - pdf-parse (Document text extraction)
- **Data & AI Layer:**
  - Database: MongoDB with automatic, resilient local file-backed JSON store fallback (`server/data/store.json`). Zero external daemon setup required!
  - AI Engine: `AIProvider` abstraction with `GeminiProvider` (Free tier Google Gemini API) and `MockProvider` (Offline demo mode).

---

## 4. Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1-Step Quick Install
```bash
# Clone or enter repository directory
cd "d:/Ai assistance"

# Install dependencies for root, server, and client
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

---

## 5. Environment Variables

Create a `.env` file in `/server` or at the repository root based on `.env.example`:

```env
# Google Gemini API Key (Free tier: https://aistudio.google.com/)
# If omitted, the application automatically runs in Mock AI Mode with full realistic data!
GEMINI_API_KEY=

# Set to true to force Mock AI Mode even if a key is provided
MOCK_AI=false

# Port for Backend Server
PORT=5000

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Optional: MongoDB URI (If MongoDB is not running, automatic local JSON fallback is activated!)
MONGODB_URI=mongodb://localhost:27017/nyayaai
```

---

## 6. How to Run Locally

### Start Both Client & Server Concurrently:
```bash
npm run dev
```

Or run individually:
- **Backend Server:** `npm run dev:server` (Runs on `http://localhost:5000`)
- **Frontend Client:** `npm run dev:client` (Runs on `http://localhost:5173`)

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 7. Judge Demo Mode (Under 3 Minutes Evaluation)

1. Open [http://localhost:5173](http://localhost:5173).
2. Click the prominent **"Try Demo (Judge Mode)"** button in the header or hero banner.
3. The platform instantly hydrates a realistic, documented tenant security deposit dispute in Chennai, Tamil Nadu:
   - **Problem Intake:** Vacated 2BHK flat; ₹60,000 deposit withheld for 3 months without repair bills.
   - **Adaptive Answers:** 7 confirmed points (unregistered agreement, IMPS bank slip, WhatsApp vacating notice).
   - **Analysis & Legal Explanation:** Plain-language synthesis with statutory limitations under the TNRRRLT Act, 2017.
   - **Verified Sources:** Badges for Tamil Nadu Tenancy framework and NALSA Free Legal Aid.
   - **Evidence Vault:** Filter by documents, IMPS vouchers, WhatsApp chat export, and move-out photos with user verification toggles.
   - **Suggested Action Plan:** 5-step procedural pathway with 15-day statutory grace counter.
   - **Notice Drafter:** Interactive pre-flight review checklist and formal PDF export with watermarked headers.
   - **Official Legal Help:** Direct contact details for Chennai DLSA (High Court Campus) and NALSA 15100.

---

## 8. Privacy & Data Sovereignty

- **Minimal Data Footprint:** Operates completely without mandatory accounts or tracking.
- **Zero Document Model Training:** Uploaded legal files and agreements are never retained for model retraining.
- **Citizen Export & Purge:** Users can download their complete dossier as open JSON or permanently delete all records via the **Privacy** dashboard with one click.
- **Safe In-Memory Document Ingestion:** Documents are parsed transiently without unauthorized disk caching.

---

## 9. Ethical Legal UX & Disclaimers

NyayaAI is built strictly adhering to ethical civic legal tech principles:
1. **Never outputs definitive legal liability:** We never state *"Your landlord definitely broke the law"* or *"You will win"*. Instead, calibrated uncertainty language is used: *"This situation may involve..."*, *"Based on the information provided..."*, *"One possible issue is..."*.
2. **Never invents citations, laws, or court dates:** Sources must match verified official government datasets. If unavailable, it clearly states *"Verified source unavailable for this point"*.
3. **No automatic notice dispatch:** Citizens retain 100% manual control over reviewing, signing, and posting notices.
4. **Statutory Limitation Notice:** When statutory deadlines are mentioned, citizens are explicitly advised: *"Deadline not verified — check official source or consult a qualified professional."*
5. **Advocates Act Advisory:** NyayaAI provides general legal information and pre-litigation documentation assistance; it does not replace formal counsel or advocate representation under the Advocates Act, 1961.

---

## 10. License

MIT License. Designed with civic pride for the Citizens of India.
