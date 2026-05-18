import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing! 🎉");
    setEmail("");
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1F1F1F] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="KickSphere"
                className="h-12 w-auto"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Link>
            <p className="text-[#A0A0A0] text-sm font-[Barlow] max-w-xs leading-relaxed mb-4">
              The ultimate destination for premium footwear. Authentic brands.
              Unbeatable style.
            </p>
            <div className="flex gap-3">
              {[
                {
                  label: "GitHub",
                  svg: (
                    <svg
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  ),
                  href: "https://github.com/jaypatel-tech116/KickSphere-Shoes-Ecommerce",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 bg-[#111] border border-[#1F1F1F] rounded-lg flex items-center justify-center text-[#A0A0A0] hover:text-white hover:border-[#E8000D] hover:bg-[#E8000D]/10 transition-all"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-[Bebas_Neue] text-white text-lg tracking-wider mb-4">
              COMPANY
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "Shop", to: "/collection" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-[#A0A0A0] hover:text-white text-sm font-[Barlow] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="font-[Bebas_Neue] text-white text-lg tracking-wider mb-4">
              NEWSLETTER
            </p>
            <p className="text-[#A0A0A0] text-sm font-[Barlow] mb-3">
              Get exclusive deals & style updates.
            </p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-[#111] border border-[#1F1F1F] rounded-lg px-3 py-2 text-white text-sm font-[Barlow] placeholder-[#A0A0A0] outline-none focus:border-[#E8000D] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#E8000D] hover:bg-[#FF1A1A] text-white text-sm font-semibold py-2 rounded-lg transition-colors font-[Barlow]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#1F1F1F] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#A0A0A0] text-sm font-[Barlow]">
            © 2025 KickSphere. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "UPI", "RazorPay"].map((p) => (
              <span
                key={p}
                className="text-[10px] font-[Barlow] text-[#A0A0A0] border border-[#1F1F1F] px-2 py-0.5 rounded"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
