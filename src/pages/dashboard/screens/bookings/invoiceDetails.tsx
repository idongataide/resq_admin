import { FiFileText } from "react-icons/fi";

const InvoiceCard = () => {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm overflow-hidden mt-3">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#FDF6F6] px-6 py-4">
        <div className="flex items-center gap-2">
          <FiFileText className="text-[#DB4A47] text-lg" />
          <h2 className="text-sm font-semibold tracking-wide text-[#000A0F] uppercase">
            Invoice
          </h2>
        </div>

        {/* Paid Badge */}
        <div className="flex items-center gap-2 bg-[#E9F7EF] px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <span className="text-sm text-[#16A34A] font-medium">Paid</span>
        </div>
      </div>

      {/* Invoice Body */}
      <div className="p-4">
        <div className="bg-[#F3F5F9] rounded-xl p-5">
          
          {/* Service Fare */}
          <div className="text-center mb-5">
            <h3 className="text-2xl font-semibold text-[#021C2F]">
              ₦8,000
            </h3>
            <p className="text-sm text-[#808D97]">Service Fare</p>
          </div>

          <div className="border-t border-[#E4E7EC] mb-4" />

          {/* Payment Method */}
          <div className="flex justify-between py-3 border-b border-[#E4E7EC] text-sm">
            <span className="text-[#000A0F]">Payment Method</span>
            <span className="text-[#021C2F] font-medium">Card</span>
          </div>

          {/* Payment Date */}
          <div className="flex justify-between py-3 border-b border-[#E4E7EC] text-sm">
            <span className="text-[#000A0F]">Payment Date & Time</span>
            <span className="text-right text-[#021C2F] font-medium">
              12th January, 2025,<br />10:23 am
            </span>
          </div>

          {/* Item 1 */}
          <div className="flex justify-between py-3 border-b border-[#E4E7EC] text-sm">
            <span className="text-[#000A0F]">Item 1</span>
            <span className="text-[#021C2F] font-medium">₦2,300</span>
          </div>

          {/* Item 2 */}
          <div className="flex justify-between py-3 text-sm">
            <span className="text-[#000A0F]">Item 2</span>
            <span className="text-[#000A0F] font-medium">₦2,300</span>
          </div>
        </div>
        
        <hr className="my-5 border-[#E4E7EC]" />

        {/* Show More */}
        <div className="flex justify-center mt-6">
          <button className="px-6 py-2 rounded-lg bg-[#FDF2F2] text-[#DB4A47] text-sm font-medium">
            Show more
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
