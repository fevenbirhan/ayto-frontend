
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const GovernmentDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-[#27391C] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-white text-4xl font-bold mb-8">Government Dashboard</h1>
          <div className="bg-[#18230F] p-8 rounded-lg">
            <p className="text-white text-xl">
              Welcome to your government dashboard! Here you can manage reported issues, 
              assign tasks to departments, and track resolution progress.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GovernmentDashboard;
