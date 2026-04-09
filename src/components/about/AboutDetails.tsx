import { Phone, Mail, MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  profile: {
    full_name: string;
    contact_number: string | null;
    email: string | null;
    address: string | null;
  };
}

const items = (p: Props["profile"]) => [
  { icon: User, label: "Full Name", value: p.full_name },
  { icon: Phone, label: "Contact", value: p.contact_number },
  { icon: Mail, label: "Email", value: p.email },
  { icon: MapPin, label: "Address", value: p.address },
];

const AboutDetails = ({ profile }: Props) => {
  const details = items(profile).filter((d) => d.value);
  if (details.length === 0) return null;

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-4 text-gradient-gold">
          Contact & Details
        </h2>
        <div className="divider-gold w-24 mx-auto mb-10" />

        <div className="grid sm:grid-cols-2 gap-4">
          {details.map((item) => (
            <Card key={item.label} className="card-luxury group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-foreground font-medium truncate">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutDetails;
