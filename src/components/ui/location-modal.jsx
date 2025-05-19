/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { GoogleMap, Marker } from "@react-google-maps/api";

export default function LocationModal({ isOpen, onClose }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    // Kiểm tra nếu Google Maps API đã được tải
    if (window.google) {
      setScriptLoaded(true);
      return;
    }

    // Nếu chưa tải, tải script thủ công
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBjLElpWo36xvvhT43k8mvB-nHKEiDFoNw`;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          setError(
            "Could not get your location. Please allow location access."
          );
          console.error("Geolocation error:", err);
          setLoading(false);
        }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-4 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Send Location</h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <X size={16} className="text-gray-700" /> X
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
              {!scriptLoaded ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading Google Maps...</p>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Getting your location...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : location ? (
                <GoogleMap
                  mapContainerStyle={{ height: "100%", width: "100%" }}
                  zoom={15}
                  center={{ lat: location.lat, lng: location.lng }}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    draggable: false,
                    scrollwheel: true,
                    draggableCursor: "default",
                    zoomControl: true,
                  }}
                >
                  <Marker position={{ lat: location.lat, lng: location.lng }} />
                </GoogleMap>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No location data</p>
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
      </div>
    </div>
  );
}
