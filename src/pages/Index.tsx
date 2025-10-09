import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import RiskPredictionForm from "@/components/RiskPredictionForm";
import PredictionResults from "@/components/PredictionResults";
import PredictionHistory from "@/components/PredictionHistory";
import LandingPage from "@/components/LandingPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  // Show landing page if not authenticated
  if (!loading && !user) {
    return <LandingPage />;
  }

  const handlePredictionComplete = (result: any) => {
    setPredictionResult(result);
  };

  const handleSaveComplete = () => {
    setRefreshHistory(prev => prev + 1);
  };

  const handleNewPrediction = () => {
    setPredictionResult(null);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Oracle Risk Navigator</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {!predictionResult ? (
              <RiskPredictionForm onPredictionComplete={handlePredictionComplete} />
            ) : (
              <div className="space-y-4">
                <PredictionResults 
                  result={predictionResult} 
                  onSaveComplete={handleSaveComplete}
                />
                <button
                  onClick={handleNewPrediction}
                  className="text-sm text-primary hover:underline"
                >
                  ← New Prediction
                </button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <PredictionHistory key={refreshHistory} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;