
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomersList from "./CustomersList";
import AddPaymentForm from "./AddPaymentForm";
import PendingPayments from "./PendingPayments";
import { User } from "@/types";

interface ShopkeeperDashboardProps {
  user: User;
}

const ShopkeeperDashboard = ({ user }: ShopkeeperDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - will be replaced with real data from database
  const totalCustomers = 24;
  const pendingAmount = 15750;
  const receivedAmount = 42800;
  const totalTransactions = 68;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}!</h2>
          <p className="text-muted-foreground mt-1">Here's an overview of your shop's activity.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setActiveTab("newPayment")}>Add New Payment</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">₹{pendingAmount.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{receivedAmount.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="pendingPayments">Pending Payments</TabsTrigger>
          <TabsTrigger value="newPayment">New Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Your recent activity will be displayed here.</p>
              <div className="mt-4 border rounded-lg p-3 text-sm">
                No recent activity to display.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4 mt-4">
          <CustomersList shopId={user.shopId || ""} />
        </TabsContent>

        <TabsContent value="pendingPayments" className="space-y-4 mt-4">
          <PendingPayments shopId={user.shopId || ""} userRole="shopkeeper" />
        </TabsContent>

        <TabsContent value="newPayment" className="space-y-4 mt-4">
          <AddPaymentForm shopId={user.shopId || ""} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopkeeperDashboard;
