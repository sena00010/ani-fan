import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Globe,
  Shield,
  CreditCard,
  Clock,
} from "lucide-react";

interface FooterProps {
  settings?: any; // Replace with your actual settings type
}

const Footer: React.FC<FooterProps> = ({ settings }) => {

  const quickLinks = [
    {
      name: "Sources",
      href: "/sources"
    },
    {
      name: "Brands",
      href: "/brands"
    },
    {
      name: "Products",
      href: "/product-price-matcher"
    },
    {
      name: "Promos",
      href: "/promos"
    },
    {
      name: "News",
      href: "/news"
    }
  ]

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent inline-block">
                MuscleConnect
              </h3>
              <p className="text-gray-400 mt-4 mb-6">
                {settings?.data.general_site_description || "Your ultimate destination for authentic sports equipment reviews and trusted retailer rankings."}
              </p>
              <div className="flex space-x-4">
                {settings?.data.social_facebook && (
                  <a
                    href={settings.data.social_facebook}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {settings?.data.social_twitter && (
                  <a
                    href={settings.data.social_twitter}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {settings?.data.social_instagram && (
                  <a
                    href={settings.data.social_instagram}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings?.data.social_youtube && (
                  <a
                    href={settings.data.social_youtube}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="h-px w-6 bg-blue-400"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <a
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-4 h-4 text-blue-400 transition-transform group-hover:translate-x-1" />
                      {item.name}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="h-px w-6 bg-purple-400"></span>
              Customer Service
            </h4>
            <ul className="space-y-3">
              {[
                "Help Center",
                "Returns & Refunds",
                "Shipping Information",
                "Size Guide",
                "Contact Us",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="/coming-soon"
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 text-purple-400 transition-transform group-hover:translate-x-1" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="h-px w-6 bg-blue-400"></span>
              Contact Information
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 group">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 group-hover:text-blue-300 transition-colors" />
                <span className="group-hover:text-white transition-colors">
                  info@muscleconnect.net
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {settings?.data?.general_copyright}. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {settings?.data?.pages?.map((page: any) => (
                <a
                  key={page.page_id}
                  href={`/page/${page.page_slug_url}`}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {page.page_name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
