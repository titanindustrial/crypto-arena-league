
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useContest } from "../contexts/ContestContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Layout } from "../components/Layout";
import { formatDate } from "../lib/utils";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const { contests, loading } = useContest();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }
  
  const filteredContests = contests.filter(contest => {
    return contest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contest.description.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const statusColor = {
    upcoming: "bg-blue-500/20 text-blue-500 border-blue-500/50",
    active: "bg-green-500/20 text-crypto-green border-green-500/50",
    completed: "bg-gray-500/20 text-gray-400 border-gray-500/50",
  };
  
  return (
    <Layout>
      <div className="pb-12">
        {/* Admin Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage contests and platform settings
            </p>
          </div>
          <Button className="flex items-center" onClick={() => navigate("/create-contest")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Contest
          </Button>
        </header>
        
        {/* Contests Management */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold">Contests Management</h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contests..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="rounded-lg border h-64 bg-secondary animate-pulse-slow" />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-right">Participants</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContests.length > 0 ? (
                    filteredContests.map((contest) => (
                      <TableRow key={contest.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{contest.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {contest.description.slice(0, 50)}
                              {contest.description.length > 50 && "..."}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColor[contest.status]}>
                            {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(contest.startDate)}
                        </TableCell>
                        <TableCell>
                          {formatDate(contest.endDate)}
                        </TableCell>
                        <TableCell className="text-right">
                          {contest.contestants}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No contests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Admin;
