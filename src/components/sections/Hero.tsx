import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const Hero = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (userRole === "GOVERNMENT_OFFICE") {
      navigate("/government-dashboard");
    } else if (userRole === "RESIDENT") {
      navigate("/resident-dashboard");
    }
  };

  return (
    <section className="bg-[#0F172A] w-full py-16">
      <div className="flex items-center justify-between max-w-none mx-auto px-6 max-md:flex-col max-md:gap-12">
        <div className="max-w-[656px]">
          <h1 className="text-white text-4xl mb-6">
            <span>Together, </span>
            <span className="text-[#3B82F6] font-bold text-[40px]">
              We Solve, Report
            </span>
            <span>, and Transform!</span>
          </h1>
          <p className="text-white/80 text-[32px]">
            Empower your voice and transform your community. By sharing what you
            see, from road issues to power outages, you play a vital role in
            creating a better city. Together we can connect residents, officials
            and solutions to build a safer, cleaner, and more efficient city.
          </p>
          <div className="mt-12">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 bg-[#3B82F6] text-white text-4xl font-bold rounded px-8 py-3 hover:bg-[#2563EB]"
            >
              Get Started!
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-end">
          {isAuthenticated && userRole && (
            <Button
              className="mb-4 bg-white text-[#6C7719] text-sm font-medium rounded px-4 py-2 hover:bg-gray-100"
              onClick={handleDashboardRedirect}
            >
              Dashboard
            </Button>
          )}

          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd214360778a7736e0620f2ae92c1eaa012ec302"
            alt="City workers"
            className="w-[573px] h-[573px] rounded-[10px] border-[1px] border-[rgba(59,130,246,0.30)] opacity-50 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          />
        </div>
      </div>
    </section>
  );
};
