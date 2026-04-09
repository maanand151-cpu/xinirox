import { BadgeCheck, User } from "lucide-react";

interface Props {
  profile: {
    full_name: string;
    tagline: string;
    profile_image_url: string | null;
    is_verified: boolean;
  } | null | undefined;
}

const AboutProfile = ({ profile }: Props) => {
  if (!profile) return null;

  return (
    <div className="flex flex-col items-center text-center">
      {/* Profile Image */}
      <div className="relative mb-6">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-primary/30 glow-gold">
          {profile.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt={profile.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <User className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
        {/* Gold ring */}
        <div className="absolute inset-0 rounded-full border border-primary/10 scale-110" />
      </div>

      {/* Name */}
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gradient-gold mb-2">
        {profile.full_name}
      </h2>

      {/* Verified Badge */}
      <div className="flex items-center gap-1.5 mb-3">
        {profile.is_verified ? (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            <BadgeCheck className="w-4 h-4" /> Verified
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Not Verified</span>
        )}
      </div>

      {/* Tagline */}
      <p className="text-lg text-muted-foreground font-light max-w-md">
        {profile.tagline}
      </p>
    </div>
  );
};

export default AboutProfile;
