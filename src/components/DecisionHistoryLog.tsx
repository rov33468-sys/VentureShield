import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, CheckCircle, AlertCircle, XCircle, Calendar, Loader2 } from "lucide-react";

type Prediction = {
  id: string;
  company_name: string | null;
  industry: string | null;
  summary: string | null;
  risk_score: number | null;
  risk_level: string | null;
  confidence: number | null;
  created_at: string;
};

const riskBadge = (level: string | null) => {
  switch (level) {
    case "low": return { color: "success" as const, icon: CheckCircle };
    case "medium": return { color: "warning" as const, icon: AlertCircle };
    case "high": return { color: "destructive" as const, icon: XCircle };
    default: return { color: "secondary" as const, icon: AlertCircle };
  }
};

const DecisionHistoryLog = () => {
  const [items, setItems] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("predictions")
        .select("id, company_name, industry, summary, risk_score, risk_level, confidence, created_at")
        .order("created_at", { ascending: false });
      if (!mounted) return;
      if (!error && data) setItems(data as Prediction[]);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const avgConfidence = items.length
    ? Math.round(items.reduce((a, b) => a + (b.confidence ?? 0), 0) / items.length)
    : 0;
  const lowRisk = items.filter((i) => i.risk_level === "low").length;
  const mediumRisk = items.filter((i) => i.risk_level === "medium").length;
  const highRisk = items.filter((i) => i.risk_level === "high").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Confidence</p>
                <p className="text-xl font-bold text-primary">{avgConfidence}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Risk</p>
                <p className="text-xl font-bold text-success">{lowRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Medium Risk</p>
                <p className="text-xl font-bold text-warning">{mediumRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <p className="text-xl font-bold text-destructive">{highRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Prediction History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin text-accent mx-auto" /></div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No predictions yet. Run an analysis to see results here.
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((p) => {
                const cfg = riskBadge(p.risk_level);
                const Icon = cfg.icon;
                return (
                  <div key={p.id} className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-accent" />
                        <div>
                          <h4 className="font-semibold">{p.company_name ?? "Untitled venture"}</h4>
                          <p className="text-sm text-muted-foreground">
                            {(p.industry ?? "General")} • {new Date(p.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={cfg.color as any} className="capitalize">
                        {p.risk_level ?? "unknown"} risk
                      </Badge>
                    </div>
                    {p.summary && (
                      <p className="text-sm text-muted-foreground mt-3">{p.summary}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Risk score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={p.risk_score ?? 0} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{p.risk_score ?? 0}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={p.confidence ?? 0} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{p.confidence ?? 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DecisionHistoryLog;
