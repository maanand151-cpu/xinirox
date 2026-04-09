import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Achievement {
  id: string;
  title: string;
  description: string | null;
}

const AboutAchievements = ({ achievements }: { achievements: Achievement[] }) => {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-transparent" />
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-4 text-gradient-gold">
          Achievements
        </h2>
        <div className="divider-gold w-24 mx-auto mb-10" />

        <div className="grid gap-4">
          {achievements.map((a, i) => (
            <Card key={a.id} className="card-luxury group">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{a.title}</p>
                  {a.description && (
                    <p className="text-sm text-muted-foreground font-light">{a.description}</p>
                  )}
                </div>
                <span className="ml-auto text-2xl font-serif text-primary/20 font-bold select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutAchievements;
