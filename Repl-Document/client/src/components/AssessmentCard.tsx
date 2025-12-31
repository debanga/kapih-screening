import { useState, useEffect, useRef } from "react";
import { useCreateSubmission } from "@/hooks/use-submissions";
import { useLocation } from "wouter";
import { Loader2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// The assessment question to be progressively revealed
const QUESTION_TEXT = "What is the time complexity of binary search algorithm?";
const QUESTION_WORDS = QUESTION_TEXT.split(" ");

export function AssessmentCard() {
  const [, setLocation] = useLocation();
  const createSubmission = useCreateSubmission();
  const [answer, setAnswer] = useState("");
  
  // Tracking State
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const hoveredIndicesRef = useRef<Set<number>>(new Set());
  const mouseMovesRef = useRef(0);
  const startTimeRef = useRef<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Track Mouse Moves globally
  useEffect(() => {
    const handleMouseMove = () => {
      mouseMovesRef.current += 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 2. Handle Word Reveal on Hover
  const handleWordHover = (index: number) => {
    hoveredIndicesRef.current.add(index);
    setVisibleIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  // 2b. Handle Word Hide on Leave
  const handleWordLeave = (index: number) => {
    setVisibleIndices((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  // 3. Calculate Risk & Submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const endTime = Date.now();
    const timeSpentSeconds = Math.floor((endTime - startTimeRef.current) / 1000);
    const mouseMoves = mouseMovesRef.current;
    const hoverCount = hoveredIndicesRef.current.size;
    const totalWords = QUESTION_WORDS.length;

    // Risk Score Logic
    let riskScore = 0;
    if (mouseMoves < 100) riskScore += 0.4;
    if (hoverCount < totalWords) riskScore += 0.3;
    if (answer.length > 150 && timeSpentSeconds < 30) riskScore += 0.4;
    
    // Cap at 1.0
    riskScore = Math.min(riskScore, 1.0);

    try {
      await createSubmission.mutateAsync({
        answer,
        timeSpentSeconds,
        mouseMoves,
        hoverCount,
        riskScore,
      });
      // Redirect to results page on success
      setLocation("/results");
    } catch (error) {
      console.error("Submission failed", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-white shadow-xl shadow-black/5 border border-border/60 overflow-hidden">
      {/* Header Section */}
      <div className="bg-secondary/30 border-b border-border/50 p-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-widest">
            Assessment Module 1.0
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/5 text-primary">
            Active Session
          </span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
          Please answer the question below carefully.
        </h1>
        <p className="text-muted-foreground text-sm">
          Hover over the hidden text to reveal the question. We monitor interaction patterns for quality assurance.
        </p>
      </div>

      {/* Interactive Question Section */}
      <div className="p-8 md:p-10 space-y-10">
        <div 
          className="p-6 rounded-xl bg-secondary/20 border border-secondary border-dashed text-xl md:text-2xl font-medium leading-relaxed text-center min-h-[120px] flex items-center justify-center flex-wrap gap-x-2"
          aria-label="Interactive question area"
        >
          {QUESTION_WORDS.map((word, index) => (
            <span
              key={index}
              onMouseEnter={() => handleWordHover(index)}
              onMouseLeave={() => handleWordLeave(index)}
              className={`
                reveal-word transition-colors duration-500 ease-out
                ${visibleIndices.has(index) ? 'reveal-word-visible' : 'reveal-word-hidden'}
              `}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Answer Input */}
        <div className="space-y-4">
          <label htmlFor="answer" className="block text-sm font-semibold text-foreground">
            Your Answer
          </label>
          <Textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your explanation here..."
            className="min-h-[200px] resize-none text-base p-4 rounded-xl border-border bg-background focus:ring-1 focus:ring-primary/10 transition-shadow"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
            <span>{answer.length} characters</span>
            <span>Ref: {startTimeRef.current}</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4 border-t border-border/50">
          <Button 
            onClick={handleSubmit} 
            disabled={!answer.trim() || isSubmitting}
            className="px-8 py-6 rounded-full text-base font-medium shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Submit Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
