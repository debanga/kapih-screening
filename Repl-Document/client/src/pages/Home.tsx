import { AssessmentCard } from "@/components/AssessmentCard";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4 md:p-8 relative">
      {/* Abstract Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-full blur-3xl opacity-60 -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-gray-100 to-indigo-50/30 rounded-full blur-3xl opacity-60 translate-y-1/3" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <AssessmentCard />
        
        <footer className="mt-8 text-center text-xs text-muted-foreground font-mono opacity-50">
          SECURE ASSESSMENT ENVIRONMENT • ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
