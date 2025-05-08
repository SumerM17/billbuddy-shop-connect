
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ShopkeeperDashboard from "@/components/ShopkeeperDashboard";
import CustomerDashboard from "@/components/CustomerDashboard";
import { User } from "@/types";
import { supabase, checkAuthStatus } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is authenticated with Supabase
        const session = await checkAuthStatus();
        
        if (!session) {
          navigate("/login");
          return;
        }

        // Get user profile data from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError || !profileData) {
          console.error("Error fetching profile:", profileError);
          toast.error("Failed to load user profile");
          navigate("/login");
          return;
        }

        // Convert Supabase data to our User type
        const userData: User = {
          id: profileData.id,
          name: profileData.name,
          role: profileData.role,
          shopId: profileData.shop_id || undefined,
          customerId: profileData.customer_id || undefined,
          phone: profileData.phone || undefined,
          email: profileData.email || undefined,
          createdAt: new Date(profileData.created_at),
        };

        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in authentication:", error);
        toast.error("Authentication error");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

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
