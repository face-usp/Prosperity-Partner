"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import logoBg from "@/public/logoBg.png";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full bg-white z-20 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 sm:py-6">
          {/* Logo and title */}
          <a
            href="/"
            className="flex items-center justify-start gap-2 mr-10 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2"
          >
            <Image src={logoBg} alt="Logo" className="h-[100px] w-[100px]" />
            <h1 className="font-bold text-3xl sm:text-lg md:text-2xl lg:text-3xl  whitespace-normal">
              Prosperity Partners
            </h1>
          </a>

          {/* Desktop Links */}
          <div className="hidden sm:flex ml-auto items-center gap-6 text-sm sm:text-base font-medium">
            <a href="/" className="hover:text-amber-600 transition">
              Home
            </a>
            <a href="/#services" className="hover:text-amber-600 transition">
              Services
            </a>
            <a href="/#about" className="hover:text-amber-600 transition">
              About
            </a>
            <a href="/#reviews" className="hover:text-amber-600 transition">
              Reviews
            </a>
            <a href="/calculator" className="hover:text-amber-600 transition">
              Calculators
            </a>
            <a href="/#contact" className="hover:text-amber-600 transition">
              Contact
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="text-black focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="sm:hidden bg-white px-4 pb-4 flex flex-col gap-4 text-base font-medium shadow-md">
            <a
              href="/"
              className="hover:text-amber-600 transition"
              onClick={toggleMenu}
            >
              Home
            </a>
            <a
              href="/#services"
              className="hover:text-amber-600 transition"
              onClick={toggleMenu}
            >
              Services
            </a>
            <a
              href="/#about"
              className="hover:text-amber-600 transition"
              onClick={toggleMenu}
            >
              About
            </a>
            <a
              href="/#reviews"
              className="hover:text-amber-600 transition"
              onClick={toggleMenu}
            >
              Reviews
            </a>
            <a
              href="/calculator"
              className="hover:text-amber-600 transition"
              onClick={toggleMenu}
            >
              Calculators
            </a>
            <a
              href="/#contact"
              className="hover:text-amber-600 transition"
              onClick={toggleMenu}
            >
              Contact
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;