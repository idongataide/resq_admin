import Images from "@/components/images";
import { useAllBookingsCount } from "@/hooks/useProfile";
import React, { useState } from "react";
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import './LagosHotspotsMap.css';

// Define interface for the data points
interface BookingDataPoint {
  area: string;
  total: number;
  longitude: number;
  latitude: number;
}

type FilterType = 'realtime' | 'offline';
type DemandLevel = 'high' | 'mid' | 'low';

// Custom marker component with ripple effect
const RippleMarker: React.FC<{
  position: { lat: number; lng: number };
  title: string;
  demandLevel: DemandLevel;
}> = ({ position, title, demandLevel }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -(height / 2),
  });

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={getPixelPositionOffset}
    >
      <div 
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={`location-ripple ${demandLevel}-demand`} />
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg text-sm whitespace-nowrap z-10">
            <div className="text-gray-800 font-medium capitalize">{title}</div>
            <div className="text-gray-500 text-xs mt-1">
              {demandLevel === 'high' ? 'High Demand Area' : 
               demandLevel === 'mid' ? 'Mid Demand Area' : 'Low Demand Area'}
            </div>
          </div>
        )}
      </div>
    </OverlayView>
  );
};

const LagosHotspotsMap: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('realtime');

  // Format the query string based on selected filter
  const queryString = selectedFilter === 'realtime' ? 'area-map&realtime=true' : 'area-map&offline=true';

  const { data: bookingsCount } = useAllBookingsCount(queryString);

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  // Center map on Lagos
  const center = {
    lat: 6.5244,
    lng: 3.3792
  };

  const apiKey = import.meta.env.VITE_GMAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  // Calculate demand level for each area based on period total
  const getDemandLevel = (total: number): DemandLevel => {
    // Find the maximum bookings in any area
    const maxBookings = bookingsCount?.reduce((max: number, point: BookingDataPoint) => 
      Math.max(max, point.total), 0) || 0;
    // Calculate percentage relative to the maximum
    const percentage = (total / maxBookings) * 100;
    
    if (percentage >= 51) return 'high';
    if (percentage >= 21 && percentage <= 50) return 'mid';
    return 'low';
  };

  return (
    <div className="bg-white border border-[#E5E9F0] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Hot spots</h3>
   
    <div className="flex items-center gap-4 text-sm">
          <p className="relative flex items-center">
            <span className="w-4 h-4 rounded-full bg-[#DB4A47]/20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full border-2 border-[#fff] bg-[#DB4A47]"></span>
            </span>
            <span className="ml-1">Hot</span>
          </p>
          <p className="relative flex items-center">
            <span className="w-4 h-4 rounded-full bg-[#BB7F05]/20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full border-2 border-[#fff] bg-[#BB7F05]"></span>
            </span>
            <span className="ml-1">Mild</span>
          </p>
          <p className="relative flex items-center">
            <span className="w-4 h-4 rounded-full bg-[#007BFF]/20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full border-2 border-[#fff] bg-[#007BFF]"></span>
            </span>
            <span className="ml-1">Cold</span>
          </p>
        </div>
        <div className="relative">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as FilterType)}
            className="px-4 py-2 text-sm bg-white border border-[#F2F4F7] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E86229] focus:border-transparent cursor-pointer appearance-none pr-10"
          >
            <option value="realtime">Realtime</option>
            <option value="offline">Offline</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="h-96 mb-8 flex items-center rounded-lg overflow-hidden justify-center text-gray-600 font-bold">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            {/* Add markers here based on the data */}
            {bookingsCount?.map((point: BookingDataPoint, index: number) => {
              const demandLevel = getDemandLevel(point.total);
              return (
                <RippleMarker
                  key={index}
                  position={{
                    lat: point.latitude,
                    lng: point.longitude
                  }}
                  title={`${point.area || 'Unknown Area'} (${point.total} requests)`}
                  demandLevel={demandLevel}
                />
              );
            })}
          </GoogleMap>
        ) : (
          <img src={Images.map} alt="Filter" className="w-full rounded-lg" /> // Fallback to image if map not loaded
        )}
      </div>
    </div>
  );
};

export default LagosHotspotsMap;