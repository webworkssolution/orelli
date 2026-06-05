import FadeUp from "@/components/ui/FadeUp";

interface ProjectData {
  title: string;
  description: string;
  imageSrc: string;
}

interface FeaturedProjectProps {
  projects: ProjectData[];
}

export default function FeaturedProject({ projects }: FeaturedProjectProps) {
  if (projects.length === 0) return null;

  return (
    <section className="bg-background py-0">
      {projects.map((project, index) => (
        <div key={project.title}>
          <div
            className={`flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } w-full`}
          >
            <div className="w-full md:w-5/12 aspect-square md:aspect-auto">
              <img
                src={project.imageSrc}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-7/12 flex items-center p-8 md:px-16 md:py-12 lg:px-16">
              <FadeUp>
                <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-4">
                  FEATURED PROJECT
                </span>
                <h2 className="font-cormorant text-[clamp(28px,3vw,48px)] text-foreground mb-4 leading-tight">
                  {project.title}
                </h2>
                <p className="font-sans text-[15px] text-[#555] leading-[1.7] max-w-[480px] line-clamp-3">
                  {project.description}
                </p>
              </FadeUp>
            </div>
          </div>
          {index < projects.length - 1 && (
            <div className="w-full h-[1px] bg-border" />
          )}
        </div>
      ))}
    </section>
  );
}
