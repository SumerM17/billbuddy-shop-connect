
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer } from "@/types";
import { toast } from "@/components/ui/sonner";

interface CustomersListProps {
  shopId: string;
}

const CustomersList = ({ shopId }: CustomersListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Mock customers - will be replaced with data from Supabase
  const mockCustomers: Customer[] = [
    { id: "1", name: "Rahul Sharma", uniqueId: "CUST001", phone: "9876543210", shopId: "1", createdAt: new Date() },
    { id: "2", name: "Priya Patel", uniqueId: "CUST002", phone: "8765432109", shopId: "1", createdAt: new Date() },
    { id: "3", name: "Amit Singh", uniqueId: "CUST003", phone: "7654321098", shopId: "1", createdAt: new Date() },
    { id: "4", name: "Anjali Verma", uniqueId: "CUST004", phone: "6543210987", shopId: "1", createdAt: new Date() },
    { id: "5", name: "Vikram Bhatia", uniqueId: "CUST005", phone: "5432109876", shopId: "1", createdAt: new Date() },
  ];

  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  const handleAddCustomer = () => {
    // Here we'll add the customer to the database (will be implemented with Supabase)
    console.log("New customer:", newCustomer);
    
    toast.success("Customer added successfully!");
    setNewCustomer({ name: "", phone: "", email: "" });
    setIsAddCustomerOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Customers</CardTitle>
          <Button onClick={() => setIsAddCustomerOpen(true)}>Add Customer</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search by name, ID, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.uniqueId}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{customer.phone || "N/A"}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No customers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="name">
                Customer Name
              </label>
              <Input
                id="name"
                placeholder="Enter customer name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="phone">
                Phone Number (Optional)
              </label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email Address (Optional)
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsAddCustomerOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddCustomer} disabled={!newCustomer.name.trim()}>
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersList;
