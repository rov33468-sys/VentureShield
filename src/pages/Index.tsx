import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AnalysisModules from "@/components/AnalysisModules";
import BusinessDashboard from "@/components/BusinessDashboard";
import DecisionHistoryLog from "@/components/DecisionHistoryLog";
import { DecisionInput } from "@/components/DecisionInput";
import { PredictionDashboard } from "@/components/PredictionDashboard";
import { CompetitorAnalysis } from "@/components/CompetitorAnalysis";
import { SimulationReports } from "@/components/SimulationReports";
import { AIChatbot } from "@/components/AIChatbot";
import { BusinessSearch } from "@/components/BusinessSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<'home' | 'input' | 'dashboard' | 'competitor' | 'simulation'>('home');
  const [decisionData, setDecisionData] = useState<any>(null);
  const [searchUnlocked, setSearchUnlocked] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleStartAnalysis = () => {
    setCurrentScreen('input');
  };

  const handleDecisionSubmit = (data: any) => {
    setDecisionData(data);
    setCurrentScreen('dashboard');
  };

  const handleNavigateToCompetitor = () => {
    setCurrentScreen('competitor');
  };

  const handleNavigateToSimulation = () => {
    setCurrentScreen('simulation');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const handleBackToCompetitor = () => {
    setCurrentScreen('competitor');
  };

  const handleBackToInput = () => {
    setCurrentScreen('input');
  };

  const handleRestart = () => {
    setCurrentScreen('home');
    setDecisionData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentScreen === 'input') {
    return <DecisionInput onNext={handleDecisionSubmit} />;
  }

  if (currentScreen === 'dashboard') {
    return (
      <PredictionDashboard
        decisionData={decisionData}
        onNext={handleNavigateToCompetitor}
        onBack={handleBackToInput}
      />
    );
  }

  if (currentScreen === 'competitor') {
    return (
      <CompetitorAnalysis
        decisionData={decisionData}
        onNext={handleNavigateToSimulation}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentScreen === 'simulation') {
    return (
      <SimulationReports
        decisionData={decisionData}
        onBack={handleBackToCompetitor}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection onStartAnalysis={handleStartAnalysis} />

        {/* AI Chatbot & Business Search */}
        <section className="py-12 bg-background">
          <div className="container max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3 text-foreground">Talk to Oracle</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Our AI strategist will learn about your vision, then unlock personalized business discovery tools.
              </p>
            </div>
            <AIChatbot onSearchUnlocked={() => setSearchUnlocked(true)} />
            {searchUnlocked && <BusinessSearch />}
          </div>
        </section>
        
        {/* Main Application Tabs */}
        <section className="py-12 bg-background">
          <div className="container">
            <Tabs defaultValue="dashboard" className="space-y-8">
              <div className="text-center mb-8">
                <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3">
                  <TabsTrigger value="dashboard" className="text-sm">Live Dashboard</TabsTrigger>
                  <TabsTrigger value="analysis" className="text-sm">Analysis Modules</TabsTrigger>
                  <TabsTrigger value="history" className="text-sm">Decision History</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="dashboard">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Dynamic Business Dashboard</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Real-time analytics, predictive modeling, and strategic insights for data-driven decision making.
                    </p>
                  </div>
                  <BusinessDashboard />
                </div>
              </TabsContent>

              <TabsContent value="analysis">
                <AnalysisModules />
              </TabsContent>

              <TabsContent value="history">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Decision History & Learning</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Track prediction accuracy, learn from outcomes, and continuously improve decision-making reliability.
                    </p>
                  </div>
                  <DecisionHistoryLog />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;