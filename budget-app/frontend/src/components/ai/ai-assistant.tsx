import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, TrendingUp, PieChart, Target, Lightbulb, Send, Loader2, Brain, BarChart3, Zap, TrendingDown } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AnalysisResult {
  type: 'portfolio' | 'budget' | 'risk' | 'recommendation';
  title: string;
  content: string;
  data?: any;
  confidence: number;
}

interface AIQuery {
  type: 'analyze' | 'recommend' | 'predict' | 'optimize';
  context: string;
  data?: any;
}

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'ai-models' | 'forecasting' | 'optimization'>('analysis');
  const [activeAnalysis, setActiveAnalysis] = useState<'portfolio' | 'budget' | 'recommendations' | null>(null);
  const [customQuery, setCustomQuery] = useState("");
  const [queryType, setQueryType] = useState<AIQuery['type']>('analyze');

  // Queries for different analyses
  const { data: portfolioAnalysis, isLoading: isPortfolioLoading, refetch: refetchPortfolio } = useQuery<AnalysisResult>({
    queryKey: ['/api/ai/analyze/portfolio'],
    enabled: activeAnalysis === 'portfolio'
  });

  const { data: budgetAnalysis, isLoading: isBudgetLoading, refetch: refetchBudget } = useQuery<AnalysisResult>({
    queryKey: ['/api/ai/analyze/budget'],
    enabled: activeAnalysis === 'budget'
  });

  const { data: recommendations, isLoading: isRecommendationsLoading, refetch: refetchRecommendations } = useQuery<AnalysisResult[]>({
    queryKey: ['/api/ai/recommendations'],
    enabled: activeAnalysis === 'recommendations'
  });

  // Custom query mutation
  const customQueryMutation = useMutation({
    mutationFn: async (query: AIQuery) => {
      const response = await apiRequest("POST", "/api/ai/query", query);
      return response.json();
    }
  });

  const handleAnalysisClick = (type: 'portfolio' | 'budget' | 'recommendations') => {
    setActiveAnalysis(type);
    
    switch (type) {
      case 'portfolio':
        refetchPortfolio();
        break;
      case 'budget':
        refetchBudget();
        break;
      case 'recommendations':
        refetchRecommendations();
        break;
    }
  };

  const handleCustomQuery = () => {
    if (!customQuery.trim()) return;
    
    const query: AIQuery = {
      type: queryType,
      context: customQuery,
    };
    
    customQueryMutation.mutate(query);
  };

  const renderAnalysis = (analysis: AnalysisResult | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Analizuję dane...</span>
        </div>
      );
    }

    if (!analysis) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{analysis.title}</h3>
          <Badge 
            variant="secondary" 
            className={`${
              analysis.confidence > 0.8 ? 'bg-green-100 text-green-800' :
              analysis.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}
          >
            Pewność: {(analysis.confidence * 100).toFixed(0)}%
          </Badge>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-line text-gray-700">
            {analysis.content}
          </div>
        </div>
      </div>
    );
  };

  const renderRecommendations = (recommendations: AnalysisResult[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Generuję rekomendacje...</span>
        </div>
      );
    }

    if (!recommendations || recommendations.length === 0) {
      return (
        <div className="text-center p-8 text-gray-500">
          Brak rekomendacji do wyświetlenia
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="border-l-4 border-purple-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{rec.title}</h4>
              <Badge variant="outline">
                {(rec.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="whitespace-pre-line text-gray-700 text-sm">
              {rec.content}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Assistant Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-6 w-6 text-purple-600" />
            AI Asystent Finansowy - Zaawansowana Analiza
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Button
              variant={activeTab === 'analysis' ? 'default' : 'outline'}
              onClick={() => setActiveTab('analysis')}
              className="flex items-center justify-center"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analiza Klasyczna
            </Button>
            
            <Button
              variant={activeTab === 'ai-models' ? 'default' : 'outline'}
              onClick={() => setActiveTab('ai-models')}
              className="flex items-center justify-center"
            >
              <Brain className="mr-2 h-4 w-4" />
              Modele AI
            </Button>
            
            <Button
              variant={activeTab === 'forecasting' ? 'default' : 'outline'}
              onClick={() => setActiveTab('forecasting')}
              className="flex items-center justify-center"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Prognozowanie
            </Button>

            <Button
              variant={activeTab === 'optimization' ? 'default' : 'outline'}
              onClick={() => setActiveTab('optimization')}
              className="flex items-center justify-center"
            >
              <Target className="mr-2 h-4 w-4" />
              Optymalizacja
            </Button>
          </div>

          {/* Classic Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={activeAnalysis === 'portfolio' ? 'default' : 'outline'}
                onClick={() => handleAnalysisClick('portfolio')}
                className="flex items-center justify-center"
              >
                <PieChart className="mr-2 h-4 w-4" />
                Analiza Portfolio
              </Button>
              
              <Button
                variant={activeAnalysis === 'budget' ? 'default' : 'outline'}
                onClick={() => handleAnalysisClick('budget')}
                className="flex items-center justify-center"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Analiza Budżetu
              </Button>
              
              <Button
                variant={activeAnalysis === 'recommendations' ? 'default' : 'outline'}
                onClick={() => handleAnalysisClick('recommendations')}
                className="flex items-center justify-center"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Rekomendacje
              </Button>
            </div>
          )}

          {/* AI Models Tab */}
          {activeTab === 'ai-models' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Brain className="mr-2 h-5 w-5 text-blue-600" />
                      LSTM Neural Networks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Sieci neuronowe Long Short-Term Memory do przewidywania trendów rynkowych
                    </p>
                    <Button className="w-full" size="sm">
                      Uruchom LSTM Analysis
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-green-600" />
                      Bayesian LSTM
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Bayesowskie sieci LSTM z uwzględnieniem niepewności prognoz
                    </p>
                    <Button className="w-full" size="sm">
                      Uruchom Bayesian LSTM
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
                      CNN+Transformer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Hybrydowy model CNN+Transformer dla analizy wzorców rynkowych
                    </p>
                    <Button className="w-full" size="sm">
                      Uruchom CNN+Transformer
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <TrendingDown className="mr-2 h-5 w-5 text-orange-600" />
                      CatBoost ML
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Model CatBoost do klasyfikacji i regresji na danych finansowych
                    </p>
                    <Button className="w-full" size="sm">
                      Uruchom CatBoost
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Forecasting Tab */}
          {activeTab === 'forecasting' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prognozowanie Cen Aktywów</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Symbol aktywu</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz aktywo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AAPL">Apple Inc. (AAPL)</SelectItem>
                          <SelectItem value="MSFT">Microsoft Corp. (MSFT)</SelectItem>
                          <SelectItem value="GOOGL">Alphabet Inc. (GOOGL)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Horyzont prognozy</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz okres" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1d">1 dzień</SelectItem>
                          <SelectItem value="1w">1 tydzień</SelectItem>
                          <SelectItem value="1m">1 miesiąc</SelectItem>
                          <SelectItem value="3m">3 miesiące</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">
                    Wygeneruj Prognozę
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Optimization Tab */}
          {activeTab === 'optimization' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Optymalizacja Markowitz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Klasyczna optymalizacja portfolio według teorii Markowitza
                    </p>
                    <div className="space-y-2 mb-4">
                      <label className="block text-sm font-medium">Tolerancja ryzyka</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz poziom" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservative">Konserwatywny</SelectItem>
                          <SelectItem value="moderate">Umiarkowany</SelectItem>
                          <SelectItem value="aggressive">Agresywny</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" size="sm">
                      Optymalizuj Portfolio
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI-Enhanced Optimization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Optymalizacja wspomagana sztuczną inteligencją z uczeniem maszynowym
                    </p>
                    <div className="space-y-2 mb-4">
                      <label className="block text-sm font-medium">Model AI</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reinforcement">Reinforcement Learning</SelectItem>
                          <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                          <SelectItem value="neural">Neural Optimization</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" size="sm">
                      Uruchom AI Optimization
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Query */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Zapytaj AI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Select value={queryType} onValueChange={(value) => setQueryType(value as AIQuery['type'])}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analyze">Analizuj</SelectItem>
                  <SelectItem value="recommend">Rekomenduj</SelectItem>
                  <SelectItem value="predict">Przewiduj</SelectItem>
                  <SelectItem value="optimize">Optymalizuj</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Textarea
                placeholder="Zadaj pytanie o swoje finanse..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="flex-1"
                rows={2}
              />
              <Button 
                onClick={handleCustomQuery}
                disabled={!customQuery.trim() || customQueryMutation.isPending}
              >
                {customQueryMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {activeAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Wyniki Analizy</CardTitle>
          </CardHeader>
          <CardContent>
            {activeAnalysis === 'portfolio' && renderAnalysis(portfolioAnalysis, isPortfolioLoading)}
            {activeAnalysis === 'budget' && renderAnalysis(budgetAnalysis, isBudgetLoading)}
            {activeAnalysis === 'recommendations' && renderRecommendations(recommendations, isRecommendationsLoading)}
          </CardContent>
        </Card>
      )}

      {/* Custom Query Results */}
      {customQueryMutation.data && (
        <Card>
          <CardHeader>
            <CardTitle>Odpowiedź AI</CardTitle>
          </CardHeader>
          <CardContent>
            {renderAnalysis(customQueryMutation.data, false)}
          </CardContent>
        </Card>
      )}

      {/* AI Features Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Target className="text-purple-600 h-6 w-6 mt-1" />
            <div>
              <h3 className="font-medium text-purple-800 mb-2">Funkcje AI Asystenta</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Analiza wydajności portfolio i dywersyfikacji</li>
                <li>• Ocena wykorzystania budżetu i stopy oszczędności</li>
                <li>• Personalizowane rekomendacje inwestycyjne</li>
                <li>• Sugestie optymalizacji wydatków</li>
                <li>• Interaktywne zapytania o finanse</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}