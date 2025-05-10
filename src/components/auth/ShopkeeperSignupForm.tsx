
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
      
      // Generate a shop ID upfront
      const shopId = uuidv4();

      // Step 1: Register user with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            shopkeeper: true,
            shop_id: shopId
          }
        }
      });

      if (authError) {
        toast.error("Registration failed: " + authError.message);
        console.error("Signup error:", authError);
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error("Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("User created in auth:", authData.user.id);

      // Step 2: Sign in immediately after registration to establish session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (signInError) {
        console.error("Sign in after signup error:", signInError);
        toast.error("Failed to authenticate after registration. Please try logging in.");
        setIsLoading(false);
        return;
      }

      console.log("User signed in:", signInData.user?.id);

      // Step 3: Create shop in database with admin permissions using RPC
      const { error: shopError } = await supabase.rpc('create_new_shop', {
        p_shop_id: shopId,
        p_shop_name: values.shopName,
        p_address: values.address || null,
        p_upi_id: values.upiId || null,
        p_phone: values.phone || null
      } as any); // Using type assertion to bypass TypeScript error

      if (shopError) {
        console.error("Shop creation error:", shopError);
        toast.error("Failed to create shop: " + shopError.message);
        setIsLoading(false);
        return;
      }

      console.log("Shop created:", shopId);

      // Step 4: Create profile with shop connection using RPC
      const { error: profileError } = await supabase.rpc('create_shopkeeper_profile', {
        p_name: values.name,
        p_shop_id: shopId,
        p_email: values.email,
        p_phone: values.phone || null
      } as any); // Using type assertion to bypass TypeScript error

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast.error("Failed to create profile: " + profileError.message);
        setIsLoading(false);
        return;
      }

      console.log("Profile created for user:", authData.user.id);
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
