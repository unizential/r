#!/usr/bin/env python3
"""
Manus Engine - Agent Orchestrator Service
Main FastAPI application for Council-driven multi-agent AI collaboration
"""

import asyncio
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Manage application lifespan with proper startup/shutdown"""
    logger.info("Starting Agent Orchestrator Service...")
    
    try:
        logger.info("All services started successfully")
        yield
    except Exception as e:
        logger.error(f"Failed to start services: {e}")
        raise
    finally:
        logger.info("Shutting down services...")
        logger.info("All services stopped")


# Create FastAPI application
app = FastAPI(
    title="Manus Engine - Agent Orchestrator",
    description="Council-driven multi-agent AI collaboration platform",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "Manus Engine - Agent Orchestrator",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "council": "/api/v1/council",
            "mcp": "/mcp",
            "websocket": "/ws",
            "health": "/health"
        }
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
