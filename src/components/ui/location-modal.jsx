/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { GoogleMap } from "@react-google-maps/api";

// Google Maps script loading utility
const loadGoogleMapsScript = (() => {
  let isLoading = false;
  let isLoaded = false;
  let loadPromise = null;

  return () => {
    // Return existing promise if already loading
    if (isLoading) return loadPromise;

    // Return resolved promise if already loaded
    if (isLoaded || window.google?.maps) {
      isLoaded = true;
      return Promise.resolve();
    }

    // Otherwise load the script
    isLoading = true;
    loadPromise = new Promise((resolve, reject) => {
      // Create a unique callback name
      const callbackName = `googleMapsCallback_${Date.now()}`;
      window[callbackName] = () => {
        isLoaded = true;
        isLoading = false;
        delete window[callbackName];
        resolve();
      };

      const script = document.createElement("script");
      script.id = "google-maps-script";
      // Thêm loading=async để tối ưu hiệu suất
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      console.log("API Key:", apiKey);
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&loading=async`;
      script.async = true;
      script.onerror = (error) => {
        isLoading = false;
        reject(error);
      };
      document.body.appendChild(script);
    });

    return loadPromise;
  };
})();

// Custom Advanced Marker component
function AdvancedMarker({ position }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.google?.maps?.marker?.AdvancedMarkerElement) return;

    // Create the advanced marker
    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position,
      map: markerRef.current?.getMap(),
    });

    return () => {
      // Clean up marker
      if (marker) marker.map = null;
    };
  }, [position, markerRef.current]);

  return null;
}

export default function LocationModal({ isOpen, onClose, position }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Load Google Maps script when modal is open
    let isMounted = true;
    loadGoogleMapsScript()
      .then(() => {
        if (isMounted) setScriptLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // Handle missing position
  const mapPosition = position || { lat: 0, lng: 0 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-4 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">View Location</h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 p-4 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <span className="flex items-center justify-center">
              <X className="!w-4 !h-4" />
            </span>
          </button>
        </div>

        <div className="h-64 mb-4 overflow-hidden bg-gray-200 rounded">
          <div ref={mapRef} className="w-full h-full">
            {!scriptLoaded ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading Google Maps...</p>
              </div>
            ) : (
              <GoogleMap
                ref={mapRef}
                mapContainerStyle={{ height: "100%", width: "100%" }}
                zoom={15}
                center={mapPosition}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  draggable: false,
                  scrollwheel: true,
                  draggableCursor: "default",
                  zoomControl: true,
                  disableDefaultUI: true,
                }}
              >
                {position && <AdvancedMarker position={mapPosition} />}
              </GoogleMap>
            )}
          </div>
        </div>

        {position && (
          <div className="mb-4 text-sm text-gray-600">
            <p>
              Selected location: {position.lat.toFixed(6)},{" "}
              {position.lng.toFixed(6)}
            </p>
            <p className="mt-1 text-xs">
              Drag the marker or click on the map to adjust the location
            </p>
          </div>
        )}

        <div className="text-xs text-red-500">
          <p>
            Note: You need to enable billing on your Google Cloud Platform
            account to use Google Maps. Visit the Google Cloud Console to set up
            billing for your API key.
          </p>
        </div>
      </div>
    </div>
  );
}
