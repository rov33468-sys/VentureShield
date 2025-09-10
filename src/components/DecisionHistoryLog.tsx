import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3,
  AlertCircle
} from "lucide-react";

const DecisionHistoryLog = () => {
  const decisionHistory = [
    {
      id: 1,
      decision: "Launch Premium Product Line",
      predictedOutcome: 78,
      actualOutcome: 85,
      status: "success",
      date: "2024-01-15",
      accuracy: 91,
      impact: "High",
      category: "Product Strategy"
    },
    {
      id: 2,
      decision: "Expand to European Market",
      predictedOutcome: 65,
      actualOutcome: 58,
      status: "partial",
      date: "2024-02-03",
      accuracy: 89,
      impact: "Medium",
      category: "Market Expansion"
    },
    {
      id: 3,
      decision: "Implement AI Customer Service",
      predictedOutcome: 72,
      actualOutcome: null,
      status: "pending",
      date: "2024-03-12",
      accuracy: null,
      impact: "Medium",
      category: "Operations"
    },
    {
      id: 4,
      decision: "Strategic Partnership with TechCorp",
      predictedOutcome: 45,
      actualOutcome: 23,
      status: "failure",
      date: "2024-01-28",
      accuracy: 49,
      impact: "High",
      category: "Partnerships"
    },
    {
      id: 5,
      decision: "Rebrand Company Identity",
      predictedOutcome: 68,
      actualOutcome: 76,
      status: "success",
      date: "2024-02-20",
      accuracy: 88,
      impact: "Low",
      category: "Marketing"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failure':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failure':
        return 'destructive';
      case 'partial':
        return 'warning';
      case 'pending':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getOutcomeTrend = (predicted: number, actual: number | null) => {
    if (actual === null) return null;
    const diff = actual - predicted;
    return diff > 0 ? 'up' : 'down';
  };

  const overallAccuracy = decisionHistory
    .filter(d => d.accuracy !== null)
    .reduce((acc, d) => acc + d.accuracy!, 0) / decisionHistory.filter(d => d.accuracy !== null).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Accuracy</p>
                <p className="text-xl font-bold text-primary">{Math.round(overallAccuracy)}%</p>
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
                <p className="text-sm font-medium text-muted-foreground">Successful Decisions</p>
                <p className="text-xl font-bold text-success">
                  {decisionHistory.filter(d => d.status === 'success').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Outcomes</p>
                <p className="text-xl font-bold text-warning">
                  {decisionHistory.filter(d => d.status === 'pending').length}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">Failed Predictions</p>
                <p className="text-xl font-bold text-destructive">
                  {decisionHistory.filter(d => d.status === 'failure').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decision History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Decision History & Outcomes</span>
            </CardTitle>
            <Button variant="outline" size="sm">
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {decisionHistory.map((decision) => (
              <div key={decision.id} className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(decision.status)}
                        <div>
                          <h4 className="font-semibold">{decision.decision}</h4>
                          <p className="text-sm text-muted-foreground">
                            {decision.category} • {new Date(decision.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(decision.status) as any} className="capitalize">
                        {decision.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Predicted Outcome</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={decision.predictedOutcome} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{decision.predictedOutcome}%</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Actual Outcome</p>
                        <div className="flex items-center space-x-2">
                          {decision.actualOutcome !== null ? (
                            <>
                              <Progress value={decision.actualOutcome} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{decision.actualOutcome}%</span>
                              <div className="flex items-center">
                                {getOutcomeTrend(decision.predictedOutcome, decision.actualOutcome) === 'up' ? (
                                  <TrendingUp className="h-3 w-3 text-success" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-destructive" />
                                )}
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground">Pending</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Prediction Accuracy</p>
                        <div className="flex items-center space-x-2">
                          {decision.accuracy !== null ? (
                            <>
                              <Progress value={decision.accuracy} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{decision.accuracy}%</span>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground">TBD</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Business Impact</p>
                        <Badge 
                          variant={decision.impact === 'High' ? 'destructive' : decision.impact === 'Medium' ? 'outline' : 'secondary'}
                          className="text-xs"
                        >
                          {decision.impact}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DecisionHistoryLog;