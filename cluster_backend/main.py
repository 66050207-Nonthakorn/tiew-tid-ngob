from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    ClusterRequest,
    ClusterResponse,
    HealthResponse
)
from services.cluster import ClusteringService

app = FastAPI(
    title="Location Clustering API",
    description="API for clustering geographic coordinates using KMeans",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clustering_service = ClusteringService()

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Location Clustering API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="ok", version="1.0.0")

@app.post("/cluster", response_model=ClusterResponse, tags=["Clustering"])
async def cluster_locations(request: ClusterRequest):
    """
    Cluster geographic coordinates using KMeans algorithm.
    
    - **locations**: Array of lat/lng coordinates
    - **n_clusters**: Optional number of clusters (auto-determined if not provided)
    
    Returns grouped locations with cluster centers.
    """
    try:
        clusters, centers = clustering_service.cluster_locations(
            locations=request.locations,
            n_clusters=request.n_clusters
        )
        
        return ClusterResponse(
            success=True,
            n_clusters=len(clusters),
            clusters=clusters,
            centers=centers
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )