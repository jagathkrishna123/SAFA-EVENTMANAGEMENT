import React from "react";
import { BsMailbox } from "react-icons/bs";
import {  FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { SlSocialInstagram } from "react-icons/sl";
import Logo2 from "../../assets/logo2.png";



export default function FooterContents() {
  return (
    <footer className=" text-white py-10 mt-10 font-out">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center w-[150px] h-[48px]">
  <div className="flex items-center h-[44px]">
    <img src={Logo2} alt="Logo" className="w-[32px]" />
  </div>

  <div className="flex items-center justify-center ml-2">
    <h2 className="font-sans font-bold text-white text-[18px]">
      DOCKET
    </h2>
  </div>
</div>

          <p className="text-gray-300 text-sm leading-relaxed">
            Empowering students with technology, innovation, and learning.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Events</a></li>
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
          <p className="text-gray-300 text-sm mb-4 flex items-center gap-2">
            <MdEmail size={18} /> docet@gmail.com
          </p>

          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-400"><FaFacebook/></a>
            <a href="#" className="hover:text-pink-400"><SlSocialInstagram /></a>
            <a href="#" className="hover:text-blue-300"><FaLinkedin/></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} DOCKET. All Rights Reserved.
      </div>
    </footer>
  );
}