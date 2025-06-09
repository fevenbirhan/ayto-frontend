import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/utils/motion";

export const Features = () => {
  const { theme } = useTheme();
  const { language } = useAuth();
  
  const features = [
    {
      icon: "📢",
      title: "Report Issues Easily",
      titleAm: "ችግሮችን በቀላሉ ሪፖርት ያድርጉ",
      description: "Quickly submit reports about road damage, faulty streetlights, or waste issues with photos and descriptions.",
      descriptionAm: "የመንገድ ጉዳት፣ የተበላሹ መብራቶች ወይም የቆሻሻ ችግሮችን ፎቶ እና መግለጫ በመጠቀም �ጠይቁ።",
    },
    {
      icon: "⚡",
      title: "Efficient Government Response",
      titleAm: "በፍጥነት የመንግስት ምላሽ",
      description: "Officials can manage, assign, and resolve reports efficiently, leading to quicker fixes and better services.",
      descriptionAm: "ባለስልጣኖች ሪፖርቶችን በትክክል ማስተናገድ፣ መመደብ እና መፍታት ይችላሉ።",
    },
    {
      icon: "🤝",
      title: "Community Engagement",
      titleAm: "የማህበረሰብ ተሳትፎ",
      description: "View and support reports from other residents, helping to highlight the most pressing issues in your area.",
      descriptionAm: "ከሌሎች �ዋሪዎች የተደረጉ ሪፖርቶችን ይመልከቱ �ና ይደግፉ።",
    },
  ];

  const isDark = theme === "dark";
  const titleText = language === "en" ? "Key Features" : "ዋና ዋና ባህሪያት";

  return (
    <section
      id="features"
      className={`w-full py-20 transition-colors duration-500 ${
        isDark ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-white to-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col items-center"
        >
          <motion.h2
            variants={fadeIn("up", "spring", 0.2, 1)}
            className={`text-5xl font-bold mb-16 text-center ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            {titleText}
            <span className="block w-20 h-1 mx-auto mt-4 rounded-full bg-emerald-500"></span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", "spring", index * 0.2, 0.75)}
                whileHover={{ y: -10 }}
                className={`p-8 rounded-3xl transition-all duration-500 ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-white hover:bg-gray-50 text-gray-800"
                } shadow-xl hover:shadow-2xl border ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">
                  {language === "en" ? feature.title : feature.titleAm}
                </h3>
                <p className="text-lg opacity-90">
                  {language === "en" ? feature.description : feature.descriptionAm}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};