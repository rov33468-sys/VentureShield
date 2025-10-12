import { useState } from 'react';
import Header from '@/components/Header';
import RiskPredictionForm from '@/components/RiskPredictionForm';
import PredictionResults from '@/components/PredictionResults';
import PredictionHistory from '@/components/PredictionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingDown, History, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const [currentPrediction, setCurrentPrediction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('predict');

  const handlePredictionComplete = (prediction: any) => {
    setCurrentPrediction(prediction);
  };

  const handleNewPrediction = () => {
    setCurrentPrediction(null);
    setActiveTab('predict');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI-Powered Business Risk Assessment
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leverage advanced AI to predict business failure risk and receive actionable recommendations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 shadow-card">
            <TabsTrigger value="predict" className="gap-2">
              <TrendingDown className="h-4 w-4" />
              <span className="hidden sm:inline">Predict Risk</span>
              <span className="sm:hidden">Predict</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2" disabled={!currentPrediction}>
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
              <span className="sm:hidden">Results</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predict" className="space-y-6">
            <RiskPredictionForm onPredictionComplete={handlePredictionComplete} />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {currentPrediction ? (
              <PredictionResults 
                prediction={currentPrediction} 
                onNewPrediction={handleNewPrediction}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No prediction results yet. Start by analyzing a business.
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <PredictionHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}