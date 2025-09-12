import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LandingPage from "@/components/LandingPage";
import AnalysisModules from "@/components/AnalysisModules";
import BusinessDashboard from "@/components/BusinessDashboard";
import DecisionHistoryLog from "@/components/DecisionHistoryLog";
import { DecisionInput } from "@/components/DecisionInput";
import { PredictionDashboard } from "@/components/PredictionDashboard";
import { CompetitorAnalysis } from "@/components/CompetitorAnalysis";
import { SimulationReports } from "@/components/SimulationReports";
import { Login } from "@/components/Login";
import { Tutorial } from "@/components/Tutorial";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'input' | 'dashboard' | 'competitor' | 'simulation'>('home');
  const [decisionData, setDecisionData] = useState<any>(null);

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowTutorial(true);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
  };

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

  // Show landing page first
  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show tutorial after login
  if (showTutorial) {
    return <Tutorial onComplete={handleTutorialComplete} onSkip={handleTutorialSkip} />;
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