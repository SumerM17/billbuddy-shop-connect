
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const customerLoginSchema = z.object({
  uniqueId: z.string().min(1, "Customer ID is required"),
});

export type CustomerLoginFormValues = z.infer<typeof customerLoginSchema>;

const CustomerLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<CustomerLoginFormValues>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      uniqueId: "",
    },
  });

  const onSubmit = async (values: CustomerLoginFormValues) => {
    setIsLoading(true);
    try {
      console.log("Customer login attempt with ID:", values.uniqueId);
      
      // Find customer in database by unique ID
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("unique_id", values.uniqueId)
        .single();
      
      if (customerError || !customer) {
        toast.error("Invalid customer ID. Please check and try again.");
        console.error("Customer lookup error:", customerError);
        setIsLoading(false);
        return;
      }
      
      // Create anonymous customer session
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${customer.unique_id}@customer.billbuddy.app`, // Using a pattern for customer logins
        password: customer.unique_id // For simplicity - in production, use more secure methods
      });
      
      if (error) {
        // If customer doesn't have an account yet, create one
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: `${customer.unique_id}@customer.billbuddy.app`,
          password: customer.unique_id,
        });
        
        if (signUpError) {
          toast.error("Failed to authenticate. Please try again.");
          console.error("Customer auth error:", signUpError);
          setIsLoading(false);
          return;
        }

        // Create profile for the customer
        if (signUpData && signUpData.user) {
          await supabase.from("profiles").insert({
            id: signUpData.user.id,
            name: customer.name,
            role: "customer",
            customer_id: customer.id,
            shop_id: customer.shop_id,
            created_at: new Date().toISOString(),
          });
        }
      }

      toast.success(`Welcome back, ${customer.name}!`);
      setIsLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Customer login error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Login</CardTitle>
        <CardDescription>
          Enter your unique customer ID provided by your shopkeeper.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="uniqueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your unique customer ID" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Don't have an ID? Ask your shopkeeper to create one for you.
        </p>
      </CardFooter>
    </Card>
  );
};

export default CustomerLoginForm;
