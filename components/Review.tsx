"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Himangi Mutha",
    profession: "Architect ( US returned NRI )",
    feedback: `Deepak Shah has been handling managing my mutual fund investments and I’m extremely satisfied with the experience. From the very beginning, he has been proactive in understanding my financial goals and guiding me on how best to structure my investments. What I appreciate most is his ability to explain things clearly and provide practical advice on where to invest, how much to allocate, and the right SIP amounts for my needs. His recommendations are always well thought out, and he ensures I feel confident before making any investment decision. Since he started managing my account, I have seen steady and continuous growth in my portfolio, which has given me both peace of mind and trust in his expertise. Beyond numbers, he is approachable, patient with queries, and always willing to go the extra mile to make sure I understand the process. I truly value the professionalism and personal attention he brings to my investment management . I would highly recommend Prosperity Partners to anyone looking for reliable, transparent, and growth-oriented investment guidance.`,
  },
  {
    name: "Dr. Mahesh Bhujbal",
    feedback: `I would highly recommend Mr. Deepak Shah for his exceptional investment guidance. His knowledge and expertise have been invaluable in helping us plan for our daughter’s education and our retirement goals. What I truly appreciate is how he tailored his advice to our specific needs and circumstances, without ever pushing us towards unnecessary or higher-risk investment strategies.
`,
  },
  {
    name: "Dr. Dharmesh Gandhi",
    feedback: `Mr. Deepak Shah is an exceptionally knowledgeable and results-driven mutual fund distributor with a proven track record of guiding clients towards sustainable, long-term financial growth. He combines deep market insight with data-driven strategies, bringing both analytical foresight and a strong commitment to maximizing returns while carefully managing risk.
What sets him apart is not only his intelligence and maturity but also his genuine passion for helping clients grow their wealth through transparent and legitimate means. With his guidance, you can be assured of a strategic, well-structured, and trustworthy approach to investment management.

`,
  },
  {
    name: "Abhijit Unhale Family",
    profession:
      "Abhijit Unhale as Software Developer at HP  & Khyati Patel as Homeopathy ",
    feedback: `As someone completely new to SIP investments, it has been a wonderful experience receiving clear and complete guidance from Mr. Deepak Shah. He patiently explained everything and suggested the best plan and scheme tailored to our needs. A special thanks to both Mr. Deepak Shah and Ms. Priyanka Shah for their support and guidance.`,
  },
  {
    name: " Amruta Beldar",
    profession: "HR Professional",
    feedback: `I have trusted Prosperity Partners and Mr. Deepak Shah with my investments for almost 8 years now, and the journey has been extremely smooth and reassuring. His clear advice, consistent support, and client-first approach have given me great confidence in my investment decisions.`,
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
