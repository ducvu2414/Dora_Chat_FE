/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Vote, FileUp, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

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
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="h-64 mb-4 bg-gray-200 rounded">
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
