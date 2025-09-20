"""
Configuration management for Agent Orchestrator service
"""

import os
from functools import lru_cache
from typing import Optional

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Server configuration
    host: str = Field(default="0.0.0.0", env="ORCHESTRATOR_HOST")
    port: int = Field(default=8000, env="ORCHESTRATOR_PORT")
    debug: bool = Field(default=False, env="DEBUG")
    
    # Database configuration
    database_url: str = Field(
        default="sqlite:///./orchestrator.db",
        env="DATABASE_URL"
    )
    
    # Redis configuration for caching and sessions
    redis_url: str = Field(
        default="redis://localhost:6379",
        env="REDIS_URL"
    )
    
    # MCP configuration
    mcp_timeout: int = Field(default=30, env="MCP_TIMEOUT")
    mcp_max_connections: int = Field(default=100, env="MCP_MAX_CONNECTIONS")
    
    # Council session configuration
    council_timeout: int = Field(default=600, env="COUNCIL_TIMEOUT")  # 10 minutes
    max_concurrent_councils: int = Field(default=10, env="MAX_CONCURRENT_COUNCILS")
    
    # Agent configuration
    agent_timeout: int = Field(default=30, env="AGENT_TIMEOUT")
    max_agent_messages: int = Field(default=100, env="MAX_AGENT_MESSAGES")
    
    # Evidence provider configuration
    evidence_timeout: int = Field(default=60, env="EVIDENCE_TIMEOUT")
    max_evidence_size: int = Field(default=10 * 1024 * 1024, env="MAX_EVIDENCE_SIZE")  # 10MB
    
    # Security configuration
    secret_key: str = Field(default="dev-secret-key", env="SECRET_KEY")
    allowed_origins: list = Field(default=["*"], env="ALLOWED_ORIGINS")
    
    # Logging configuration
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        env="LOG_FORMAT"
    )
    
    # Monitoring configuration
    enable_metrics: bool = Field(default=True, env="ENABLE_METRICS")
    metrics_port: int = Field(default=9090, env="METRICS_PORT")
    
    # External service URLs
    agent_registry_url: Optional[str] = Field(default=None, env="AGENT_REGISTRY_URL")
    evidence_provider_url: Optional[str] = Field(default=None, env="EVIDENCE_PROVIDER_URL")
    synthesis_engine_url: Optional[str] = Field(default=None, env="SYNTHESIS_ENGINE_URL")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Global settings instance
settings = get_settings()
