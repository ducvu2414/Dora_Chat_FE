/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Vote, FileUp, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";

// Google Maps script loading utility - sử dụng singleton pattern
const googleMapsLoader = (() => {
  let loadPromise = null;

  return {
    load: () => {
      // Nếu script đã được tải hoặc đang tải
      if (window.google?.maps) {
        return Promise.resolve();
      }

      if (loadPromise) {
        return loadPromise;
      }

      // Tạo promise mới để tải script
      loadPromise = new Promise((resolve, reject) => {
        // Create a unique callback name
        const callbackName = `googleMapsCallback_${Date.now()}`;
        window[callbackName] = () => {
          delete window[callbackName];
          resolve();
        };

        const script = document.createElement("script");
        script.id = "google-maps-script";
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        console.log("API Key:", apiKey);
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&loading=async`;
        script.async = true;
        script.onerror = (error) => {
          loadPromise = null;
          reject(error);
        };
        document.body.appendChild(script);
      });

      return loadPromise;
    },
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

export default function MoreMessageDropdown({
  isOpen,
  onClose,
  onFileSelect,
  setIsVoteModalOpen,
  isGroup,
  onLocationSelect,
}) {
  const fileInputRef = useRef(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
    onClose();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleLocationClick = () => {
    if (onLocationSelect) {
      setShowLocationModal(true);
    }
    onClose();
  };

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        onClose={onClose}
        align="right"
        verticalAlign="top"
      >
        <DropdownItem icon={FileUp} onClick={handleFileInputClick}>
          Upload a file
        </DropdownItem>
        <DropdownItem icon={MapPin} onClick={handleLocationClick}>
          Send location
        </DropdownItem>
        {isGroup && (
          <DropdownItem
            icon={Vote}
            onClick={() => {
              setIsVoteModalOpen(true);
              onClose();
            }}
          >
            Create vote
          </DropdownItem>
        )}
      </Dropdown>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {showLocationModal && (
        <LocationModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onSend={(location) => {
            if (onLocationSelect) {
              onLocationSelect(location);
            }
            setShowLocationModal(false);
          }}
        />
      )}
    </>
  );
}

function LocationModal({ isOpen, onClose, onSend }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const mapRef = useRef(null);

  // Tải Google Maps script một cách an toàn
  useEffect(() => {
    if (!isOpen) return; // Chỉ tải khi modal mở

    let isMounted = true;

    googleMapsLoader
      .load()
      .then(() => {
        if (isMounted) setScriptLoaded(true);
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error loading Google Maps:", err);
          setError("Could not load Google Maps");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Lấy vị trí hiện tại khi modal mở
  useEffect(() => {
    if (!isOpen || !scriptLoaded) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError("Could not get your location. Please allow location access.");
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [isOpen, scriptLoaded]);

  // Không render gì nếu modal đóng
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-4 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Send Location</h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-64 mb-4 overflow-hidden bg-gray-200 rounded">
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
              ref={mapRef}
              mapContainerStyle={{ height: "100%", width: "100%" }}
              zoom={15}
              center={{ lat: location.lat, lng: location.lng }}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                zoomControl: true,
                clickableIcons: false,
                disableDefaultUI: false,
              }}
              onClick={(e) => {
                // Cho phép người dùng chọn vị trí khác bằng cách click vào bản đồ
                if (e.latLng) {
                  setLocation({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  });
                }
              }}
            >
              {location && <AdvancedMarker position={location} />}
            </GoogleMap>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>No location data</p>
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
              Click on the map to adjust the location
            </p>
          </div>
        )}

        <div className="flex justify-end">
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
