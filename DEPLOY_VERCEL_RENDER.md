# 🌐 Vercel (Frontend) & Render (Backend) Deployment Guide

This guide walks you through deploying **SysFriend (ADC)** with the **React Frontend on Vercel** and the **Node.js Express Backend on Render.com**.

---

## 🏗️ Architecture Overview

```
 [ Vercel (React Frontend) ]
   https://sysfriend.vercel.app
          │
          │ HTTPS / CORS API Requests
          ▼
 [ Render.com (Node.js Express Backend) ]
   https://sysfriend-agent.onrender.com
          │
          ├── Groq LLM (openai/gpt-oss-120b)
          ├── Whitelist Validator
          └── Desktop API Executor
```

---

## 🚀 Step 1: Deploy Backend to Render.com

1. Push your repository to **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Fill in the service configuration:
   - **Name**: `sysfriend-agent`
   - **Root Directory**: `ADC_Chatbot/ADC-Assignment-11` (or `ADC_Chatbot/ADC-Assignment-11/desktop-agent`)
   - **Environment**: `Node`
   - **Build Command**: `cd desktop-agent && npm install`
   - **Start Command**: `cd desktop-agent && node server.js`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `GROQ_API_KEY`: `your_groq_api_key_here`
   - `GROQ_MODEL`: `openai/gpt-oss-120b` (or `llama-3.3-70b-versatile`)
   - `PORT`: `10000` (or leave default)
6. Click **Create Web Service**.
7. Once deployed, copy your Render URL (e.g., `https://sysfriend-agent.onrender.com`).
8. Test the health endpoint: `https://sysfriend-agent.onrender.com/api/health` — it will return:
   ```json
   { "success": true, "status": "online", "service": "SysFriend Desktop Agent" }
   ```

---

## ⚡ Step 2: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Web Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import your GitHub repository.
3. In the project setup:
   - **Project Name**: `sysfriend-react-ui`
   - **Framework Preset**: `Other`
   - **Root Directory**: Click **Edit** and select:
     `ADC_Chatbot/ADC-Assignment-11/desktop-ui`
4. Click **Deploy**.
5. Your React frontend is live at `https://sysfriend-react-ui.vercel.app`!

### Option B: Deploy via Vercel CLI
```bash
cd "ADC_Chatbot/ADC-Assignment-11/desktop-ui"
npx vercel
# Follow prompts -> select production deployment
```

---

## 🔗 Step 3: Connect Vercel Frontend to Render Backend

1. Open your live Vercel URL (e.g., `https://sysfriend-react-ui.vercel.app`).
2. In the top bar, click the **"⚙️ Local API" / "Render API"** pill button.
3. Paste your Render backend URL:
   ```
   https://sysfriend-agent.onrender.com
   ```
4. Click **Save Endpoint**.
5. The status dot will turn **Green (Connected)** and you can now speak or type commands from anywhere!

---

## 🛡️ CORS & Security
- The backend in `desktop-agent/server.js` has permissive CORS headers enabled (`origin: "*"`), allowing seamless requests from any Vercel domain.
- The `GROQ_API_KEY` is securely stored on Render and **never** exposed to the frontend browser.
