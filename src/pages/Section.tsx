import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sections } from "@/data/sections";
import { getRandomQuestions } from "@/utils/qaLoader";
import { loadSectionContent } from "@/utils/contentLoader";
import QuestionCard from "@/components/QuestionCard";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { RefreshCw, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [contentHtml, setContentHtml] = useState<string>("");
  const [showQuiz, setShowQuiz] = useState(false);
  const { toast } = useToast();

  const section = sections.find((s) => s.id === sectionId);

  const loadQuestions = async () => {
    if (!sectionId) return;
    
    setLoading(true);
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
    loadContent();
    setShowQuiz(false);
  }, [sectionId]);

  const handleStartQuiz = () => {
    setShowQuiz(true);
    loadQuestions();
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToContent = () => {
    setShowQuiz(false);
    setUserAnswers([]);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerSelect = (questionIndex: number, answer: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const calculateScore = () => {
    return userAnswers.reduce((acc, answer, index) => {
      if (answer === null) return acc;
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const answeredCount = userAnswers.filter(a => a !== null).length;

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

      {/* Explanation Section - Only shows when quiz is NOT active */}
      {!showQuiz && (
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  الشرح
                </h2>
              </div>
              
              {/* <div className="bg-card rounded-xl p-8 shadow-medium border-2"> */}
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
              {/* </div> */}

              {/* Test Yourself Button */}
              {contentHtml && (
                <div className="mt-8 text-center">
                  <Button
                    onClick={handleStartQuiz}
                    size="lg"
                    className="gap-2 text-lg px-8 py-6"
                  >
                    اختبر نفسك
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Questions Section - Only shows when quiz is active */}
      {showQuiz && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back to Content Button */}
              <div className="mb-6">
                <Button
                  onClick={handleBackToContent}
                  variant="outline"
                  className="gap-2"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  العودة للشرح
                </Button>
              </div>

              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    الأسئلة والأجوبة
                  </h2>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    {questions.length} أسئلة
                  </span>
                </div>
                
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

              {/* Score Display - Shows as you answer */}
              {answeredCount > 0 && (
                <div className="mb-6 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">النتيجة الحالية</h3>
                      <p className="text-muted-foreground">
                        أجبت على {answeredCount} من {questions.length} سؤال • 
                        إجابات صحيحة: {calculateScore()}
                      </p>
                    </div>
                    {answeredCount === questions.length && (
                      <div className="text-5xl font-bold text-primary">
                        {Math.round((calculateScore() / questions.length) * 100)}%
                      </div>
                    )}
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
                      showResult={userAnswers[index] !== null}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Section;