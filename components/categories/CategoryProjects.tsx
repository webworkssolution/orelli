"use client";

import { useState } from "react";
import { X } from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";

interface Project {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
}

interface CategoryProjectsProps {
  projects: Project[];
}

export default function CategoryProjects({ projects }: CategoryProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!projects || projects.length === 0) return null;

  return (
    <>
      <section className="py-12 px-6 md:px-12 bg-background">
        <FadeUp>
          <div className="w-full h-[1px] bg-border mb-16" />
          <h2 className="font-cormorant text-[clamp(28px,3vw,44px)] text-foreground mb-12">
            Related Projects
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, idx) => (
            <FadeUp key={project.id} delay={0.1 * (idx % 4)}>
              <div 
                className="group cursor-pointer flex flex-col gap-3"
                onClick={() => setSelectedProject(project)}
              >
                <div className="aspect-square bg-border overflow-hidden rounded-[4px] relative">
                  <img
                    src={project.imageSrc}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
                <h3 className="font-sans text-[16px] text-foreground font-medium uppercase tracking-[0.1em] group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          />
          
          {/* Modal Content */}
          <div className="bg-background relative w-full max-w-5xl max-h-[90vh] rounded-[8px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedProject(null)}
              title="Close project modal"
              aria-label="Close project modal"
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="w-full md:w-3/5 h-[40vh] md:h-auto bg-border relative">
              <img 
                src={selectedProject.imageSrc} 
                alt={selectedProject.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
              <span className="font-sans uppercase tracking-[0.12em] text-[13px] text-accent mb-4 block">
                Project Detail
              </span>
              <h3 className="font-cormorant text-3xl md:text-4xl text-foreground mb-6 leading-tight">
                {selectedProject.title}
              </h3>
              <div className="w-12 h-[1px] bg-border mb-6" />
              <p className="font-sans text-[16px] text-[#555] leading-[1.8] whitespace-pre-wrap">
                {selectedProject.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
