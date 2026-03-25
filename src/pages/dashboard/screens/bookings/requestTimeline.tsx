  import { FiCheck } from "react-icons/fi";

  interface RequestTimelineProps {
    booking: any; // Replace with your Booking type
  }

  interface TimelineItem {
    _id: string;
    message: string;
    createdAt: string;
    status?: string;
  }

  const RequestTimeline = ({ booking }: RequestTimelineProps) => {
    // Format date function
    const formatDate = (dateString: string) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(',', ' ');
    };

    const timelineItems = booking?.booking_timeline || [];

    return (
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm overflow-hidden pb-5 min-h-[300px]!">
        {/* Header */}
        <div className="bg-[#FDF6F6] px-6 py-4">
          <h2 className="text-sm font-semibold tracking-wide text-[#000A0F] uppercase">
            Request Timeline
          </h2>
        </div>

        {/* Timeline Body */}
        <div className="px-6 py-6 relative max-h-[500px] overflow-y-auto">
          {timelineItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No timeline events yet
            </div>
          ) : (
            <>
              {/* Vertical Line */}
              <div className="absolute left-[31px] top-6 bottom-6 w-[1px] bg-[#DB4A47]" />

              <div className="space-y-8">
                {timelineItems.map((item: TimelineItem) => (
                  <div key={item._id} className="flex gap-4 relative">
                    {/* Circle */}
                    <div className="relative z-10">
                      <div className="w-4 h-4 rounded-full bg-[#DB4A47] border-[#fff] border-2 flex items-center justify-center">
                        <FiCheck className="text-white text-sm" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-xs text-[#808D97] mb-1">
                        {formatDate(item.createdAt)}
                      </p>
                      <p className="text-sm text-[#354959] font-medium">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  export default RequestTimeline;