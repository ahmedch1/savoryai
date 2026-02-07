# 🍽️ SavoryAI

AI-powered food recommendation system with a modern React web interface and FastAPI backend.  
Uses vector similarity search (ChromaDB) and an optional local LLM (Ollama) for natural-language food advice — **completely free, no API keys required**.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Semantic Food Search** | Find foods by meaning, not just keywords — "something light and healthy" works |
| **Cuisine & Calorie Filters** | Narrow results by cuisine type and maximum calories |
| **AI Chat (RAG)** | Ask food questions in natural language; answers are grounded in the dataset |
| **Professional Web UI** | Dark-themed React interface with animations, score badges & responsive layout |
| **100 % Local** | Runs entirely on your machine — no cloud, no API keys, no cost |

---

## 🏗️ Architecture

```
┌──────────────────┐        HTTP        ┌──────────────────────┐
│  React Frontend  │  ◄──────────────►  │  FastAPI Backend      │
│  (Vite · :5174)  │   JSON REST API    │  (Uvicorn · :8000)    │
└──────────────────┘                    └──────────┬───────────┘
                                                   │
                                        ┌──────────▼───────────┐
                                        │  shared_functions.py  │
                                        │  ChromaDB + Embeddings│
                                        └──────────┬───────────┘
                                                   │
                                     ┌─────────────▼──────────────┐
                                     │  FoodDataSet.json (185 items)│
                                     └─────────────┬──────────────┘
                                                   │ (optional)
                                          ┌────────▼────────┐
                                          │  Ollama / Mistral│
                                          │  Local LLM       │
                                          └─────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** and **pip**
- **Node.js 18+** and **npm**
- (Optional) **Ollama** — for AI chat; search works without it

### 1. Clone & install Python dependencies

```bash
git clone <your-repo-url> savoryai && cd savoryai

python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 3. (Optional) Set up Ollama for AI chat

```bash
# Download from https://ollama.ai, then:
ollama serve          # Terminal 1
ollama pull mistral   # Terminal 2
```

See [SETUP_OLLAMA.md](SETUP_OLLAMA.md) for detailed instructions.  
Search works perfectly **without** Ollama; only the "Ask AI" chat tab needs it.

### 4. Start the app (two terminals)

**Terminal 1 — Backend:**

```bash
source venv/bin/activate
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Open **http://localhost:5174** in your browser. 🎉

---

## 🔌 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check — returns status, item count, Ollama availability |
| `POST` | `/api/search` | Semantic food search with optional filters |
| `POST` | `/api/chat` | RAG-powered AI chat about food |

### Search example

```bash
curl -s http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "spicy chicken", "cuisine_filter": "Indian", "max_calories": 500, "n_results": 3}' | python3 -m json.tool
```

### Chat example

```bash
curl -s http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are some healthy breakfast options?"}' | python3 -m json.tool
```

---

## 📂 Project Structure

```
savoryai/
├── backend/
│   └── app.py                     # FastAPI application (search + chat endpoints)
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── App.jsx                # Main React component (Search / Ask AI tabs)
│   │   ├── Logo.jsx               # SVG logo component
│   │   ├── api.js                 # Fetch wrapper for backend API
│   │   ├── main.jsx               # React entry point
│   │   └── styles.css             # Dark design system (glass-morphism, animations)
│   ├── .env                       # VITE_API_BASE_URL
│   ├── index.html
│   ├── package.json
│   └── vite.config.js             # Port 5174, strictPort
├── shared_functions.py            # ChromaDB client, data loading, search logic
├── FoodDataSet.json               # 185 curated food items (sole data source)
├── interactive_search.py          # CLI food search (standalone)
├── enhanced_rag_chatbot.py        # CLI RAG chatbot (standalone)
├── system_comparison.py           # Benchmarking utility
├── advanced_search.py             # Advanced CLI search
├── requirements.txt               # Python dependencies
├── SETUP_OLLAMA.md                # Ollama installation guide
├── LICENSE
└── README.md
```

---

## 🗂️ Dataset

**FoodDataSet.json** contains **185** curated food items spanning **20+ cuisines** including Indian, Italian, Japanese, Mexican, Thai, Mediterranean, and more.

Each item includes:

| Field | Example |
|-------|---------|
| `food_name` | Chicken Tikka Masala |
| `food_description` | Tender chicken in creamy tomato-based sauce… |
| `cuisine_type` | Indian |
| `food_calories_per_serving` | 350 |
| `food_ingredients` | ["chicken", "yogurt", "tomato", …] |
| `cooking_method` | Grilled then simmered |
| `food_health_benefits` | High protein, rich in vitamins… |
| `food_features` | ["spicy", "creamy", "rich"] |

All search and chat results come **exclusively** from this dataset.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, CSS custom properties |
| Backend | FastAPI, Uvicorn, Pydantic |
| Embeddings | Sentence Transformers (`all-MiniLM-L6-v2`) |
| Vector DB | ChromaDB |
| LLM (optional) | Ollama with Mistral |
| Language | Python 3.12, JavaScript (ES2022) |

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5174 in use | Change port in `frontend/vite.config.js` |
| "Ollama unavailable" in chat | Start Ollama: `ollama serve` then `ollama pull mistral` |
| CORS errors | Backend already includes CORS middleware for `localhost:5174` |
| ChromaDB telemetry warning | Cosmetic only — does not affect functionality |
| No search results | Ensure backend is running and check the health endpoint |

---

## 📄 License

[MIT](LICENSE)
