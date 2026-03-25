import {
  FiCalendar,
  FiChevronUp,
  FiCheckCircle,
  FiClock
} from "react-icons/fi";

interface RouteDetailsProps {
  booking: any;
}
const RouteDetails = ({ booking }: RouteDetailsProps) => {

  console.log("Booking data in RouteDetails:", booking);
  const payload = {
    requestAccepted: "Today, 10:23 am",
    contact: "Today, 10:23 am",
    approvalDate: "32km",
    ambulancePlate: "Today, 10:23 am",
    colorModel: "1hr 12mins",
    ambulanceLead: "Audu Gara",
    approvalReasons: "Lore ipsum dolor sit Lore ipsum dolor sit Lore ipsum dolor sit Lore ipsum dolor sit Lore ipsum dolor sit Lore ipsum dolor sit Lorem ipsum dolor sit Lore ipsum dolor sit Lore ipsum dolor sit Lore ipsum dolor sit Lore ipsum dolor sit"
  };

  return (
    <>
      <div className="w-full max-w-5xl rounded-2xl shadow-xs bg-white overflow-hidden mt-4!">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#FDF6F6] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100">
              <FiCheckCircle className="w-4 h-4 text-[#DB4A47]" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide text-[#000A0F] uppercase">
              Route details
            </h2>          
          </div>

          <div className="flex items-center gap-4">           
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <FiChevronUp className="w-4 h-4 text-[#DB4A47]" />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 text-sm text-[#808D97]">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <FiClock className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Request Accepted</p>
                  <p className="font-medium text-[#000A0F]">{payload.requestAccepted}</p>
                </div>
              </div>
               <div className="flex items-start gap-3">
                <FiClock className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Hospital ETA</p>
                  <p className="font-medium text-[#000A0F]">{payload.ambulancePlate}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-start gap-3">
                    <FiClock className="w-4 h-4 text-[#808D97] mt-1" />
                    <div>
                        <p className="text-[#808D97]">Pickup ETA</p>
                        <p className="font-medium text-[#000A0F]">{payload.contact}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <FiClock className="w-4 h-4 text-[#808D97] mt-1" />
                    <div>
                        <p className="text-[#808D97]">Est. Trip Time</p>
                        <p className="font-medium text-[#000A0F]">{payload.colorModel}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-start gap-3">
                    <FiCalendar className="w-4 h-4 text-[#808D97] mt-1" />
                    <div>
                    <p className="text-[#808D97]">Est Trip DIstance</p>
                    <p className="font-medium text-[#000A0F]">{payload.approvalDate}</p>
                    </div>
                </div>             
            </div>

          </div>

          {/* Approval Reasons */}
          <div className="mt-4">
            <img src="/images/map.png" alt="Ambulance" className="w-full h-48 object-cover rounded-lg mb-4" />
          </div>
        </div>
      </div>
    </>
  );
};

export default RouteDetails;