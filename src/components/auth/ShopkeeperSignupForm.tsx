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
import { v4 as uuidv4 } from 'uuid';

const shopkeeperSignupSchema = z.object({
  shopName: z.string().min(1, "Shop name is required"),
  name: z.string().min(1, "Your name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  upiId: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ShopkeeperSignupFormValues = z.infer<typeof shopkeeperSignupSchema>;

interface ShopkeeperSignupFormProps {
  onSwitchToLogin: () => void;
}

const ShopkeeperSignupForm = ({ onSwitchToLogin }: ShopkeeperSignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ShopkeeperSignupFormValues>({
    resolver: zodResolver(shopkeeperSignupSchema),
    defaultValues: {
      shopName: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      upiId: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ShopkeeperSignupFormValues) => {
    setIsLoading(true);
    try {
      console.log("Shopkeeper signup attempt with email:", values.email);
      console.log("Form values:", values);
      
      // Register shopkeeper with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error("Registration failed: " + error.message);
        console.error("Signup error:", error);
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        toast.error("Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("User created in auth:", data.user.id);

      // Create a new shop
      const shopId = uuidv4();
      const { error: shopError } = await supabase.from("shops").insert({
        id: shopId,
        name: values.shopName,
        owner_id: data.user.id,
        address: values.address || null,
        upi_id: values.upiId || null,
        phone: values.phone || null,
        created_at: new Date().toISOString(),
      });

      if (shopError) {
        console.error("Shop creation error:", shopError);
        toast.error("Failed to create shop. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("Shop created:", shopId);

      // Create a profile for the shopkeeper
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name: values.name,
        role: "shopkeeper",
        shop_id: shopId,
        email: values.email,
        phone: values.phone || null,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast.error("Failed to create profile. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("Profile created for user:", data.user.id);
      toast.success("Shop registered successfully!");
      setIsLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Shopkeeper signup error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Your Shop</CardTitle>
        <CardDescription>
          Create an account to start managing your shop and customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="shopName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your shop name" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your phone number" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Address (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your shop address" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPI ID (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your UPI ID" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Create a password" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Confirm your password" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register Shop"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button 
          variant="link" 
          className="w-full"
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Already have an account? Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopkeeperSignupForm;
