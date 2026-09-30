# 🛡️ SysFriend — AI Desktop Controller — Deployment Guide

SysFriend is a full-stack, AI-powered Windows Desktop Controller with Groq LLM intelligence, strict whitelist validation, voice commands, and native Windows OS automation.

---

## 🖥️ Mode 1: Local Windows Deployment (Recommended for Full OS Control)

Since SysFriend interacts with native Windows operating system binaries (e.g., launching Chrome, VS Code, Notepad, Paint, controlling volume, locking Windows), running locally gives it full control over your PC.

### Quick 1-Click Launch:
Double-click `start-sysfriend.bat` in this folder or run via PowerShell:
```powershell
.\start-sysfriend.ps1
```
This script automatically:
1. Verifies Node.js installation.
2. Installs dependencies if needed (`npm install`).
3. Starts the backend agent on `http://localhost:3000`.
4. Launches the SysFriend Web Controller in your default browser.

---

### Option 1B: Run as a Persistent Windows Background Service (PM2)
To keep SysFriend running seamlessly in the background on startup:

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   npm install -g pm2-windows-startup
   ```
2. Start the SysFriend service:
   ```bash
   cd desktop-agent
   pm2 start ecosystem.config.js
   ```
3. Save state to auto-launch on Windows boot:
   ```bash
   pm2 save
   pm2-startup install
   ```

---

## ☁️ Mode 2: Cloud / Web Deployment (Demo & Remote Controller Mode)

You can host SysFriend's server and UI on the cloud (Render, Railway, Fly.io, Heroku, Docker).

### Option 2A: Deploy to Render.com (1-Click)
1. Push this folder/repository to GitHub.
2. Go to [dashboard.render.com](https://dashboard.render.com/) -> **New** -> **Web Service**.
3. Connect your repository.
4. Render will automatically detect `render.yaml`:
   - **Build Command**: `cd desktop-agent && npm install`
   - **Start Command**: `cd desktop-agent && node server.js`
5. In **Environment Variables**, add:
   - `GROQ_API_KEY`: `your_groq_api_key_here`
   - `GROQ_MODEL`: `openai/gpt-oss-120b` (or `llama-3.3-70b-versatile`)
6. Click **Create Web Service**. Your SysFriend UI & API will be live on a public HTTPS URL.

### Option 2B: Deploy with Docker
```bash
docker build -t sysfriend-agent .
docker run -p 3000:3000 -e GROQ_API_KEY="your_api_key" sysfriend-agent
```

---

## 🔒 Security Configuration Checklist
- Ensure `GROQ_API_KEY` is kept safe in `.env` and never pushed to public Git branches without `.gitignore`.
- Destructive commands (`SHUTDOWN`, `RESTART`) always trigger the interactive confirmation modal.
- Only whitelisted actions and applications are permitted.
