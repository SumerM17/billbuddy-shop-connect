import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ShopkeeperDashboard from "@/components/ShopkeeperDashboard";
import CustomerDashboard from "@/components/CustomerDashboard";
import { User } from "@/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the user data from Supabase
    // For now, we'll mock a logged-in user (shopkeeper)
    const mockUser: User = {
      id: "1",
      name: "Vikram Sharma",
      role: "shopkeeper",
      shopId: "1",
      createdAt: new Date(),
    };

    // Simulate API call delay
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole={user.role} userName={user.name} />
      <div className="flex-1 container py-6">
        {user.role === "shopkeeper" ? (
          <ShopkeeperDashboard user={user} />
        ) : (
          <CustomerDashboard user={user} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
