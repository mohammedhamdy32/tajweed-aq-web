import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sections } from "@/data/sections";
import { getRandomQuestions } from "@/utils/qaLoader";
import QuestionCard from "@/components/QuestionCard";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { RefreshCw, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QA {
  id: number;
  question: string;
  answer: string;
}

const Section = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [questions, setQuestions] = useState<QA[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const section = sections.find((s) => s.id === sectionId);

  const loadQuestions = async () => {
    if (!sectionId) return;
    
    setLoading(true);
    try {
      const randomQuestions = await getRandomQuestions(sectionId);
      setQuestions(randomQuestions);
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

  useEffect(() => {
    loadQuestions();
  }, [sectionId]);

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
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  هنا يمكنك إضافة الشرح التفصيلي لهذا القسم. يمكن تخزين محتوى الشرح في ملف HTML/CSS منفصل وعرضه هنا.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mt-4">
                  لإضافة المحتوى، قم بتحرير الملف المخصص للشرح في المجلد <code className="text-primary">src/content/sections/{sectionId}.html</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
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
                className="gap-2"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                أسئلة جديدة
              </Button>
            </div>

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
                    answer={qa.answer}
                    number={index + 1}
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
