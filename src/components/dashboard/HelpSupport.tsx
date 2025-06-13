import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp
} from "lucide-react";

export const HelpSupport = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const toggleFaq = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };
  
  const faqs = [
    {
      id: 1,
      question: "How do I submit a new report?",
      answer: "To submit a new report, click on the 'New Report' button at the top of your dashboard. Fill in the required information including the title, description, category, and location of the issue. You can also upload images or videos as evidence. Once you've completed the form, click 'Submit' to send your report to the municipality."
    },
    {
      id: 2,
      question: "What happens after I submit a report?",
      answer: "After submitting a report, it enters the 'Pending' status, indicating that it has been received but not yet reviewed by the municipality. Once reviewed, it will be updated to 'In Progress', 'Resolved', or 'Rejected' with an explanation. You'll receive notifications when your report status changes."
    },
    {
      id: 3,
      question: "Can I edit or delete my report?",
      answer: "Yes, you can edit or delete your report as long as it's still in the 'Pending' status. Once the municipality has started processing your report (status changed to 'In Progress'), you can no longer edit or delete it, but you can still add comments or additional information if requested."
    },
    {
      id: 4,
      question: "How does the voting system work?",
      answer: "The voting system allows residents to upvote reports that they consider urgent or important. Reports with more votes may be prioritized by the municipality for faster resolution. You can upvote a report by clicking the thumbs up icon on any report in the community reports section."
    },
    {
      id: 5,
      question: "How can I track the progress of my reports?",
      answer: "You can track all your submitted reports in the 'My Reports' tab. Each report shows its current status, and you can expand it to see more details including any feedback from the municipality. You'll also receive notifications when there are updates to your reports."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-[#2D2D2D] border-[#404040] text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Frequently Asked Questions</CardTitle>
          <HelpCircle className="h-5 w-5 text-[#3B82F6]" />
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className={`border-b border-[#404040] pb-4 ${
                faq.id === faqs.length ? "border-b-0 pb-0" : ""
              }`}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="flex justify-between items-center w-full text-left py-2"
              >
                <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                {expandedFaq === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-[#A3A3A3]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#A3A3A3]" />
                )}
              </button>
              
              {expandedFaq === faq.id && (
                <div className="mt-2 text-[#A3A3A3] text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
