import {
  FiStar,
  FiChevronUp,
} from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

const RatingsReview = () => {
  const reviews = {
    userService: {
      title: "Great ambulance service",
      rating: 4.7,
      review: "The driver, Babatunde, was incredibly punctual and professional, navigating the busy Lagos streets with ease. His calm demeanor was reassuring during a stressful situation. I'd wholeheartedly recommend this ambulance service to anyone in need of prompt and reliable medical transport."
    },
    provider: {
      title: "Great ambulance service",
      rating: 4.7,
      review: "The driver, Babatunde, was incredibly punctual and professional, navigating the busy Lagos streets with ease. His calm demeanor was reassuring during a stressful situation. I'd wholeheartedly recommend this ambulance service to anyone in need of prompt and reliable medical transport."
    }
  };

  // Helper function to render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="w-4 h-4 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="w-4 h-4 text-yellow-400 opacity-50" />);
      } else {
        stars.push(<FaRegStar key={i} className="w-4 h-4 text-yellow-400" />);
      }
    }
    
    return stars;
  };

  return (
    <>
      <div className="w-full max-w-5xl rounded-2xl shadow-xs bg-white overflow-hidden mt-3">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#FDF6F6] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100">
              <FiStar className="w-4 h-4 text-[#DB4A47]" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide text-[#000A0F] uppercase">
              RATINGS & REVIEW
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <FiChevronUp className="w-4 h-4 text-[#DB4A47]" />
            </div>
          </div>
        </div>

        <div className="p-6 gap-3 flex ">
          {/* User Service Rating */}
          <div className="">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-base font-semibold text-[#000A0F]">User Service Rating</h3>
            </div>
            
            <div className="bg-[#F5F6F7] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-medium text-[#000A0F]">{reviews.userService.title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#000A0F]">{reviews.userService.rating}</span>
                  <div className="flex items-center gap-0.5">
                    {renderStars(reviews.userService.rating)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#354959] leading-relaxed">
                {reviews.userService.review}
              </p>
            </div>
          </div>


          {/* Ambulance Provider Rating */}
          <div className="">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-base font-semibold text-[#000A0F]">Ambulance Provider Rating</h3>
            </div>
            
            <div className="bg-[#F5F6F7] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-medium text-[#000A0F]">{reviews.provider.title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#000A0F]">{reviews.provider.rating}</span>
                  <div className="flex items-center gap-0.5">
                    {renderStars(reviews.provider.rating)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#354959] leading-relaxed">
                {reviews.provider.review}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RatingsReview;