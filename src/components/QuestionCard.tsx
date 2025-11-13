import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface QuestionCardProps {
  question: string;
  answer: string;
  number: number;
}

const QuestionCard = ({ question, answer, number }: QuestionCardProps) => {
  return (
    <Card className="border-r-4 border-r-primary shadow-soft hover:shadow-medium transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">{number}</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-start gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <h4 className="text-lg font-semibold text-foreground">
                  {question}
                </h4>
              </div>
            </div>
            <div className="pr-7">
              <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                {answer}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
