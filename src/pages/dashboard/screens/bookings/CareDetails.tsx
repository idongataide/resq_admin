import {
  FiCamera,
  FiChevronUp,
  FiFileText,
  FiClipboard
} from "react-icons/fi";



interface CareDetailsProps {
  booking: any;
}
const CareDetails: React.FC<CareDetailsProps> = ({ booking }) => {
  console.log("Booking data in CareDetails:", booking);
  
  const careDetails = {
    preTreatment: {
      diagnosis: "The driver, Babatunde, was incredibly punctual and professional, navigating the busy Lagos streets with ease. His calm demeanor was reassuring during a stressful situation. I'd wholeheartedly recommend this ambulance service to anyone in need of prompt and reliable medical transport."
    },
    postTreatment: {
      treatment: "The driver, Babatunde, was incredibly punctual and professional, navigating the busy Lagos streets with ease. His calm demeanor was reassuring during a stressful situation. I'd wholeheartedly recommend this ambulance service to anyone in need of prompt and reliable medical transport."
    },
    handoffNote: "The driver, Babatunde, was incredibly punctual and professional, navigating the busy Lagos streets with ease. His calm demeanor was reassuring during a stressful situation. I'd wholeheartedly recommend this ambulance service to anyone in need of prompt and reliable medical transport."
  };

  // Sample photo placeholders (in a real app, these would be actual image URLs)
  const preTreatmentPhotos = [
    "https://via.placeholder.com/150/DB4A47/ffffff?text=Photo+1",
    "https://via.placeholder.com/150/DB4A47/ffffff?text=Photo+2",
    "https://via.placeholder.com/150/DB4A47/ffffff?text=Photo+3",
    "https://via.placeholder.com/150/DB4A47/ffffff?text=Photo+4"
  ];

  const postTreatmentPhotos = [
    "https://via.placeholder.com/150/DB4A47/ffffff?text=Photo+1",
    "https://via.placeholder.com/150/DB4A47/ffffff?text=Photo+2",
    "https://via.placeholder.com/150/DB4A47/ffffff?text=Photo+3"
  ];

  return (
    <>
      <div className="w-full max-w-5xl rounded-2xl shadow-xs bg-white overflow-hidden mt-3">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#FDF6F6] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100">
              <FiClipboard className="w-4 h-4 text-[#DB4A47]" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide text-[#000A0F] uppercase">
              CARE DETAILS
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <FiChevronUp className="w-4 h-4 text-[#DB4A47]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 p-6">
          {/* Pre Treatment Section */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100">
                <FiCamera className="w-4 h-4 text-[#DB4A47]" />
              </div>
              <h3 className="text-base font-semibold text-[#000A0F]">Pre Treatment Photos</h3>
            </div>
            
            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {preTreatmentPhotos.map((photo, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <img 
                    src={photo} 
                    alt={`Pre treatment ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <FiCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ))}
            </div>

            {/* Diagnosis */}
            <div className="bg-[#F5F6F7] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiFileText className="w-4 h-4 text-[#354959]" />
                <p className="text-[#354959] font-medium">Diagnosis</p>
              </div>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {careDetails.preTreatment.diagnosis}
              </p>
            </div>
          </div>

         
          {/* Post Treatment Section */}
          <div className="">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100">
                <FiCamera className="w-4 h-4 text-[#DB4A47]" />
              </div>
              <h3 className="text-base font-semibold text-[#000A0F]">Post Treatment Photos</h3>
            </div>
            
            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {postTreatmentPhotos.map((photo, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <img 
                    src={photo} 
                    alt={`Post treatment ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <FiCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ))}
            </div>

            {/* Treatment */}
            <div className="bg-[#F5F6F7] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiFileText className="w-4 h-4 text-[#354959]" />
                <p className="text-[#354959] font-medium">Treatment</p>
              </div>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {careDetails.postTreatment.treatment}
              </p>
            </div>
          </div>

        

          {/* Hand off Note Section */}
          <div className="">
            <div className="flex items-center gap-2 mb-4">           
              <h3 className="text-base font-semibold text-[#000A0F]">Hand off Note</h3>
            </div>            
            <div className="bg-[#F5F6F7] rounded-xl p-5">
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {careDetails.handoffNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CareDetails;