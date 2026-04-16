import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  MessageSquareText,
  Briefcase,
} from "lucide-react";

type Emotion = { emotion: string; intensity: number };
type KeyPhrase = { phrase: string; sentiment: "positive" | "neutral" | "negative" };

interface SentimentResult {
  overall_sentiment: string;
  confidence: number;
  emotions: Emotion[];
  key_phrases: KeyPhrase[];
  summary: string;
  business_implications: string;
}

const SENTIMENT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sentiment`;

const sentimentConfig: Record<string, { label: string; color: string; icon: typeof TrendingUp }> = {
  very_positive: { label: "Very Positive", color: "text-emerald-500", icon: TrendingUp },
  positive: { label: "Positive", color: "text-green-500", icon: TrendingUp },
  neutral: { label: "Neutral", color: "text-muted-foreground", icon: Minus },
  negative: { label: "Negative", color: "text-orange-500", icon: TrendingDown },
  very_negative: { label: "Very Negative", color: "text-destructive", icon: TrendingDown },
};

export function SentimentAnalysis() {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);

  const analyze = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("You must be logged in");

      const resp = await fetch(SENTIMENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || `Analysis failed (${resp.status})`);
      }

      const data: SentimentResult = await resp.json();
      setResult(data);
    } catch (e: any) {
      toast({ title: "Analysis Error", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const config = result ? sentimentConfig[result.overall_sentiment] || sentimentConfig.neutral : null;
  const SentimentIcon = config?.icon || Minus;

  return (
    <div className="space-y-6">
      {/* Input */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-accent" />
            Sentiment Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Paste customer reviews, market news, social media posts, or any text to analyze sentiment and business implications.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text here to analyze sentiment... (e.g., customer feedback, market reports, news articles)"
            className="min-h-[120px] bg-secondary/50 border-border/50"
            maxLength={5000}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{text.length}/5000 characters</span>
            <Button
              onClick={analyze}
              disabled={isLoading || !text.trim()}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Sentiment
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && config && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Sentiment */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <SentimentIcon className={`h-5 w-5 ${config.color}`} />
                Overall Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <span className={`text-3xl font-bold ${config.color}`}>{config.label}</span>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emotions */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Detected Emotions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.emotions.map((em) => (
                <div key={em.emotion} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{em.emotion}</span>
                    <span className="text-muted-foreground">{em.intensity}%</span>
                  </div>
                  <Progress value={em.intensity} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Key Phrases */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-accent" />
                Key Phrases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.key_phrases.map((kp, i) => (
                  <Badge
                    key={i}
                    variant={kp.sentiment === "positive" ? "default" : kp.sentiment === "negative" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {kp.phrase}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Business Implications */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-accent" />
                Business Implications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.business_implications}</p>
            </CardContent>
          </Card>

          {/* Summary - full width */}
          <Card className="border-primary/20 md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
