import copy from "../assets/Footer/image.png";
import { Facebook, Instagram, Twitter, Youtube, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#eeecdd] -z-10 text-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start space-y-2">
            <img src={copy} alt="Logo" className="w-20 h-auto" />
            <p className="text-black">
              Turning surplus food into nourishment and hope, ensuring every
              meal finds a home and no food goes to waste
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">Quick Links</h2>
            <ul className="mt-2 space-y-2 text-gray-400">
              <li>
                <a href="/" className="text-black">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-black">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-black">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-black">Contact</h2>
            <p className="mt-2 text-black flex items-center">
              <i className="fas fa-map-marker-alt mr-2 text-black"></i>
              4671 Sugar Camp Road, Owatonna, Minnesota, 55060
            </p>
            <p className="mt-2 text-black flex items-center">
              <i className="fas fa-envelope mr-2 text-black"></i>
              example@email.com
            </p>
            <p className="mt-2 text-black flex items-center">
              <i className="fas fa-phone mr-2 text-black"></i>
              561-456-2321
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Social</h2>
            <div className="flex space-x-4 text-gray-900 text-2xl">
              <Facebook className="hover:text-blue-600 cursor-pointer" />
              <Instagram className="hover:text-pink-600 cursor-pointer" />
              <Twitter className="hover:text-blue-400 cursor-pointer" />
              <Youtube className="hover:text-red-600 cursor-pointer" />
              <Github className="hover:text-blue-700 cursor-pointer" />{" "}
            </div>
          </div>
        </div>

        <div className="w-full border-t border-gray-400 mt-4 pt-2 text-center text-sm text-gray-600">
          © 2023 All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
