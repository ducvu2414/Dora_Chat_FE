/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { Modal } from "@/components/ui/modal"
import { GoogleMap } from "@react-google-maps/api"

// Google Maps script loading utility
const loadGoogleMapsScript = (() => {
  let isLoading = false
  let isLoaded = false
  let loadPromise = null

  return () => {
    // Return existing promise if already loading
    if (isLoading) return loadPromise

    // Return resolved promise if already loaded
    if (isLoaded || window.google?.maps) {
      isLoaded = true
      return Promise.resolve()
    }

    // Otherwise load the script
    isLoading = true
    loadPromise = new Promise((resolve, reject) => {
      // Create a unique callback name
      const callbackName = `googleMapsCallback_${Date.now()}`
      window[callbackName] = () => {
        isLoaded = true
        isLoading = false
        delete window[callbackName]
        resolve()
      }

      const script = document.createElement("script")
      script.id = "google-maps-script"
      // Thêm loading=async để tối ưu hiệu suất
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
      console.log("API Key:", apiKey)
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&loading=async`
      script.async = true
      script.onerror = (error) => {
        isLoading = false
        reject(error)
      }
      document.body.appendChild(script)
    })

    return loadPromise
  }
})()

// Custom Advanced Marker component
function AdvancedMarker({ position }) {
  const markerRef = useRef(null)

  useEffect(() => {
    if (!window.google?.maps?.marker?.AdvancedMarkerElement) return

    // Create the advanced marker
    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position,
      map: markerRef.current?.getMap(),
    })

    return () => {
      // Clean up marker
      if (marker) marker.map = null
    }
  }, [position, markerRef.current])

  return null
}

export default function LocationModal({ isOpen, onClose, onSend, initialLocation = null, position }) {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [location, setLocation] = useState(initialLocation || position || null)
  const [loading, setLoading] = useState(!initialLocation && !position)
  const [error, setError] = useState(null)
  const mapRef = useRef(null)

  const isViewMode = !!initialLocation || !!position

  useEffect(() => {
    if (!isOpen) return

    // Load Google Maps script when modal is open
    let isMounted = true
    loadGoogleMapsScript()
      .then(() => {
        if (isMounted) setScriptLoaded(true)
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error)
        if (isMounted) setError("Could not load Google Maps. Please try again later.")
      })

    // If no location is provided, get current location
    if (!initialLocation && !position && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted) {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
            setLoading(false)
          }
        },
        (err) => {
          console.error("Geolocation error:", err)
          if (isMounted) {
            setError("Could not get your location. Please allow location access.")
            setLoading(false)
          }
        },
        { enableHighAccuracy: true },
      )
    }

    return () => {
      isMounted = false
    }
  }, [isOpen, initialLocation, position])

  // Don't render anything if modal is closed
  if (!isOpen) return null

  // Handle missing position
  const mapPosition = location || { lat: 0, lng: 0 }

  const handleOpenInGoogleMaps = () => {
    if (!location) return
    const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`
    window.open(url, "_blank")
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isViewMode ? "View Location" : "Send Location"}>
      <div className="space-y-4">
        <div className="h-64 overflow-hidden bg-gray-200 rounded">
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
                    draggable: !isViewMode,
                    scrollwheel: true,
                    zoomControl: true,
                    disableDefaultUI: true,
                  }}
                >
                  {location && <AdvancedMarker position={mapPosition} />}
                </GoogleMap>
              )}
            </div>
          )}
        </div>

        {location && (
          <div className="text-sm text-gray-600">
            <p>
              {isViewMode ? "Location" : "Selected location"}: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
            {!isViewMode && <p className="mt-1 text-xs">Drag the marker or click on the map to adjust the location</p>}
          </div>
        )}

        <div className="flex justify-end gap-2">
          {isViewMode && (
            <button
              onClick={handleOpenInGoogleMaps}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Open in Google Maps
            </button>
          )}
          {!isViewMode && (
            <button
              onClick={() => onSend(location)}
              disabled={!location || loading}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Send Location
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
