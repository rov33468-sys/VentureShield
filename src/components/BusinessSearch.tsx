import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Globe, DollarSign, Users, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BusinessResult {
  name: string;
  industry: string;
  opportunity: string;
  marketSize: string;
  competition: string;
  investmentRange: string;
  growthPotential: "High" | "Medium" | "Low";
}

export function BusinessSearch() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BusinessResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);

    try {
      const { data, error } = await supabase.functions.invoke("business-search", {
        body: { query: query.trim() },
      });

      if (error) throw error;
      if (data?.results) {
        setResults(data.results);
      }
    } catch (e: any) {
      toast({ title: "Search failed", description: e.message, variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  const badgeColor = (level: string) => {
    switch (level) {
      case "High": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-accent/30 shadow-accent overflow-hidden">
        <CardHeader className="bg-accent/5 border-b border-accent/20">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <span className="text-foreground">Business Discovery Search</span>
              <p className="text-xs text-muted-foreground font-normal mt-0.5">
                Search industries, markets, and opportunities
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search e.g. "AI SaaS in healthcare" or "sustainable fashion"'
                className="pl-10 bg-secondary/50 border-border/50"
                disabled={isSearching}
              />
            </div>
            <Button type="submit" disabled={isSearching || !query.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((r, i) => (
            <Card key={i} className="border-border/50 hover:border-accent/40 transition-smooth group">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{r.name}</h3>
                  <Badge variant="outline" className={badgeColor(r.growthPotential)}>
                    {r.growthPotential} Growth
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{r.opportunity}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Globe className="h-3.5 w-3.5 text-accent/70" />
                    <span>{r.industry}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-accent/70" />
                    <span>{r.marketSize}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5 text-accent/70" />
                    <span>{r.competition}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5 text-accent/70" />
                    <span>{r.investmentRange}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Discovering business opportunities...</p>
        </div>
      )}
    </div>
  );
}
