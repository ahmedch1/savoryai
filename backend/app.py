from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import logging
import os
import sys
import traceback

# Ensure project root is on the Python path so sibling modules resolve
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared_functions import (
    load_food_data,
    create_similarity_search_collection,
    populate_similarity_collection,
    perform_similarity_search,
    perform_filtered_similarity_search,
)
from enhanced_rag_chatbot import generate_llm_rag_response

logger = logging.getLogger("savoryai")

# Resolve data path relative to project root
_PROJECT_ROOT = os.path.join(os.path.dirname(__file__), "..")
DATA_PATH = os.environ.get(
    "FOOD_DATA_PATH",
    os.path.join(_PROJECT_ROOT, "FoodDataSet.json"),
)

# ── shared state ──
collection = None
food_items: list = []


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Modern lifespan handler – replaces deprecated on_event."""
    global collection, food_items

    logger.info("Loading food data from %s …", DATA_PATH)
    food_items = load_food_data(DATA_PATH)
    if not food_items:
        raise RuntimeError("Failed to load food data – check FoodDataSet.json")

    collection = create_similarity_search_collection(
        "savoryai_api_collection",
        {"description": "API collection for SavoryAI"},
    )
    populate_similarity_collection(collection, food_items)
    logger.info("✅ SavoryAI API ready – %d food items indexed", len(food_items))

    yield  # app is running

    logger.info("Shutting down SavoryAI API")


app = FastAPI(
    title="SavoryAI API",
    version="1.0.0",
    description="AI-powered food recommendation API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    n_results: int = Field(5, ge=1, le=10)
    cuisine_filter: Optional[str] = None
    max_calories: Optional[int] = Field(None, ge=0)


class SearchResult(BaseModel):
    food_id: str
    food_name: str
    food_description: str
    cuisine_type: str
    food_calories_per_serving: int
    similarity_score: float


class SearchResponse(BaseModel):
    results: List[SearchResult]


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    response: str
    results: List[SearchResult]


@app.get("/api/health")
def health_check() -> dict:
    return {
        "status": "ok",
        "food_items": len(food_items),
        "collection_ready": collection is not None,
    }


@app.post("/api/search", response_model=SearchResponse)
def search_foods(payload: SearchRequest) -> SearchResponse:
    if collection is None:
        raise HTTPException(status_code=503, detail="Service still loading, please wait")

    try:
        if payload.cuisine_filter or (payload.max_calories is not None):
            results = perform_filtered_similarity_search(
                collection,
                payload.query,
                cuisine_filter=payload.cuisine_filter,
                max_calories=payload.max_calories,
                n_results=payload.n_results,
            )
        else:
            results = perform_similarity_search(
                collection,
                payload.query,
                payload.n_results,
            )
    except Exception as exc:
        logger.error("Search error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(exc))

    return SearchResponse(results=results)


@app.post("/api/chat", response_model=ChatResponse)
def chat_foods(payload: ChatRequest) -> ChatResponse:
    if collection is None:
        raise HTTPException(status_code=503, detail="Service still loading, please wait")

    try:
        search_results = perform_similarity_search(collection, payload.query, 3)
        response_text = generate_llm_rag_response(payload.query, search_results)
    except Exception as exc:
        logger.error("Chat error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(exc))

    return ChatResponse(response=response_text, results=search_results)
