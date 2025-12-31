import { useSubmissions } from "@/hooks/use-submissions";
import { Link } from "wouter";
import { Loader2, ArrowLeft, AlertTriangle, CheckCircle, Clock, MousePointer2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Results() {
  const { data: submissions, isLoading, isError } = useSubmissions();

  // Get the most recent submission (the one just created)
  const latestSubmission = submissions && submissions.length > 0 
    ? submissions[submissions.length - 1] 
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          <p className="font-mono text-sm">Retrieving assessment data...</p>
        </div>
      </div>
    );
  }

  if (isError || !latestSubmission) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-display">No Submission Found</h2>
          <p className="text-muted-foreground">Could not retrieve the assessment results.</p>
          <Link href="/">
            <Button variant="outline" className="mt-4">Return Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isHighRisk = latestSubmission.riskScore > 0.5;

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] p-4 md:p-12 lg:p-20">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation */}
        <Link href="/">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start New Assessment
          </Button>
        </Link>

        {/* Main Result Header */}
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold text-foreground">Assessment Complete</h1>
          <p className="text-muted-foreground text-lg">Your response has been recorded and analyzed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 shadow-sm border border-border/60">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Your Answer</h3>
              <div className="prose prose-sm max-w-none text-foreground leading-relaxed p-6 bg-secondary/10 rounded-xl border border-secondary/50">
                {latestSubmission.answer}
              </div>
            </Card>

            <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
               <div className="p-4 bg-secondary/20 border-b border-border/50">
                  <h3 className="font-mono text-sm font-medium">Full Submission Log</h3>
               </div>
               <div className="max-h-60 overflow-y-auto p-4 bg-slate-50">
                 <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap">
                   {JSON.stringify(latestSubmission, null, 2)}
                 </pre>
               </div>
            </div>
          </div>

          {/* Sidebar Metrics Column */}
          <div className="space-y-6">
            
            {/* Risk Score Card */}
            <Card className={`p-6 border-l-4 shadow-sm ${isHighRisk ? 'border-l-destructive bg-destructive/5' : 'border-l-green-500 bg-green-50'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Risk Score</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${isHighRisk ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-700'}`}>
                  {isHighRisk ? 'Flagged' : 'Passed'}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-5xl font-display font-bold ${isHighRisk ? 'text-destructive' : 'text-green-600'}`}>
                  {latestSubmission.riskScore.toFixed(2)}
                </span>
                <span className="text-muted-foreground pb-2 mb-1">/ 1.0</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {isHighRisk 
                  ? "Anomalous behavior patterns detected during assessment session." 
                  : "Behavior patterns consistent with standard human interaction."}
              </p>
            </Card>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-4 flex items-center gap-4 hover:bg-secondary/20 transition-colors">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">{latestSubmission.timeSpentSeconds}s</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Time Spent</div>
                </div>
              </Card>

              <Card className="p-4 flex items-center gap-4 hover:bg-secondary/20 transition-colors">
                <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                  <MousePointer2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">{latestSubmission.mouseMoves}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Mouse Events</div>
                </div>
              </Card>

              <Card className="p-4 flex items-center gap-4 hover:bg-secondary/20 transition-colors">
                <div className="p-3 rounded-full bg-amber-50 text-amber-600">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">{latestSubmission.hoverCount}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Words Revealed</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
