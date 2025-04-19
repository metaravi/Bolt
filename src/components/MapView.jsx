import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function MapView({ destination, points }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    if (!destination || !points || points.length === 0) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: points[0].location,
      mapId: 'YOUR_MAP_ID', // Optional: for custom styled maps
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false
    });

    mapInstanceRef.current = map;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add markers for each point
    points.forEach((point, index) => {
      const marker = new window.google.maps.Marker({
        position: point.location,
        map: map,
        title: point.name,
        label: `${index + 1}`,
        animation: window.google.maps.Animation.DROP
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${point.name}</h3>
            <p class="text-sm">${point.description}</p>
            ${point.bestTime ? `<p class="text-sm mt-1">Best time: ${point.bestTime}</p>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    // Draw route between points
    if (points.length > 1) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true
      });

      const waypoints = points.slice(1, -1).map(point => ({
        location: point.location,
        stopover: true
      }));

      directionsService.route({
        origin: points[0].location,
        destination: points[points.length - 1].location,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: 'WALKING'
      }, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-4 mt-4"
    >
      <h3 className="text-xl font-semibold mb-4">Interactive Map</h3>
      <div 
        ref={mapRef} 
        className="w-full h-[400px] rounded-lg"
      />
      <div className="mt-4 space-y-2">
        {points?.map((point, index) => (
          <div 
            key={point.name}
            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
            onClick={() => {
              mapInstanceRef.current?.panTo(point.location);
              mapInstanceRef.current?.setZoom(15);
            }}
          >
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
              {index + 1}
            </span>
            <div>
              <p className="font-medium">{point.name}</p>
              {point.bestTime && (
                <p className="text-sm text-gray-600">Best time: {point.bestTime}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
