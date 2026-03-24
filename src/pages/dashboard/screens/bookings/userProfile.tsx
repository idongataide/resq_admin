import { 
  FaCalendarAlt, 
  FaEnvelope, 
  FaPhone, 
  FaVenusMars,
  FaHashtag,
  FaUser
} from 'react-icons/fa';
import { Button } from 'antd';
import Images from '@/components/images';

interface UserProfileProps {
  booking: any; // Replace 'any' with your actual Booking type
}

const UserProfile: React.FC<UserProfileProps> = ({ booking }) => {
  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get status badge config
  const getStatusConfig = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: '#FFF7E8', text: '#BB7F05', label: 'Searching for an Ambulance' },
      REQUEST_ACCEPTED: { bg: '#F8FEF5', text: '#4EA507', label: 'Ambulance Assigned' },
      ENROUTE_PICKUP: { bg: '#F2F9FE', text: '#007BFF', label: 'En-route to Pickup' },
      ARRIVED_AT_PICKUP: { bg: '#E8F0FE', text: '#1A5F7A', label: 'Arrived at Pickup' },
      PICKED_PATIENT: { bg: '#E8F5E9', text: '#1B5E20', label: 'Patient Picked Up' },
      ENROUTE_TO_DROPOFF: { bg: '#F2F9FE', text: '#007BFF', label: 'En-route to Hospital' },
      COMPLETED: { bg: '#E8F5E9', text: '#1B5E20', label: 'Completed' },
      CANCELED: { bg: '#FDF5F5', text: '#DE3631', label: 'Cancelled' },
    };

    return statusConfig[status] || statusConfig.PENDING;
  };

  const statusConfig = getStatusConfig(booking.booking_status);

  return (
    <div className="w-full rounded-2xl shadow-xs bg-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        
        {/* Profile Image */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-45 lg:h-45 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center mx-auto sm:mx-0">
          <img 
            src={Images.ambulance} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* User Details */}
        <div className="flex-1 w-full">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#000A0F]">
              {booking.customer_data?.customer_name || 'N/A'}
            </h2>
            
            <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
              <Button 
                className="rounded-xl px-3 py-2 bg-[#FDF6F6] flex-1 sm:flex-none"
                icon={<FaPhone className="w-4 h-4 text-[#DB4A47]" />}
                onClick={() => window.location.href = `tel:${booking.customer_data?.customer_phone || booking.phone_number}`}
              />
              <Button 
                type='primary' 
                className="text-white rounded-xl px-4 py-2 flex items-center gap-2 flex-1 sm:flex-none justify-center"
                icon={<FaEnvelope className="w-4 h-4" />}
                onClick={() => window.location.href = `mailto:${booking.email || ''}`}
              >
                Chat with User
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4" />

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 text-sm text-gray-700">
            
            {/* Booking ID */}
            <div className="flex items-start gap-2">
              <FaHashtag className="w-4 h-4 mt-1 text-[#354959] flex-shrink-0" />
              <div>
                <p className="text-[#354959]">Booking ID</p>
                <p className="font-medium text-[#000A0F]">
                  {booking.booking_ref || booking.booking_id?.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* User Type */}
            <div className="flex items-start gap-2">
              <FaUser className="w-4 h-4 mt-1 text-[#354959] flex-shrink-0" />
              <div>
                <p className="text-[#354959]">User Type</p>
                <p className="font-medium text-[#000A0F] capitalize">
                  {booking.user_type || 'Registered'}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-2">
              <FaPhone className="w-4 h-4 mt-1 text-[#354959] flex-shrink-0" />
              <div>
                <p className="text-[#354959]">Contact</p>
                <p className="font-medium text-[#000A0F]">
                  {booking.customer_data?.customer_phone || booking.phone_number || 'N/A'}
                </p>
              </div>
            </div>

            {/* Emergency Category */}
            <div className="flex items-start gap-2">
              <FaVenusMars className="w-4 h-4 mt-1 text-[#354959] flex-shrink-0" />
              <div>
                <p className="text-[#354959]">Emergency Category</p>
                <p className="font-medium text-[#000A0F] capitalize">
                  {booking.emergency_category || 'N/A'}
                </p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-start gap-2">
              <FaCalendarAlt className="w-4 h-4 mt-1 text-[#354959] flex-shrink-0" />
              <div>
                <p className="text-[#354959]">Created At</p>
                <p className="font-medium text-[#000A0F]">
                  {formatDate(booking.created_at)}
                </p>
              </div>
            </div>

            {/* Request Status */}
            <div className="flex items-start gap-2">
              <div className="mt-1 w-4 h-4 flex-shrink-0" /> {/* Spacer for alignment */}
              <div>
                <p className="text-[#354959]">Request Status</p>
                <span 
                  className="inline-flex items-center mt-1 px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                  style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-1" 
                    style={{ backgroundColor: statusConfig.text }}
                  />
                  {statusConfig.label}
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;