from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class Location(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitude")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude")
    
    class Config:
        json_schema_extra = {
            "example": {
                "latitude": 13.7563,
                "longitude": 100.5018
            }
        }
        
class ClusterRequest(BaseModel):
    locations: List[Location] = Field(..., min_length=1)
    n_clusters: Optional[int] = Field(None, ge=1, description="Number of clusters")
    
    @field_validator("n_clusters")
    def validate_clusters(cls, v: int | None, info):
        if v is not None:
            locations = info.data.get("locations", [])
            if v > len(locations):
                raise ValueError("n_clusters cannot exceed number of locations")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "locations": [
                    {"latitude": 13.7563, "longitude": 100.5018},
                    {"latitude": 13.7565, "longitude": 100.5020},
                    {"latitude": 13.8000, "longitude": 100.5500}
                ],
                "n_clusters": 2
            }
        }

class LocationWithIndex(Location):
    original_index: int

class ClusterCenter(BaseModel):
    cluster_id: int
    center_lat: float
    center_lng: float
    size: int

class ClusterResponse(BaseModel):
    success: bool
    n_clusters: int
    clusters: dict[int, List[LocationWithIndex]]
    centers: List[ClusterCenter]

class HealthResponse(BaseModel):
    status: str
    version: str