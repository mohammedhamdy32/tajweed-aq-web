import { sections } from "@/data/sections";
import SectionCard from "@/components/SectionCard";
import Header from "@/components/Header";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">تعلم بطريقة تفاعلية</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              أساسيات أحكام التجويد
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              تعلم أحكام التجويد بطريقة سهلة ومبسطة من خلال الشرح والأسئلة التفاعلية
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                ✅ شرح مفصل لكل قسم
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                ✅ أسئلة وأجوبة تفاعلية
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                ✅ سهل التحديث والإضافة
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                أقسام التجويد
              </h2>
              <p className="text-muted-foreground text-lg">
                اختر القسم الذي تريد تعلمه
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              © 2025 تعلم التجويد - جميع الحقوق محفوظة
            </p>
            <p className="text-xs mt-2">
              إعداد: م. محمود إبراهيم
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
