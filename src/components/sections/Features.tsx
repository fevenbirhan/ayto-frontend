export const Features = () => {
  const features = [
    {
      icon: "📢",
      title: "Report Issues Easily",
      description:
        "Quickly submit reports about road damage, faulty streetlights, or waste issues with photos and descriptions.",
    },
    {
      icon: "⚡",
      title: "Efficient Government Response",
      description:
        "Officials can manage, assign, and resolve reports efficiently, leading to quicker fixes and better services.",
    },
    {
      icon: "🤝",
      title: "Community Engagement",
      description:
        "View and support reports from other residents, helping to highlight the most pressing issues in your area.",
    },
  ];

  return (
    <section className="bg-[#0F172A] w-full py-16" id="features">
      <div className="max-w-none mx-auto px-6">
        <h2 className="text-[#255F38] text-[40px] font-bold mb-12">Features</h2>
        <div className="grid grid-cols-2 gap-12 max-md:grid-cols-1">
          {features.map((feature, index) => (
            <div key={index}>
              <h3 className="text-white text-[40px] font-bold mb-4">
                {feature.icon} {feature.title}
              </h3>
              <p className="text-white text-2xl font-bold">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
