import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Prediction {
  id: string;
  company_name: string;
  industry: string;
  risk_score: number;
  confidence: number;
  summary: string;
  recommendations: string[];
  risk_level: string;
  created_at: string;
}

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast({
        title: "Failed to load history",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeVariant = (score: number): "destructive" | "default" | "secondary" => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'default';
    return 'secondary';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prediction History</CardTitle>
          <CardDescription>Your previous risk assessments will appear here</CardDescription>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            No predictions yet. Create your first risk assessment to get started.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction History</CardTitle>
        <CardDescription>View and analyze your previous risk assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Risk %</TableHead>
                <TableHead>Confidence %</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((prediction) => (
                <Collapsible
                  key={prediction.id}
                  open={expandedId === prediction.id}
                  onOpenChange={(open) => setExpandedId(open ? prediction.id : null)}
                  asChild
                >
                  <>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        {format(new Date(prediction.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">{prediction.company_name}</TableCell>
                      <TableCell>{prediction.industry}</TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(prediction.risk_score)}>
                          {prediction.risk_score}%
                        </Badge>
                      </TableCell>
                      <TableCell>{prediction.confidence}%</TableCell>
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {expandedId === prediction.id ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                View
                              </>
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/20">
                          <div className="py-4 space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Summary</h4>
                              <p className="text-sm text-muted-foreground">{prediction.summary}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Recommendations</h4>
                              <ul className="space-y-2">
                                {prediction.recommendations.map((rec, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                    <span className="text-primary font-semibold">{idx + 1}.</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
