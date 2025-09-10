import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TrendingUp, TrendingDown, Target, Download, RefreshCw, ArrowLeft, DollarSign, Clock, Users, Eye } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter } from "recharts";
import { useToast } from "@/hooks/use-toast";

interface SimulationReportsProps {
  decisionData: any;
  onBack: () => void;
  onRestart: () => void;
}

export function SimulationReports({ decisionData, onBack, onRestart }: SimulationReportsProps) {
  const { toast } = useToast();
  const [whatIfParams, setWhatIfParams] = useState({
    budget: 100,
    timeline: 100,
    team: 100,
    marketing: 100
  });

  const [scenarioResults, setScenarioResults] = useState({
    successRate: 68,
    roi: 145,
    timeToBreakeven: 8,
    marketShare: 12
  });

  const shortTermData = [
    { month: "Month 1", revenue: 15000, costs: 45000, profit: -30000, marketShare: 2 },
    { month: "Month 2", revenue: 28000, costs: 42000, profit: -14000, marketShare: 4 },
    { month: "Month 3", revenue: 45000, costs: 38000, profit: 7000, marketShare: 6 },
    { month: "Month 4", revenue: 62000, costs: 35000, profit: 27000, marketShare: 8 },
    { month: "Month 5", revenue: 78000, costs: 33000, profit: 45000, marketShare: 10 },
    { month: "Month 6", revenue: 95000, costs: 31000, profit: 64000, marketShare: 12 }
  ];

  const longTermData = [
    { year: "Year 1", revenue: 580000, profit: 125000, marketShare: 12, risk: 45 },
    { year: "Year 2", revenue: 1200000, profit: 380000, marketShare: 18, risk: 35 },
    { year: "Year 3", revenue: 1850000, profit: 720000, marketShare: 25, risk: 28 },
    { year: "Year 4", revenue: 2300000, profit: 980000, marketShare: 30, risk: 22 },
    { year: "Year 5", revenue: 2650000, profit: 1150000, marketShare: 33, risk: 18 }
  ];

  const opportunities = [
    {
      title: "Untapped SMB Market",
      description: "75% of small businesses in your region lack adequate solutions",
      potential: "High",
      effort: "Medium",
      revenue: "$2.3M",
      timeline: "6-12 months"
    },
    {
      title: "Partnership with RetailChain",
      description: "Major retail chain expressed interest in white-label solution",
      potential: "Very High",
      effort: "Low",
      revenue: "$5.1M",
      timeline: "3-6 months"
    },
    {
      title: "International Expansion",
      description: "European market shows 40% growth YoY with minimal competition",
      potential: "High",
      effort: "High",
      revenue: "$8.7M",
      timeline: "12-18 months"
    },
    {
      title: "AI-Enhanced Features",
      description: "Machine learning integration could differentiate from 90% of competitors",
      potential: "Medium",
      effort: "High",
      revenue: "$1.8M",
      timeline: "9-15 months"
    }
  ];

  const insights = [
    {
      priority: "Critical",
      insight: "Launch timing is crucial - delaying by 2 months reduces success probability by 23%",
      action: "Secure launch date within Q2 to maximize market opportunity"
    },
    {
      priority: "High",
      insight: "Customer acquisition cost can be reduced by 40% through content marketing strategy",
      action: "Allocate 30% of marketing budget to SEO and thought leadership content"
    },
    {
      priority: "Medium",
      insight: "Operational efficiency improves significantly after month 8 based on similar launches",
      action: "Plan for initial higher costs and ensure adequate cash flow for first 10 months"
    }
  ];

  const runWhatIfScenario = () => {
    // Simulate what-if analysis based on parameter changes
    const budgetImpact = (whatIfParams.budget - 100) * 0.3;
    const timelineImpact = (whatIfParams.timeline - 100) * 0.2;
    const teamImpact = (whatIfParams.team - 100) * 0.25;
    const marketingImpact = (whatIfParams.marketing - 100) * 0.35;

    const totalImpact = budgetImpact + timelineImpact + teamImpact + marketingImpact;

    setScenarioResults({
      successRate: Math.max(10, Math.min(95, 68 + totalImpact)),
      roi: Math.max(50, Math.min(300, 145 + totalImpact * 2)),
      timeToBreakeven: Math.max(3, Math.min(18, 8 - totalImpact * 0.1)),
      marketShare: Math.max(5, Math.min(25, 12 + totalImpact * 0.2))
    });

    toast({
      title: "Scenario Updated",
      description: "What-if analysis results have been recalculated based on your inputs"
    });
  };

  const exportReport = (format: string) => {
    toast({
      title: "Report Generated",
      description: `Your ${format.toUpperCase()} report is being prepared for download`
    });
  };

  const getPotentialColor = (potential: string) => {
    switch (potential.toLowerCase()) {
      case 'very high': return 'default';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Future Simulation & Reports
            </h1>
            <p className="text-muted-foreground mt-2">
              Scenario analysis and comprehensive reporting for: <span className="font-semibold">{decisionData?.projectName}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Competitor Analysis
            </Button>
            <Button onClick={onRestart} variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="simulation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulation">What-If Simulation</TabsTrigger>
          <TabsTrigger value="short-term">Short-Term Outlook</TabsTrigger>
          <TabsTrigger value="long-term">Long-Term Outlook</TabsTrigger>
          <TabsTrigger value="reports">Reports & Export</TabsTrigger>
        </TabsList>

        {/* What-If Simulation */}
        <TabsContent value="simulation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Scenario Parameters
                </CardTitle>
                <CardDescription>
                  Adjust inputs to see how changes affect your outcomes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4" />
                      Budget Adjustment: {whatIfParams.budget}%
                    </Label>
                    <Slider
                      value={[whatIfParams.budget]}
                      onValueChange={([value]) => setWhatIfParams(prev => ({ ...prev, budget: value }))}
                      min={50}
                      max={200}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      Timeline Adjustment: {whatIfParams.timeline}%
                    </Label>
                    <Slider
                      value={[whatIfParams.timeline]}
                      onValueChange={([value]) => setWhatIfParams(prev => ({ ...prev, timeline: value }))}
                      min={50}
                      max={200}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4" />
                      Team Size: {whatIfParams.team}%
                    </Label>
                    <Slider
                      value={[whatIfParams.team]}
                      onValueChange={([value]) => setWhatIfParams(prev => ({ ...prev, team: value }))}
                      min={50}
                      max={200}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4" />
                      Marketing Investment: {whatIfParams.marketing}%
                    </Label>
                    <Slider
                      value={[whatIfParams.marketing]}
                      onValueChange={([value]) => setWhatIfParams(prev => ({ ...prev, marketing: value }))}
                      min={50}
                      max={200}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button onClick={runWhatIfScenario} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recalculate Scenario
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scenario Results</CardTitle>
                <CardDescription>
                  Updated predictions based on your parameter changes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-success">{scenarioResults.successRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{scenarioResults.roi.toFixed(0)}%</div>
                    <div className="text-sm text-muted-foreground">Expected ROI</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-accent">{scenarioResults.timeToBreakeven.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Months to Breakeven</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-warning">{scenarioResults.marketShare.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Market Share (Year 1)</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Impact Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Budget Impact:</span>
                      <span className={whatIfParams.budget > 100 ? "text-success" : "text-destructive"}>
                        {whatIfParams.budget > 100 ? "+" : ""}{((whatIfParams.budget - 100) * 0.3).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeline Impact:</span>
                      <span className={whatIfParams.timeline > 100 ? "text-success" : "text-destructive"}>
                        {whatIfParams.timeline > 100 ? "+" : ""}{((whatIfParams.timeline - 100) * 0.2).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team Impact:</span>
                      <span className={whatIfParams.team > 100 ? "text-success" : "text-destructive"}>
                        {whatIfParams.team > 100 ? "+" : ""}{((whatIfParams.team - 100) * 0.25).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Short-Term Outlook */}
        <TabsContent value="short-term" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                6-Month Projection
              </CardTitle>
              <CardDescription>
                Monthly revenue, costs, and market share predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={shortTermData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      typeof value === 'number' ? `$${value.toLocaleString()}` : value,
                      name
                    ]} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} name="Revenue" />
                    <Line type="monotone" dataKey="costs" stroke="hsl(var(--destructive))" strokeWidth={2} name="Costs" />
                    <Line type="monotone" dataKey="profit" stroke="hsl(var(--primary))" strokeWidth={2} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Share Growth</CardTitle>
                <CardDescription>
                  Progressive market penetration over 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={shortTermData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, "Market Share"]} />
                      <Area type="monotone" dataKey="marketShare" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hidden Opportunities</CardTitle>
                <CardDescription>
                  Potential revenue streams and partnerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities.slice(0, 2).map((opportunity, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{opportunity.title}</h4>
                        <Badge variant={getPotentialColor(opportunity.potential)}>
                          {opportunity.potential}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{opportunity.description}</p>
                      <div className="flex justify-between text-xs">
                        <span>Revenue: {opportunity.revenue}</span>
                        <span>Timeline: {opportunity.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Long-Term Outlook */}
        <TabsContent value="long-term" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                5-Year Strategic Outlook
              </CardTitle>
              <CardDescription>
                Long-term sustainability, growth trajectory, and risk evolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={longTermData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'revenue' || name === 'profit' 
                        ? `$${(value as number).toLocaleString()}` 
                        : `${value}%`,
                      name
                    ]} />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="Revenue" />
                    <Area type="monotone" dataKey="profit" stackId="2" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.5} name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Evolution</CardTitle>
                <CardDescription>
                  How business risks change over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={longTermData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, "Risk Level"]} />
                      <Line type="monotone" dataKey="risk" stroke="hsl(var(--warning))" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Opportunities</CardTitle>
                <CardDescription>
                  Complete opportunity landscape
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {opportunities.map((opportunity, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{opportunity.title}</h4>
                        <Badge variant={getPotentialColor(opportunity.potential)} className="text-xs">
                          {opportunity.potential}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{opportunity.description}</p>
                      <div className="flex justify-between text-xs">
                        <span>Revenue: {opportunity.revenue}</span>
                        <span>Effort: {opportunity.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports & Export */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Reports
                </CardTitle>
                <CardDescription>
                  Generate comprehensive business reports for stakeholders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => exportReport('pdf')} variant="outline" className="h-12">
                    <div className="text-center">
                      <Download className="h-4 w-4 mx-auto mb-1" />
                      <span className="text-xs">PDF Report</span>
                    </div>
                  </Button>
                  <Button onClick={() => exportReport('excel')} variant="outline" className="h-12">
                    <div className="text-center">
                      <Download className="h-4 w-4 mx-auto mb-1" />
                      <span className="text-xs">Excel Data</span>
                    </div>
                  </Button>
                  <Button onClick={() => exportReport('powerpoint')} variant="outline" className="h-12">
                    <div className="text-center">
                      <Download className="h-4 w-4 mx-auto mb-1" />
                      <span className="text-xs">PowerPoint</span>
                    </div>
                  </Button>
                  <Button onClick={() => exportReport('csv')} variant="outline" className="h-12">
                    <div className="text-center">
                      <Download className="h-4 w-4 mx-auto mb-1" />
                      <span className="text-xs">CSV Data</span>
                    </div>
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Report Includes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Executive summary with key findings</li>
                    <li>• Detailed risk analysis and mitigation strategies</li>
                    <li>• Competitor intelligence and counter-strategies</li>
                    <li>• Financial projections and scenario analysis</li>
                    <li>• Opportunity identification and recommendations</li>
                    <li>• Implementation timeline and milestones</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Key Insights & Recommendations
                </CardTitle>
                <CardDescription>
                  Actionable business intelligence from your analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(insight.priority) as any} className="text-xs">
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{insight.insight}</p>
                      <p className="text-xs text-muted-foreground">{insight.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}