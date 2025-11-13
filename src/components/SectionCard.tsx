import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/data/sections";

interface SectionCardProps {
  section: Section;
}

const SectionCard = ({ section }: SectionCardProps) => {
  return (
    <Link to={`/section/${section.id}`}>
      <Card className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-4xl mb-3">{section.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                {section.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {section.description}
              </p>
            </div>
            <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SectionCard;
