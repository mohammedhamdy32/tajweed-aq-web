import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionCardProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  number: number;
  selectedAnswer: number | null;
  onAnswerSelect: (answer: number) => void;
  showResult: boolean;
}

const QuestionCard = ({ 
  question, 
  options, 
  correctAnswer, 
  explanation,
  number, 
  selectedAnswer,
  onAnswerSelect,
  showResult
}: QuestionCardProps) => {
  return (
    <Card className="border-r-4 border-r-primary shadow-soft hover:shadow-medium transition-shadow" dir="rtl">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              showResult && selectedAnswer !== null
                ? selectedAnswer === correctAnswer
                  ? 'bg-green-100'
                  : 'bg-red-100'
                : 'bg-primary/10'
            }`}>
              <span className={`font-bold ${
                showResult && selectedAnswer !== null
                  ? selectedAnswer === correctAnswer
                    ? 'text-green-600'
                    : 'text-red-600'
                  : 'text-primary'
              }`}>{number}</span>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <h4 className="text-lg font-semibold text-foreground text-right">
              {question}
            </h4>
            
            <RadioGroup
              value={selectedAnswer?.toString() ?? ""}
              onValueChange={(value) => !showResult && onAnswerSelect(parseInt(value))}
              disabled={showResult}
              dir="rtl"
            >
              <div className="space-y-3">
                {options.map((option, index) => {
                  const isCorrect = index === correctAnswer;
                  const isSelected = selectedAnswer === index;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${
                        showCorrect
                          ? 'border-green-500 bg-green-50'
                          : showWrong
                          ? 'border-red-500 bg-red-50'
                          : isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`q${number}-opt${index}`}
                        className="mt-0.5 order-last"
                      />
                      <Label
                        htmlFor={`q${number}-opt${index}`}
                        className={`flex-1 cursor-pointer text-base leading-relaxed text-right ${
                          showResult ? 'cursor-default' : ''
                        }`}
                      >
                        {option}
                      </Label>
                      {showCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 order-first" />
                      )}
                      {showWrong && (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 order-first" />
                      )}
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            {showResult && explanation && (
              <div className="pr-7 pt-2">
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg border-r-2 border-r-primary/50 text-right">
                  <strong>الشرح:</strong> {explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;