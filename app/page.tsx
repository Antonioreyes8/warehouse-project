// app/page.tsx
import MissionSection from '../components/home/ManifestoSection';
import ProjectsSection from '../components/home/ProjectsSection';
import RulesSection from '../components/home/RulesSection';

export default function Page() {
  return (
    <>
      <MissionSection />
      <RulesSection />
      <ProjectsSection />
    </>
  );
}