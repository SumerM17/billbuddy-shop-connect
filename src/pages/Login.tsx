
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import CustomerLoginForm from "@/components/auth/CustomerLoginForm";
import ShopkeeperLoginForm from "@/components/auth/ShopkeeperLoginForm";
import ShopkeeperSignupForm from "@/components/auth/ShopkeeperSignupForm";

const Login = () => {
  const [activeTab, setActiveTab] = useState("customer");
  const [shopkeeperView, setShopkeeperView] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="customer" className="flex-1">Customer</TabsTrigger>
              <TabsTrigger value="shopkeeper" className="flex-1">Shopkeeper</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer">
              <CustomerLoginForm />
            </TabsContent>
            
            <TabsContent value="shopkeeper">
              {shopkeeperView === "login" ? (
                <ShopkeeperLoginForm 
                  onSwitchToSignup={() => setShopkeeperView("signup")} 
                />
              ) : (
                <ShopkeeperSignupForm 
                  onSwitchToLogin={() => setShopkeeperView("login")} 
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
