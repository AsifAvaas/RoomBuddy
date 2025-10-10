import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  Home as HomeIcon,
  DollarSign,
  Shield,
  Wifi,
  Zap,
  Users,
  MapPin,
  CheckCircle,
  Star,
  ArrowRight,
  Clock,
  CreditCard,
  Sparkles,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <HomeIcon className="w-6 h-6" />,
      title: "Comfortable Rooms",
      description:
        "Fully furnished rooms with modern amenities for your comfort",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Affordable Pricing",
      description: "Flexible payment options with competitive monthly rates",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe & Secure",
      description: "24/7 security and surveillance for your peace of mind",
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "High-Speed WiFi",
      description: "Free unlimited high-speed internet connectivity",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "All Utilities Included",
      description:
        "No hidden costs - electricity, water, and maintenance included",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Living",
      description: "Meet like-minded people in a friendly environment",
    },
  ];

  const paymentFeatures = [
    {
      icon: <Clock className="w-5 h-5" />,
      text: "Flexible monthly payments",
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      text: "Pay with cash or online via Stripe",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "No long-term commitments",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      content:
        "Best decision I made! The rooms are spacious, clean, and the community is amazing. Highly recommend!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Graduate Student",
      content:
        "Affordable, convenient, and hassle-free. The online payment system makes everything so easy.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Marketing Manager",
      content:
        "Love the flexibility and the amenities. Feels like home away from home!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                Your Perfect Living Space Awaits
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your Ideal
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Paying Guest Room
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Comfortable, affordable, and fully furnished rooms with flexible
              payment options. Your home away from home starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/available-rooms")}
                className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center"
              >
                Browse Available Rooms
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>

              <button
                onClick={() => navigate("/about")}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-200"
              >
                Learn More
              </button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
              {paymentFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
                >
                  {feature.icon}
                  <span className="ml-2">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need for a comfortable and hassle-free
              stay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Options Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Flexible Payment Options
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Pay your monthly rent the way you prefer - with cash or securely
                online through Stripe. No hidden fees, no complications.
              </p>

              <div className="space-y-4">
                <div className="flex items-start bg-white p-4 rounded-xl shadow-md">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Cash Payment
                    </h4>
                    <p className="text-gray-600">
                      Pay directly at the property office
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-white p-4 rounded-xl shadow-md">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <CreditCard className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Online Payment
                    </h4>
                    <p className="text-gray-600">
                      Secure payments via Stripe with any card
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6">
                  <p className="text-sm font-medium mb-2">Monthly Rent</p>
                  <p className="text-4xl font-bold">Starting at $299</p>
                  <p className="text-sm mt-2 text-blue-100">
                    All utilities included
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    "Furnished room",
                    "High-speed WiFi",
                    "24/7 security",
                    "Utilities included",
                    "Maintenance support",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-700"
                    >
                      <CheckCircle
                        className="text-green-500 mr-3 flex-shrink-0"
                        size={20}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/available-rooms")}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  View Available Rooms
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Guests Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-current"
                      size={20}
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Perfect Room?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Browse available rooms and book your spot today. It's quick, easy,
            and hassle-free!
          </p>

          <button
            onClick={() => navigate("/available-rooms")}
            className="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 inline-flex items-center"
          >
            Get Started Now
            <ArrowRight className="ml-2" size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}

      <Footer />

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Home;
