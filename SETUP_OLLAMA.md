# Setting Up the Chatbot with Ollama (Free & Open-Source)

## What is Ollama?
Ollama is a **free, open-source** application that lets you run large language models (LLMs) locally on your computer—no internet, no API keys, no credit cards required!

## Installation Steps

### 1. Download and Install Ollama
- Visit: https://ollama.ai
- Download for your OS (Linux, macOS, Windows)
- Run the installer and follow the prompts

### 2. Start Ollama
After installation, start the Ollama server in a terminal:

```bash
ollama serve
```

You should see output like:
```
2024/02/07 10:30:00 Listening on 127.0.0.1:11434
```

**Keep this terminal open while using the chatbot!**

### 3. Download a Model
In a **new terminal**, download a model. Here are some good free options:

```bash
# Recommended: Fast and good quality (4GB)
ollama pull mistral

# Or try others:
ollama pull llama2           # More capable but slower (7GB)
ollama pull neural-chat      # Small and fast (4GB)
ollama pull orca-mini        # Good balance (2GB)
```

This downloads the model to your computer (takes 5-10 minutes depending on your internet).

### 4. Verify Installation
Test if Ollama is working:

```bash
curl -X POST http://localhost:11434/api/generate -d '{"model":"mistral","prompt":"Hello"}'
```

You should get a response with generated text.

## Running the Chatbot

### Option 1: Using Default Settings (Ollama + Mistral)
If Ollama is running with `mistral` model:

```bash
# Activate your virtual environment
source .venv/bin/activate

# Run the chatbot
python enhanced_rag_chatbot.py
```

### Option 2: Using a Different Model
To use a different Ollama model:

```bash
# Set environment variable before running
export LLM_MODEL=llama2
python enhanced_rag_chatbot.py

# Or use neural-chat:
export LLM_MODEL=neural-chat
python enhanced_rag_chatbot.py
```

### Option 3: If Ollama is on a Different Machine
```bash
export OLLAMA_API_URL=http://your-machine-ip:11434/api/generate
python enhanced_rag_chatbot.py
```

## Available Models
- **mistral** (default) - Good balance of speed and quality
- **llama2** - More capable but slower
- **neural-chat** - Smaller, very fast
- **orca-mini** - Ultra-lightweight
- **dolphin-mixtral** - Good reasoning
- See more: `ollama list` or visit https://ollama.ai/library

## Fallback Mode
If Ollama is not running, the chatbot will automatically use **fallback responses**. It will still work but with simpler AI suggestions.

## Troubleshooting

### Port Already in Use
If you get "port 11434 already in use":
```bash
# Find what's using the port
lsof -i :11434

# Or change Ollama's port:
OLLAMA_PORT=11435 ollama serve
export OLLAMA_API_URL=http://localhost:11435/api/generate
```

### Model Download Issues
```bash
# Check downloaded models
ollama list

# Remove a model
ollama rm mistral

# Try re-downloading
ollama pull mistral
```

### Slow Performance
- Use smaller models: `neural-chat`, `orca-mini`
- Increase GPU memory allocation (if you have an NVIDIA GPU)
- Ollama automatically uses GPU if available

## System Requirements
- **Minimum**: 8GB RAM
- **Recommended**: 16GB RAM, GPU (NVIDIA, AMD, or Apple Silicon)
- **Disk**: ~5-15GB for a model
- **Internet**: Only needed for initial model download

## Next Steps
1. Install Ollama from https://ollama.ai
2. Run `ollama serve` in a terminal
3. In another terminal, run `ollama pull mistral`
4. Run `python enhanced_rag_chatbot.py`
5. Try searching for foods!

## Important Notes
✅ **Completely free** - No API keys, no credit cards, no subscriptions
✅ **Runs locally** - Your data stays on your computer
✅ **No internet required** - Works offline (after model download)
✅ **Open source** - Transparency and full control
✅ **Customizable** - Use any Ollama-compatible model

Enjoy your local AI-powered food recommendation chatbot!
