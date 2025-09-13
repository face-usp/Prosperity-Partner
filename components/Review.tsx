"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Himangi Mutha",
    profession:"Architect ( US returned NRI )",
    feedback: `Deepak Shah has been handling managing my mutual fund investments and I’m extremely satisfied with the experience. From the very beginning, he has been proactive in understanding my financial goals and guiding me on how best to structure my investments. What I appreciate most is his ability to explain things clearly and provide practical advice on where to invest, how much to allocate, and the right SIP amounts for my needs. His recommendations are always well thought out, and he ensures I feel confident before making any financial decision. Since he started managing my account, I have seen steady and continuous growth in my portfolio, which has given me both peace of mind and trust in his expertise. Beyond numbers, he is approachable, patient with queries, and always willing to go the extra mile to make sure I understand the process. I truly value the professionalism and personal attention he brings to investment management. I would highly recommend Prosperity Partners to anyone looking for reliable, transparent, and growth-oriented financial guidance. Thanks , Himangi.`,
  },
  {
    name: "Dr. Mahesh Bhujbal",
    feedback: `I would highly recommend Mr Deepak shah. His knowledge and expertise have been invaluable in assisting us in managing our Daughters Education and retirement goals. I liked that Mr Deepak Saha tailored his advice to our goals and circumstances and didn't push us into any higher risk investment strategy. He places their clients' interests first and works to either help mitigate any potential conflicts of interest as much as they can when working with clients. They also communicate as much as possible to help clients understand risks and other information critical to their decision-making processes.`,
  },
  {
    name: "Dr. Dharmesh Gandhi",
    feedback: `Mr Deepak Shah- is an exceptionally intelligent and results-driven mutual fund broker with a proven track record of guiding clients toward sustainable, long-term financial growth. Known for combining deep market insight with data-driven strategies, Deepak brings an analytical mindset, sharp foresight, and an unwavering commitment to maximizing returns while managing risk. He is intelligent, matured and passionate to grow his clients money thru legitimate means`,
  },
  {
    name: "Unhale Family",
    profession:"Abhijit Unhale ( Software Developer as HP  & Khyati Patel as Homeopathy) ",
    feedback: `I had a lovely and a complete Information regarding investing in SIP as I was totally new to it. And he gave me the best plan and scheme according to our needs. Special Thanks to Mr Deepak Shah and Priyanka Shah for everything. 🙏🏻`,
  },
  {
    name: " Amruta Beldar",
    profession:"HR Professional",
    feedback: `I've trusted prosperity partners/Deepak with my investments for almost 8 years now. His clear advice and consistent support have made my financial journey smooth and confident.`,
  },
];

export default function ReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  // Slice logic to always show 3 slides
  const getVisibleSlides = () => {
    const slides = [];
    for (let i = -1; i <= 1; i++) {
      slides.push(reviews[(currentIndex + i + reviews.length) % reviews.length]);
    }
    return slides;
  };

  
  return (
    <div className="relative flex flex-col items-center justify-center h-[600px] w-full py-12 bg-gray-50">
      {/* Carousel Container */}
      <div className="flex items-center justify-center space-x-6">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="z-30 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        {/* Slides */}
        <div className="flex space-x-6">
          {getVisibleSlides().map((review, idx) => (
            <div
              key={idx}
              className={`h-[450px] w-[260px] md:w-[320px] bg-white rounded-2xl p-6 text-left shadow-lg transition-all duration-500 ${
                idx === 1 ? "scale-105 shadow-2xl" : "scale-95 opacity-80"
              } overflow-hidden`}
            >
              <div
        className={`text-gray-700 italic leading-relaxed text-sm md:text-base relative transition-all duration-500 ${
          expanded ? "max-h-[350px] overflow-y-scroll" : `max-h-[320px]`
        } overflow-hidden` }
      >
        “{review.feedback}”
      </div>

      {/* Toggle button */}
      {review.feedback.length > 380 && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-blue-600 text-sm font-medium hover:underline focus:outline-none"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}


              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                - {review.name}
              </h3>
              {review.profession ? <h2 className="text-md md:text-xl text-gray-900">
                - {review.profession}
              </h2> : <></>}
              
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="z-30 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex mt-6 space-x-2">
        {reviews.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-3 w-3 rounded-full cursor-pointer transition ${
              i === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
