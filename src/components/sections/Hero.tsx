
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="bg-[#27391C] w-full py-16">
      <div className="flex items-center justify-between max-w-none mx-auto px-6 max-md:flex-col max-md:gap-12">
        <div className="max-w-[656px]">
          <h1 className="text-white text-4xl mb-6">
            <span>Together, </span>
            <span className="text-[#18230F] font-bold text-[40px]">
              We Solve, Report
            </span>
            <span>, and Transform!</span>
          </h1>
          <p className="text-white text-[32px]">
            Empower your voice and transform your community. By sharing what you
            see, from road issues to power outages, you play a vital role in
            creating a better city. Together we can connect residents, officials
            and solutions to build a safer, cleaner, and more efficient city.
          </p>
          <div className="mt-12">
            <Button
              className="bg-[#6C7719] text-white text-4xl font-bold rounded px-8 py-3 hover:bg-[#5a6415]"
              size="lg"
              asChild
            >
              <Link to="/register">Get Started!</Link>
            </Button>
          </div>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd214360778a7736e0620f2ae92c1eaa012ec302"
          alt="City workers"
          className="w-[573px] h-[573px] rounded-[10px] border-[1px] border-[rgba(39,57,28,0.30)] opacity-50 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        />
      </div>
    </section>
  );
};
