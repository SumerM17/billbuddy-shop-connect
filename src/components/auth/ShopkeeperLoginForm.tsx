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

const shopkeeperLoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ShopkeeperLoginFormValues = z.infer<typeof shopkeeperLoginSchema>;

interface ShopkeeperLoginFormProps {
  onSwitchToSignup: () => void;
}

const ShopkeeperLoginForm = ({ onSwitchToSignup }: ShopkeeperLoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ShopkeeperLoginFormValues>({
    resolver: zodResolver(shopkeeperLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: ShopkeeperLoginFormValues) => {
    setIsLoading(true);
    try {
      console.log("Shopkeeper login attempt with email:", values.email);
      
      // Authenticate shopkeeper with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error("Invalid email or password. Please try again.");
        console.error("Login error:", error);
        setIsLoading(false);
        return;
      }

      // Check if user has a profile and is a shopkeeper
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        toast.error("Profile not found. Please contact support.");
        console.error("Profile lookup error:", profileError);
        setIsLoading(false);
        return;
      }

      if (profile.role !== "shopkeeper") {
        toast.error("This account is not registered as a shopkeeper.");
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      toast.success("Logged in successfully!");
      setIsLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Shopkeeper login error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopkeeper Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your shop dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
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
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground">
          Don't have a shop account yet?
        </div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onSwitchToSignup}
          disabled={isLoading}
        >
          Register Your Shop
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopkeeperLoginForm;
