import { FiFileText } from "react-icons/fi";
import { useState } from "react";

interface InvoiceCardProps {
  booking: any;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ booking }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Get invoices from booking data
  const invoices = booking?.invoice || booking?.service_rendered_data || [];
  const hasInvoices = invoices.length > 0;
  
  // Calculate total amount
  const totalAmount = invoices.reduce((sum: number, fee: any) => sum + (fee.amount || 0), 0);
  
  // Get payment status (you can adjust this based on your actual data)
  const paymentStatus = booking?.payment_status === 1 ? "Paid" : "Pending";
  const isPaid = paymentStatus === "Paid";
  
  // Get payment method from booking data
  const paymentMethod = booking?.payment_method || "Not specified";
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Get payment date (you might need to adjust this based on your data structure)
  const paymentDate = booking?.payment_date || booking?.updated_at || booking?.created_at;
  
  // Determine how many items to show
  const displayedInvoices = showAll ? invoices : invoices.slice(0, 5);
  const hasMore = invoices.length > 5;
  
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

        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
          isPaid ? 'bg-[#E9F7EF]' : 'bg-[#FFF7E8]'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isPaid ? 'bg-[#16A34A]' : 'bg-[#BB7F05]'
          }`} />
          <span className={`text-sm font-medium ${
            isPaid ? 'text-[#16A34A]' : 'text-[#BB7F05]'
          }`}>
            {paymentStatus}
          </span>
        </div>
      </div>

      {/* Invoice Body */}
      <div className="p-4">
        <div className="bg-[#F3F5F9] rounded-xl p-5">
          
          {/* Total Amount */}
          <div className="text-center mb-5">
            <h3 className="text-2xl font-semibold text-[#021C2F]">
              ₦{totalAmount.toLocaleString()}
            </h3>
            <p className="text-sm text-[#808D97]">Total Amount</p>
          </div>

          <div className="border-t border-[#E4E7EC] mb-4" />

          {/* Payment Method */}
          <div className="flex justify-between py-3 border-b border-[#E4E7EC] text-sm">
            <span className="text-[#000A0F]">Payment Method</span>
            <span className="text-[#021C2F] font-medium">{paymentMethod}</span>
          </div>

          {/* Payment Date */}
          {paymentDate && (
            <div className="flex justify-between py-3 border-b border-[#E4E7EC] text-sm">
              <span className="text-[#000A0F]">Payment Date & Time</span>
              <span className="text-right text-[#021C2F] font-medium">
                {formatDate(paymentDate)}
              </span>
            </div>
          )}

          {/* Invoice Items */}
          {hasInvoices ? (
            displayedInvoices.map((fee: any, index: number) => (
              <div 
                key={fee._id || fee.service_id}
                className={`flex justify-between py-3 text-sm ${
                  index !== displayedInvoices.length - 1 ? 'border-b border-[#E4E7EC]' : ''
                }`}
              >
                <span className="text-[#000A0F]">{fee.name}</span>
                <span className="text-[#021C2F] font-medium">
                  ₦{fee.amount?.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm">
              No invoice items available
            </div>
          )}
        </div>
        
        <hr className="my-5 border-[#E4E7EC]" />

        {/* Show More / Show Less Button */}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 rounded-lg bg-[#FDF2F2] text-[#DB4A47] text-sm font-medium hover:bg-[#fce8e8] transition-colors"
            >
              {showAll ? 'Show less' : `Show more (${invoices.length - 5} more)`}
            </button>
          </div>
        )}
        
        {/* If no items to show more, just show a disabled button or nothing */}
        {!hasMore && hasInvoices && invoices.length > 0 && (
          <div className="flex justify-center mt-6">
            <button 
              disabled
              className="px-6 py-2 rounded-lg bg-[#FDF2F2] text-[#DB4A47] text-sm font-medium opacity-50 cursor-not-allowed"
            >
              No more items
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceCard;