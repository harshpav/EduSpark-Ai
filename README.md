# ⚡ EduSpark AI

> **10 AI-powered tools for students** — built with HTML, CSS, JavaScript & Google Gemini API

## 🌐 Live Website

### 👉 [https://harshpav.github.io/EduSpark-Ai](https://harshpav.github.io/EduSpark-Ai)

> Click the link above to open the website directly. No installation needed.

---

## 🚀 How to Use

1. Open the live link above
2. Enter your **Gemini API Key** in the popup *(get one free from [Google AI Studio](https://aistudio.google.com/app/apikey))*
3. Choose any tool and start using!

> 🔒 **Your API key is never stored in code or any file.** It stays only in your browser memory for that session.

---

## 🛠️ 10 Tools Included

| # | Tool | What it does |
|---|------|-------------|
| 1 | 📄 AI Resume Builder | Fill your details → get a professional resume + PDF download |
| 2 | 📝 AI Notes Generator | Paste any text → get structured bullet-point study notes |
| 3 | 📊 AI PPT Generator | Enter a topic → get slide-wise content with navigation |
| 4 | 🧠 AI Mind Map Generator | Paste syllabus → visualize as interactive mind map |
| 5 | 📋 Google Sheets Backend | Use Google Sheets as live database with AI insights |
| 6 | ❓ AI Quiz / MCQ Generator | Enter topic → get interactive quiz with instant scoring |
| 7 | 💬 AI Doubt-Solving Chatbot | Ask any subject doubt → get simple AI explanation |
| 8 | 🃏 AI Flashcard Generator | Paste notes → get flippable revision flashcards |
| 9 | 📅 AI Study Planner | Add subjects + hours → get a day-wise timetable |
| 10 | 📷 AI Notes Summarizer (OCR) | Upload photo of notes → extract text → AI summary |

---

## 🔑 API Key — Security Concept

Sir's requirement was: **"API key should not be in the code."**

✅ How we implemented it:
- No API key anywhere in source code
- User enters their own key at runtime via a popup
- Key is stored in `sessionStorage` (browser memory only)
- When browser tab closes → key is automatically deleted
- Code can be shared publicly on GitHub with zero security risk

---

## 🏗️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **AI:** Google Gemini API (`gemini-3.8-flash`)
- **OCR:** Tesseract.js (in-browser)
- **Markdown:** marked.js
- **PDF:** jsPDF
- **Hosting:** GitHub Pages (free)

---

## 📁 Project Structure

```
ai-classroom/
├── index.html              ← Homepage with all 10 tool cards
├── styles.css              ← Shared dark theme styles
├── app.js                  ← API key manager + Gemini helper
└── pages/
    ├── resume-builder.html
    ├── notes-generator.html
    ├── ppt-generator.html
    ├── mind-map.html
    ├── sheets-backend.html
    ├── quiz-generator.html
    ├── chatbot.html
    ├── flashcards.html
    ├── study-planner.html
    └── ocr-summarizer.html
```

---

## 👨‍💻 Made for

In-Class AI Assignment — Building AI-powered websites using Gemini API
