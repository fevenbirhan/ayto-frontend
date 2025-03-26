
import { Link } from "react-router-dom";

export const Footer = () => {
  const socialIcons = [
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/528821648a6c765991ab4124851e9ded2233c273",
      alt: "Facebook",
      href: "https://facebook.com",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/20acb199e72c30ad78df728ad15491dd084534c7",
      alt: "Instagram",
      href: "https://instagram.com",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9574c8cd33b9097b0bdb1d769a1757fb6cb02eb4",
      alt: "Twitter",
      href: "https://twitter.com",
    },
  ];

  const handleFeatureClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "/#features") {
      e.preventDefault();
      const featuresSection = document.getElementById("features");
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-[#18230F] w-full py-12">
      <div className="max-w-none mx-auto px-6">
        <div className="flex justify-between max-md:flex-col max-md:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="text-2xl font-bold">
                <span className="text-[#255F38]">AY</span>
                <span className="text-white">TO</span>
              </div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/32879a82f401035b1aa9dea8ff6938eb1781a7dd"
                alt="Logo"
                className="w-[31px] h-[31px] rounded-[53px]"
              />
            </div>
            <div className="flex gap-4">
              {socialIcons.map((icon, index) => (
                <a
                  key={index}
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  aria-label={`Visit our ${icon.alt} page`}
                >
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    className="w-[20px] h-[20px]"
                  />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white text-2xl mb-4">Contacts</h3>
            <a
              href="tel:+251961236545"
              className="text-[#255F38] text-xl mb-2 block hover:text-white transition-colors"
            >
              +251 961236545
            </a>
            <a
              href="mailto:Name@gmail.com"
              className="text-[#255F38] text-xl block hover:text-white transition-colors"
            >
              Name@gmail.com
            </a>
          </div>

          <div>
            <h3 className="text-white text-2xl mb-4">Services</h3>
            <Link
              to="/"
              className="text-[#255F38] text-xl mb-2 block hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/#features"
              className="text-[#255F38] text-xl block hover:text-white transition-colors"
              onClick={(e) => handleFeatureClick(e, "/#features")}
            >
              Features
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
