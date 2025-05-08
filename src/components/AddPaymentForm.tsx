
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer } from "@/types";
import { cn } from "@/lib/utils";

interface AddPaymentFormProps {
  shopId: string;
}

const formSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  items: z.string().optional(),
  dueDate: z.date().optional(),
});

const AddPaymentForm = ({ shopId }: AddPaymentFormProps) => {
  const [createNewCustomer, setCreateNewCustomer] = useState(false);
  
  // Mock customers - will be replaced with data from Supabase
  const mockCustomers: Customer[] = [
    { id: "1", name: "Rahul Sharma", uniqueId: "CUST001", shopId: "1", createdAt: new Date() },
    { id: "2", name: "Priya Patel", uniqueId: "CUST002", shopId: "1", createdAt: new Date() },
    { id: "3", name: "Amit Singh", uniqueId: "CUST003", shopId: "1", createdAt: new Date() },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
      items: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Here we'll add the payment to the database (will be implemented with Supabase)
    console.log("Payment values:", values);
    
    toast.success("Payment added successfully!");
    form.reset();
  };

  const toggleCreateCustomer = () => {
    setCreateNewCustomer(!createNewCustomer);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Add New Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {!createNewCustomer ? (
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} ({customer.uniqueId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>New Customer Name</FormLabel>
                  <Input placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <Input placeholder="Enter phone number" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end">
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={toggleCreateCustomer}
              >
                {createNewCustomer ? "Select Existing Customer" : "Create New Customer"}
              </Button>
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter payment description" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="items"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Items (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List items separated by commas" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Add Payment</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <p className="text-xs text-muted-foreground">
          This will add a pending payment for the customer.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AddPaymentForm;
