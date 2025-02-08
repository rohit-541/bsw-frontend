import React from "react";

export default function PersonalMentorship() {
  return (
    <div className=" container mx-auto mb-16 w-full p-6 bg-white rounded-2xl">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Academic Mentorship */}
        <div className="relative group"><a href="https://forms.gle/Re48oGaqi1PZkuFF9" target="_blank">
          <div className="overflow-hidden rounded-lg bg-[#f8f9fa] p-4">
            <div className="h-48 md:h-64 relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/personalMentorship-09fAUTmoHjY4ybEE9CB5elcUjmz8gd.png"
                alt="Personal Academic Mentorship"
                className="object-contain w-full h-full"
                loading="lazy"
              />
            </div>
            <button
              className="mt-4 block w-full text-left py-3 px-4 rounded-lg bg-[#1a2b3c] text-white font-medium hover:bg-[#2a3b4c] transition-all duration-300 ease-in-out hover:cursor-pointer hover:scale-105"
            >
              <span className="block text-sm text-gray-200">APPLY FOR</span>
              <span className="block text-lg">PERSONAL ACADEMIC MENTORSHIP</span>
            </button>
          </div></a>
        </div>

        {/* Academic Counselling */}
        <div className="relative group"><a href="https://forms.gle/BHRr7ykTYXsgktxe6" target="_blank">
          <div className="overflow-hidden rounded-lg bg-[#f8f9fa] p-4">
            <div className="h-48 md:h-64 relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/acadCounselling-226mDAxZlXqnT5z3tf1fgGigkeBANs.png"
                alt="Academic Counselling"
                className="object-contain w-full h-full"
                loading="lazy"
              />
            </div>
            <button
              className="mt-4 block w-full text-left py-3 px-4 rounded-lg bg-[#1a2b3c] text-white font-medium hover:bg-[#2a3b4c] transition-all duration-300 ease-in-out hover:cursor-pointer hover:scale-105"
            >
              <span className="block text-sm text-gray-200">APPLY FOR</span>
              <span className="block text-lg">ACADEMIC COUNSELLING</span>
            </button>
          </div></a>
        </div>
      </div>
    </div>
  );
}
