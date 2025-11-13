import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sections } from "@/data/sections";
import { getRandomQuestions } from "@/utils/qaLoader";
import { loadSectionContent } from "@/utils/contentLoader";
import QuestionCard from "@/components/QuestionCard";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { RefreshCw, BookOpen, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QA {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const Section = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [questions, setQuestions] = useState<QA[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentHtml, setContentHtml] = useState<string>("");
  const { toast } = useToast();

  const section = sections.find((s) => s.id === sectionId);

  const loadQuestions = async () => {
    if (!sectionId) return;
    
    setLoading(true);
    setShowResults(false);
    try {
      const randomQuestions = await getRandomQuestions(sectionId);
      setQuestions(randomQuestions);
      setUserAnswers(new Array(randomQuestions.length).fill(null));
    } catch (error) {
      console.error("Error loading questions:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الأسئلة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    if (!sectionId) return;
    try {
      const html = await loadSectionContent(sectionId);
      setContentHtml(html);
    } catch (error) {
      console.error("Error loading content:", error);
    }
  };

  useEffect(() => {
    loadQuestions();
    loadContent();
  }, [sectionId]);

  const handleAnswerSelect = (questionIndex: number, answer: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const unanswered = userAnswers.filter(a => a === null).length;
    if (unanswered > 0) {
      toast({
        title: "تنبيه",
        description: `لم تجب على ${unanswered} سؤال/أسئلة`,
        variant: "destructive",
      });
      return;
    }
    setShowResults(true);
    
    const score = userAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    toast({
      title: "النتيجة",
      description: `لقد حصلت على ${score} من ${questions.length}`,
    });
  };

  const calculateScore = () => {
    return userAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  if (!section) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              القسم غير موجود
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Section Header */}
      <div className="gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">{section.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {section.title}
            </h1>
            <p className="text-xl text-white/90">
              {section.description}
            </p>
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                الشرح
              </h2>
            </div>
            
            <div className="bg-card rounded-xl p-8 shadow-medium border-2">
              {contentHtml ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                  className="prose prose-lg max-w-none"
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">جاري تحميل الشرح...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  الأسئلة والأجوبة
                </h2>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {questions.length} أسئلة
                </span>
              </div>
              
              <div className="flex gap-2">
                {!showResults && userAnswers.every(a => a !== null) && (
                  <Button
                    onClick={handleSubmit}
                    className="gap-2"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    عرض النتيجة
                  </Button>
                )}
                <Button
                  onClick={loadQuestions}
                  disabled={loading}
                  variant="outline"
                  className="gap-2"
                  size="sm"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  أسئلة جديدة
                </Button>
              </div>
            </div>

            {showResults && (
              <div className="mb-6 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">النتيجة النهائية</h3>
                    <p className="text-muted-foreground">
                      لقد أجبت بشكل صحيح على {calculateScore()} من {questions.length} سؤال
                    </p>
                  </div>
                  <div className="text-5xl font-bold text-primary">
                    {Math.round((calculateScore() / questions.length) * 100)}%
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-4">جاري تحميل الأسئلة...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((qa, index) => (
                  <QuestionCard
                    key={qa.id}
                    question={qa.question}
                    options={qa.options}
                    correctAnswer={qa.correctAnswer}
                    explanation={qa.explanation}
                    number={index + 1}
                    selectedAnswer={userAnswers[index]}
                    onAnswerSelect={(answer) => handleAnswerSelect(index, answer)}
                    showResult={showResults}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Section;
