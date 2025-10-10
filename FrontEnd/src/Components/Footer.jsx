import React from "react";
import { MapPin } from "lucide-react";
function Footer() {
  return (
    <>
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PG Rooms</h3>
              <p className="text-gray-400">
                Your trusted partner for comfortable paying guest
                accommodations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/available-rooms"
                    className="hover:text-white transition"
                  >
                    Available Rooms
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/faq" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>Dhaka, Bangladesh</span>
                </li>
                <li>Email: info@pgrooms.com</li>
                <li>Phone: +880 123 456789</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PG Rooms. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
