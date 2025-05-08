import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Payment, Shop } from "@/types";
import { toast } from "@/components/ui/sonner";

interface PendingPaymentsProps {
  shopId?: string;
  customerId?: string;
  userRole: "shopkeeper" | "customer";
}

const PendingPayments = ({ shopId, customerId, userRole }: PendingPaymentsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [upiId, setUpiId] = useState("");

  // Mock payments - will be replaced with data from Supabase
  const mockPayments: Payment[] = [
    {
      id: "1",
      customerId: "1",
      shopId: "1",
      amount: 550,
      description: "Monthly grocery items",
      isPending: true,
      createdAt: new Date(2023, 4, 15),
      dueDate: new Date(2023, 4, 30)
    },
    {
      id: "2",
      customerId: "1",
      shopId: "2",
      amount: 1000,
      description: "Household supplies",
      isPending: true,
      createdAt: new Date(2023, 4, 18),
      dueDate: new Date(2023, 5, 2)
    },
    {
      id: "3",
      customerId: "2",
      shopId: "1",
      amount: 750,
      description: "Weekly vegetables",
      isPending: true,
      createdAt: new Date(2023, 4, 20),
      dueDate: new Date(2023, 5, 5)
    },
  ];

  // Mock shops - will be replaced with data from Supabase
  const mockShops: Shop[] = [
    { id: "1", name: "Sharma General Store", ownerId: "owner1", upiId: "sharma@upi", createdAt: new Date() },
    { id: "2", name: "Patel Provisions", ownerId: "owner2", upiId: "patel@upi", createdAt: new Date() },
  ];

  const filteredPayments = mockPayments.filter(payment => {
    // For shopkeeper, filter by shopId
    if (userRole === "shopkeeper" && shopId) {
      if (payment.shopId !== shopId) return false;
    }
    
    // For customer, filter by customerId
    if (userRole === "customer" && customerId) {
      if (payment.customerId !== customerId) return false;
    }
    
    // Apply search filter if search term exists
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        payment.description.toLowerCase().includes(lowerSearchTerm) || 
        payment.amount.toString().includes(lowerSearchTerm)
      );
    }
    
    return payment.isPending;
  });

  const getShopName = (id: string) => {
    const shop = mockShops.find(shop => shop.id === id);
    return shop ? shop.name : "Unknown Shop";
  };

  const getShopUpiId = (id: string) => {
    const shop = mockShops.find(shop => shop.id === id);
    return shop ? shop.upiId : "";
  };

  const handlePayNow = (payment: Payment) => {
    setSelectedPayment(payment);
    setUpiId(getShopUpiId(payment.shopId));
    setIsPaymentDialogOpen(true);
  };

  const handleCompletePayment = () => {
    // Here we'll update the payment status in the database (will be implemented with Supabase)
    if (selectedPayment) {
      console.log("Payment completed:", selectedPayment.id);
      toast.success("Payment marked as completed!");
      setIsPaymentDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredPayments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {userRole === "customer" && <TableHead>Shop</TableHead>}
                  {userRole === "shopkeeper" && <TableHead>Customer ID</TableHead>}
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Created Date</TableHead>
                  <TableHead className="hidden md:table-cell">Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    {userRole === "customer" && <TableCell>{getShopName(payment.shopId)}</TableCell>}
                    {userRole === "shopkeeper" && <TableCell>CUST00{payment.customerId}</TableCell>}
                    <TableCell>₹{payment.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                      {payment.description}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(payment.createdAt), "PP")}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {payment.dueDate ? format(new Date(payment.dueDate), "PP") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {userRole === "customer" ? (
                        <Button size="sm" onClick={() => handlePayNow(payment)}>Pay Now</Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" onClick={() => handleCompletePayment()}>Mark Paid</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-2">No pending payments found.</p>
            {userRole === "shopkeeper" && (
              <Button variant="outline" onClick={() => {}}>Add New Payment</Button>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Complete your payment using UPI.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Payment Details</h3>
              <p className="text-sm">Amount: <span className="font-medium">₹{selectedPayment?.amount.toLocaleString('en-IN')}</span></p>
              <p className="text-sm">Shop: <span className="font-medium">{selectedPayment && getShopName(selectedPayment.shopId)}</span></p>
              <p className="text-sm">Description: <span className="font-medium">{selectedPayment?.description}</span></p>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <h3 className="font-semibold">UPI Payment</h3>
              <p className="text-sm">UPI ID: <span className="font-medium">{upiId}</span></p>
              <div className="rounded-md bg-secondary p-4 text-center">
                <p className="text-sm mb-2">Scan with any UPI app</p>
                {/* Here we would add a QR code in a real app */}
                <div className="w-32 h-32 bg-gray-300 mx-auto flex items-center justify-center">
                  <p className="text-xs text-gray-600">QR Code</p>
                </div>
              </div>
              
              <p className="text-sm text-center mt-4">
                Or open your UPI app and pay to <span className="font-medium">{upiId}</span>
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCompletePayment}>
              I've Completed the Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingPayments;
