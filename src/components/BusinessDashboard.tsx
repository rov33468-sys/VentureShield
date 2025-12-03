import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  Target,
  Lightbulb,
  Activity,
  Calendar
} from "lucide-react";
import { useState } from "react";
import RiskScoreGauge from "./RiskScoreGauge";
import RecommendationCards from "./RecommendationCards";

const BusinessDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6M");

  // Mock data for charts
  const successProbabilityData = [
    { month: 'Jan', probability: 65, confidence: 78 },
    { month: 'Feb', probability: 72, confidence: 82 },
    { month: 'Mar', probability: 68, confidence: 85 },
    { month: 'Apr', probability: 75, confidence: 88 },
    { month: 'May', probability: 82, confidence: 90 },
    { month: 'Jun', probability: 87, confidence: 92 }
  ];

  const financialProjections = [
    { month: 'Jan', revenue: 45000, costs: 32000, profit: 13000 },
    { month: 'Feb', revenue: 52000, costs: 35000, profit: 17000 },
    { month: 'Mar', revenue: 48000, costs: 33000, profit: 15000 },
    { month: 'Apr', revenue: 58000, costs: 38000, profit: 20000 },
    { month: 'May', revenue: 65000, costs: 41000, profit: 24000 },
    { month: 'Jun', revenue: 72000, costs: 43000, profit: 29000 }
  ];

  const riskDistribution = [
    { name: 'Financial', value: 25, color: '#ef4444' },
    { name: 'Market', value: 35, color: '#f97316' },
    { name: 'Operational', value: 20, color: '#eab308' },
    { name: 'Legal', value: 10, color: '#22c55e' },
    { name: 'Technical', value: 10, color: '#3b82f6' }
  ];

  const competitorStrengths = [
    { competitor: 'Competitor A', market_share: 35, threat_level: 85 },
    { competitor: 'Competitor B', market_share: 28, threat_level: 72 },
    { competitor: 'Competitor C', market_share: 15, threat_level: 45 },
    { competitor: 'Competitor D', market_share: 12, threat_level: 38 }
  ];

  const currentMetrics = {
    successProbability: 87,
    riskLevel: 32,
    expectedRevenue: 72000,
    marketPosition: 15
  };

  return (
    <div className="space-y-6">
      {/* Real-time Risk Score Gauges */}
      <Card className="bg-gradient-to-br from-background to-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Real-time Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <RiskScoreGauge score={currentMetrics.successProbability} label="Success Rate" size="md" />
            <RiskScoreGauge score={100 - currentMetrics.riskLevel} label="Safety Score" size="md" />
            <RiskScoreGauge score={78} label="Market Confidence" size="md" />
            <RiskScoreGauge score={85} label="Financial Health" size="md" />
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardContent className="pt-6">
          <RecommendationCards />
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Probability</p>
                <p className="text-2xl font-bold text-success">{currentMetrics.successProbability}%</p>
                <p className="text-xs text-success flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                <p className="text-2xl font-bold text-warning">{currentMetrics.riskLevel}%</p>
                <p className="text-xs text-success flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -8% reduced risk
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expected Revenue</p>
                <p className="text-2xl font-bold text-primary">${currentMetrics.expectedRevenue.toLocaleString()}</p>
                <p className="text-xs text-success flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% projected growth
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Market Position</p>
                <p className="text-2xl font-bold text-destructive">#{currentMetrics.marketPosition}</p>
                <p className="text-xs text-success flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Improved ranking
                </p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="predictions" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Live Data</span>
            </Badge>
            <div className="flex rounded-lg border">
              {['1M', '3M', '6M', '1Y'].map((period) => (
                <Button
                  key={period}
                  variant={selectedTimeframe === period ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(period)}
                  className="px-3"
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Success Probability Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span>Success Probability Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={successProbabilityData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="probability" 
                      stroke="hsl(var(--success))" 
                      fill="hsl(var(--success) / 0.1)"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.1)"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span>Risk Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {riskDistribution.map((risk) => (
                    <div key={risk.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: risk.color }}
                      />
                      <span className="text-sm">{risk.name}: {risk.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>Financial Projections</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={financialProjections}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="costs" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What-If Scenario Modeling</CardTitle>
              <p className="text-sm text-muted-foreground">
                Adjust parameters to see how changes affect your success probability
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Budget Adjustment</label>
                  <div className="space-y-2">
                    <Progress value={75} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$50K</span>
                      <span>Current: $75K</span>
                      <span>$100K</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium">Timeline</label>
                  <div className="space-y-2">
                    <Progress value={60} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>3 months</span>
                      <span>Current: 6 months</span>
                      <span>12 months</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium">Team Size</label>
                  <div className="space-y-2">
                    <Progress value={40} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>2 people</span>
                      <span>Current: 5 people</span>
                      <span>10 people</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Scenario Impact Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Probability</p>
                    <p className="text-lg font-semibold text-success">87% → 92%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className="text-lg font-semibold text-warning">32% → 28%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Strategy Map</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={competitorStrengths} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="competitor" type="category" className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="threat_level" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-warning" />
                  <span>Hidden Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-success pl-4 py-2">
                  <h4 className="font-semibold text-success">Emerging Market Segment</h4>
                  <p className="text-sm text-muted-foreground">AI identifies 23% growth potential in sustainable tech sector</p>
                  <Badge variant="outline" className="mt-2">High Impact</Badge>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold text-primary">Strategic Partnership</h4>
                  <p className="text-sm text-muted-foreground">3 potential partners with complementary strengths identified</p>
                  <Badge variant="outline" className="mt-2">Medium Impact</Badge>
                </div>
                
                <div className="border-l-4 border-warning pl-4 py-2">
                  <h4 className="font-semibold text-warning">Cost Optimization</h4>
                  <p className="text-sm text-muted-foreground">Automation could reduce operational costs by 18%</p>
                  <Badge variant="outline" className="mt-2">Quick Win</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Tolerance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Strategy Approach</span>
                    <Badge variant="secondary">Balanced</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm">Conservative</Button>
                    <Button variant="default" size="sm">Balanced</Button>
                    <Button variant="outline" size="sm">Aggressive</Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <span className="text-sm font-medium">Investment Risk</span>
                  <Progress value={65} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low Risk</span>
                    <span>High Reward</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessDashboard;