import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Plus, X, Target, DollarSign, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DecisionInputProps {
  onNext: (data: any) => void;
}

export function DecisionInput({ onNext }: DecisionInputProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    budget: "",
    timeline: "",
    industry: "",
    teamSize: "",
    expectedOutcomes: "",
    competitors: [] as string[],
    riskTolerance: ""
  });
  const [newCompetitor, setNewCompetitor] = useState("");

  const addCompetitor = () => {
    if (newCompetitor.trim() && !formData.competitors.includes(newCompetitor.trim())) {
      setFormData(prev => ({
        ...prev,
        competitors: [...prev.competitors, newCompetitor.trim()]
      }));
      setNewCompetitor("");
    }
  };

  const removeCompetitor = (competitor: string) => {
    setFormData(prev => ({
      ...prev,
      competitors: prev.competitors.filter(c => c !== competitor)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName || !formData.budget || !formData.timeline) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields: Project Name, Budget, and Timeline.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Analysis Started",
      description: "Processing your business decision for failure prediction analysis..."
    });

    onNext(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Decision Input
        </h1>
        <p className="text-muted-foreground">
          Provide details about your business decision for comprehensive failure prediction analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Details */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Project Details
              </CardTitle>
              <CardDescription>
                Core information about your business decision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="e.g., New Product Launch, Market Expansion"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project goals, scope, and key objectives"
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resources & Timeline */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-accent" />
                Resources & Timeline
              </CardTitle>
              <CardDescription>
                Investment details and project constraints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="budget">Budget *</Label>
                <Input
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="e.g., $50,000, $500K, $2M"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="timeline">Timeline *</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  placeholder="e.g., 3 months, 1 year, Q2 2024"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, teamSize: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 people</SelectItem>
                    <SelectItem value="6-15">6-15 people</SelectItem>
                    <SelectItem value="16-50">16-50 people</SelectItem>
                    <SelectItem value="51-200">51-200 people</SelectItem>
                    <SelectItem value="200+">200+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, riskTolerance: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative - Safe strategies, low risk</SelectItem>
                    <SelectItem value="balanced">Balanced - Moderate risk & return</SelectItem>
                    <SelectItem value="aggressive">Aggressive - High risk, high reward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expected Outcomes */}
        <Card className="border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-success" />
              Expected Outcomes
            </CardTitle>
            <CardDescription>
              Define success metrics and goals for this decision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.expectedOutcomes}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedOutcomes: e.target.value }))}
              placeholder="e.g., Increase revenue by 25%, Capture 10% market share, Launch in 3 new regions"
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Competitors */}
        <Card className="border-warning/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-warning" />
              Key Competitors
            </CardTitle>
            <CardDescription>
              Identify main competitors or opposing forces (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                placeholder="Enter competitor name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
              />
              <Button type="button" onClick={addCompetitor} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.competitors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.competitors.map((competitor) => (
                  <Badge key={competitor} variant="secondary" className="flex items-center gap-1">
                    {competitor}
                    <button
                      type="button"
                      onClick={() => removeCompetitor(competitor)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card className="border-info/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-info" />
              Supporting Documents
            </CardTitle>
            <CardDescription>
              Upload financial reports, market research, or relevant data (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
              <p className="text-sm text-muted-foreground">Supports PDF, Excel, Word, CSV files</p>
              <Button type="button" variant="outline" className="mt-4">
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="px-8">
            Analyze Decision
          </Button>
        </div>
      </form>
    </div>
  );
}