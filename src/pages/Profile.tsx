
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Layout } from "../components/Layout";
import { formatDate } from "../lib/utils";
import { User, Medal, Clock, CreditCard, Settings, LogOut } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const achievements = [
    { name: "First Contest Participation", date: "2023-05-15", points: 50 },
    { name: "Top 10 Finish", date: "2023-06-02", points: 100 },
    { name: "Contest Winner", date: "2023-07-18", points: 500 },
    { name: "100 Trades Completed", date: "2023-08-30", points: 75 },
  ];

  return (
    <Layout>
      <div className="pb-12">
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row items-center mb-8 gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback className="text-xl">
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Info */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your personal account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Username</div>
                    <div className="mt-1">{user.username}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="mt-1">{user.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Member Since</div>
                    <div className="mt-1">{formatDate(user.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Account Type</div>
                    <div className="mt-1">{user.isAdmin ? "Administrator" : "Standard User"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Medal className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Milestones and accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index}
                      className="py-3 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <Medal className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{achievement.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(achievement.date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        +{achievement.points} points
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Points Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{user.points}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Use points to join contests and place bets
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <ul className="space-y-2">
                    <li>
                      <div className="font-medium">Joined Bull Market Bonanza</div>
                      <div className="text-xs">1 day ago</div>
                    </li>
                    <li>
                      <div className="font-medium">Executed a trade</div>
                      <div className="text-xs">2 days ago</div>
                    </li>
                    <li>
                      <div className="font-medium">Earned 50 points</div>
                      <div className="text-xs">3 days ago</div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
