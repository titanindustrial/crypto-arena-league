
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you are looking for doesn't exist or has been moved. Please check the URL or navigate back to the home page.
          </p>
          <Link to="/">
            <Button className="flex items-center">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
