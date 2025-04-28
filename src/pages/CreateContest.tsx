
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useContest } from "../contexts/ContestContext";
import { useCrypto } from "../contexts/CryptoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Layout } from "../components/Layout";
import { AlertCircle } from "lucide-react";

const CreateContest = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { createContest, loading } = useContest();
  const { cryptos } = useCrypto();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    initialBalance: 100000,
    entryFee: 50,
    startDate: "",
    endDate: "",
    allowedCryptos: [] as string[],
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value, 10) || 0,
    });
  };

  const handleCryptoToggle = (cryptoSymbol: string) => {
    if (formData.allowedCryptos.includes(cryptoSymbol)) {
      setFormData({
        ...formData,
        allowedCryptos: formData.allowedCryptos.filter(c => c !== cryptoSymbol),
      });
    } else {
      setFormData({
        ...formData,
        allowedCryptos: [...formData.allowedCryptos, cryptoSymbol],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.name || !formData.description) {
        setError("Contest name and description are required");
        return;
      }

      if (!formData.startDate || !formData.endDate) {
        setError("Start and end dates are required");
        return;
      }

      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const now = new Date();

      if (startDate <= now) {
        setError("Start date must be in the future");
        return;
      }

      if (endDate <= startDate) {
        setError("End date must be after start date");
        return;
      }

      if (formData.allowedCryptos.length === 0) {
        setError("You must select at least one cryptocurrency");
        return;
      }

      if (formData.initialBalance <= 0) {
        setError("Initial balance must be greater than 0");
        return;
      }

      if (formData.entryFee <= 0) {
        setError("Entry fee must be greater than 0");
        return;
      }

      if (user && formData.entryFee > user.points) {
        setError("You don't have enough points for the entry fee");
        return;
      }

      await createContest({
        name: formData.name,
        description: formData.description,
        initialBalance: formData.initialBalance,
        entryFee: formData.entryFee,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        allowedCryptos: formData.allowedCryptos,
        status: "upcoming",
      });

      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create contest. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Calculate minimum dates
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  const minStartDate = today.toISOString().split("T")[0];
  const minEndDate = formData.startDate 
    ? new Date(new Date(formData.startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : tomorrow.toISOString().split("T")[0];

  return (
    <Layout>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Create a New Contest</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Contest Details</CardTitle>
              <CardDescription>
                Set up the rules and parameters for your trading contest
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Contest Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter a catchy name for your contest"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the contest rules and objectives"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        min={minStartDate}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={minEndDate}
                        disabled={!formData.startDate}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="initialBalance">Initial Balance ($)</Label>
                      <Input
                        id="initialBalance"
                        name="initialBalance"
                        type="number"
                        value={formData.initialBalance}
                        onChange={handleNumberChange}
                        min="1000"
                        step="1000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="entryFee">Entry Fee (Points)</Label>
                      <Input
                        id="entryFee"
                        name="entryFee"
                        type="number"
                        value={formData.entryFee}
                        onChange={handleNumberChange}
                        min="0"
                      />
                      {user && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Your balance: {user.points} points
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-3">Allowed Cryptocurrencies</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {cryptos.map(crypto => (
                        <div key={crypto.symbol} className="flex items-center space-x-2">
                          <Checkbox
                            id={`crypto-${crypto.symbol}`}
                            checked={formData.allowedCryptos.includes(crypto.symbol)}
                            onCheckedChange={() => handleCryptoToggle(crypto.symbol)}
                          />
                          <Label
                            htmlFor={`crypto-${crypto.symbol}`}
                            className="flex items-center cursor-pointer"
                          >
                            <img
                              src={crypto.image}
                              alt={crypto.name}
                              className="w-5 h-5 mr-2"
                            />
                            {crypto.symbol}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Selected: {formData.allowedCryptos.length} / {cryptos.length}
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="w-full"
              >
                {loading ? "Creating Contest..." : "Create Contest"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateContest;
