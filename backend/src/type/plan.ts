export interface LatLng {
  latitude: number,
  longitude: number,
}

export interface ClusteredLocation extends LatLng {
  original_index: number;
}

export interface ClusterCenter {
  cluster_id: number;
  center_lat: number;
  center_lng: number;
  size: number;
}

export interface Clusters {
  [key: string]: ClusteredLocation[];
}

export interface ClusterResponse {
  success: boolean;
  n_clusters: number;
  clusters: Clusters;
  centers: ClusterCenter[];
}