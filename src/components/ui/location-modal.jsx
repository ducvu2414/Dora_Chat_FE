/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function LocationModal({ isOpen, onClose, onSend }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Get current location when modal opens
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(currentLocation);
        setLoading(false);

        // Initialize map after we have the location
        initializeMap(currentLocation);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Could not get your location. Please allow location access.");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );

    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        return Promise.resolve();
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBjLElpWo36xvvhT43k8mvB-nHKEiDFoNw&libraries=places`;
      script.async = true;
      script.defer = true;

      const loadPromise = new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });

      document.head.appendChild(script);
      return loadPromise;
    };

    loadGoogleMapsScript().catch((err) => {
      console.error("Error loading Google Maps:", err);
      setError("Could not load Google Maps. Please try again later.");
      setLoading(false);
    });

    return () => {
      // Cleanup if needed
      if (mapInstanceRef.current) {
        // Any cleanup for map instance if needed
      }
    };
  }, [isOpen]);

  const initializeMap = (currentLocation) => {
    if (!window.google || !window.google.maps || !mapRef.current) return;

    const mapOptions = {
      center: currentLocation,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // Add a marker for the current location
    const marker = new window.google.maps.Marker({
      position: currentLocation,
      map: map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });
    markerRef.current = marker;

    // Update location when marker is dragged
    marker.addListener("dragend", () => {
      const newPosition = marker.getPosition();
      setLocation({
        lat: newPosition.lat(),
        lng: newPosition.lng(),
      });
    });

    // Allow clicking on map to move marker
    map.addListener("click", (event) => {
      marker.setPosition(event.latLng);
      setLocation({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-4 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Send Location</h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-gray-500 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-64 mb-4 overflow-hidden bg-gray-200 rounded">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              <p className="ml-2">Getting your location...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full">
              {/* Google Maps will be rendered here */}
              {!window.google && (
                <div className="flex items-center justify-center h-full">
                  <p>Loading map...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {location && (
          <div className="mb-4 text-sm text-gray-600">
            <p>
              Selected location: {location.lat.toFixed(6)},{" "}
              {location.lng.toFixed(6)}
            </p>
            <p className="mt-1 text-xs">
              Drag the marker or click on the map to adjust the location
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(location)}
            disabled={!location || loading}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Send Location
          </button>
        </div>
      </div>
    </div>
  );
}
