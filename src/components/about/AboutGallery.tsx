import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
}

const AboutGallery = ({ gallery }: { gallery: GalleryImage[] }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-4 text-gradient-gold">
          Gallery
        </h2>
        <div className="divider-gold w-24 mx-auto mb-10" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {gallery.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="aspect-square rounded-xl overflow-hidden border border-border/30 cursor-pointer card-hover group"
            >
              <img
                src={img.image_url}
                alt={img.caption || "Gallery image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="bg-card border-border/50 max-w-3xl p-2 sm:p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {selectedImage && (
            <div>
              <img
                src={selectedImage.image_url}
                alt={selectedImage.caption || "Gallery image"}
                className="w-full rounded-lg object-contain max-h-[80vh]"
              />
              {selectedImage.caption && (
                <p className="text-center text-sm text-muted-foreground mt-3">{selectedImage.caption}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AboutGallery;
