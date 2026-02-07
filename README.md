# SavoryAI

## Project Overview
Interactive food search and RAG (Retrieval-Augmented Generation) chatbot system with vector similarity search and local LLM integration.

## Project Goals
- Build an AI-powered food search and recommendation system
- Implement RAG chatbot for food-related queries
- Use free, open-source tools (no API keys required)
- Create an intuitive CLI interface for food recommendations

## Architecture
**Backend (Python):**
- RAG (Retrieval-Augmented Generation) system with ChromaDB
- Food similarity search with sentence transformers
- Local LLM integration (Ollama)
- CLI-based chatbot interface

## Tech Stack
**Current:**
- Python 3.12
- ChromaDB (Vector database)
- Sentence Transformers (Embeddings)
- Ollama (Local LLM - free, no credit card)
- Requests (HTTP client)

## Quick Start

### 1. Install Dependencies
```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

### 2. Set Up Ollama (FREE - No API Keys!)
See [SETUP_OLLAMA.md](./SETUP_OLLAMA.md) for detailed instructions.

Quick version:
```bash
# Download from https://ollama.ai
# Then in a terminal:
ollama serve

# In another terminal:
ollama pull mistral
```

### 3. Run the Chatbot
```bash
# Interactive food search (works without Ollama)
python interactive_search.py

# Enhanced RAG chatbot (requires Ollama running)
python enhanced_rag_chatbot.py
```

## Features

### 🔍 Interactive Food Search (`interactive_search.py`)
- Vector similarity search for foods
- No external dependencies or API keys required
- Real-time search with semantic understanding
- Food details: cuisine, calories, description, ingredients

### 🤖 Enhanced RAG Chatbot (`enhanced_rag_chatbot.py`)
- AI-powered natural language responses
- Uses **Ollama** for local LLM inference (completely free)
- Food comparison feature
- Fallback responses when Ollama unavailable
- Conversational food recommendations

### ✨ Key Advantages
✅ **Completely FREE** - No API keys, no credit cards  
✅ **Runs Locally** - Your data stays on your computer  
✅ **Works Offline** - After initial model download  
✅ **Open Source** - Full transparency and control  
✅ **Fast** - No network latency after setup  

## Dataset
Food database included: `FoodDataSet.json` with ~1000+ food items including:
- Food names and descriptions
- Cuisine types
- Calories per serving
- Ingredients
- Cooking methods
- Health benefits

## Development
- No external API requirements
- Local development and testing
- Minimal dependencies (see `requirements.txt`)
- Modular code structure

## File Structure
```
.
├── interactive_search.py          # CLI food search
├── enhanced_rag_chatbot.py        # AI chatbot with Ollama
├── shared_functions.py            # ChromaDB and embedding utilities
├── FoodDataSet.json               # Food database
├── requirements.txt               # Python dependencies
├── SETUP_OLLAMA.md               # Ollama setup guide
└── README.md                      # This file
```

## Troubleshooting
- If Ollama not found, chatbot uses fallback responses
- Run `ollama list` to see downloaded models
- See SETUP_OLLAMA.md for detailed troubleshooting
