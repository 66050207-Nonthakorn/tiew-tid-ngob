from sklearn.cluster import KMeans
import numpy as np
from typing import List, Tuple, Dict
from models import Location, LocationWithIndex, ClusterCenter

class ClusteringService:
    @staticmethod
    def auto_determine_clusters(n_locations: int) -> int:
        """
        Auto-determine optimal number of clusters based on location count.
        Uses heuristic: roughly 1 cluster per 5 locations, capped between 2-10.
        """
        return min(max(2, n_locations // 5), 10)
    
    @staticmethod
    def cluster_locations(
        locations: List[Location],
        n_clusters: int = None
    ) -> Tuple[Dict[int, List[LocationWithIndex]], List[ClusterCenter]]:
        """
        Cluster locations using KMeans algorithm.
        
        Args:
            locations: List of Location objects
            n_clusters: Number of clusters (auto-determined if None)
        
        Returns:
            Tuple of (clustered_locations_dict, cluster_centers_list)
        """
        # Convert locations to numpy array
        coords = np.array([[loc.latitude, loc.longitude] for loc in locations])
        
        # Determine number of clusters
        if n_clusters is None:
            n_clusters = ClusteringService.auto_determine_clusters(len(locations))
        
        n_clusters = min(n_clusters, len(locations))
        
        # Perform KMeans clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        labels = kmeans.fit_predict(coords)
        
        # Group locations by cluster
        clusters: Dict[int, List[LocationWithIndex]] = {}
        for idx, label in enumerate(labels):
            label = int(label)
            if label not in clusters:
                clusters[label] = []
            
            clusters[label].append(
                LocationWithIndex(
                    latitude=locations[idx].latitude,
                    longitude=locations[idx].longitude,
                    original_index=idx
                )
            )
        
        # Calculate cluster centers
        centers = [
            ClusterCenter(
                cluster_id=i,
                center_lat=float(kmeans.cluster_centers_[i][0]),
                center_lng=float(kmeans.cluster_centers_[i][1]),
                size=len(clusters[i])
            )
            for i in range(n_clusters)
        ]
        
        return clusters, centers
