import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

const customerLoginSchema = z.object({
  uniqueId: z.string().min(1, "Customer ID is required"),
});

const shopkeeperLoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

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

const Login = () => {
  const [activeTab, setActiveTab] = useState("customer");
  const [shopkeeperView, setShopkeeperView] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const customerForm = useForm<z.infer<typeof customerLoginSchema>>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      uniqueId: "",
    },
  });

  const shopkeeperLoginForm = useForm<z.infer<typeof shopkeeperLoginSchema>>({
    resolver: zodResolver(shopkeeperLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const shopkeeperSignupForm = useForm<z.infer<typeof shopkeeperSignupSchema>>({
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

  const onCustomerSubmit = async (values: z.infer<typeof customerLoginSchema>) => {
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

  const onShopkeeperLoginSubmit = async (values: z.infer<typeof shopkeeperLoginSchema>) => {
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

  const onShopkeeperSignupSubmit = async (values: z.infer<typeof shopkeeperSignupSchema>) => {
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
              <Card>
                <CardHeader>
                  <CardTitle>Customer Login</CardTitle>
                  <CardDescription>
                    Enter your unique customer ID provided by your shopkeeper.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...customerForm}>
                    <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="space-y-6">
                      <FormField
                        control={customerForm.control}
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
            </TabsContent>
            
            <TabsContent value="shopkeeper">
              {shopkeeperView === "login" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Shopkeeper Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your shop dashboard.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...shopkeeperLoginForm}>
                      <form onSubmit={shopkeeperLoginForm.handleSubmit(onShopkeeperLoginSubmit)} className="space-y-6">
                        <FormField
                          control={shopkeeperLoginForm.control}
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
                          control={shopkeeperLoginForm.control}
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
                      onClick={() => setShopkeeperView("signup")}
                    >
                      Register Your Shop
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Register Your Shop</CardTitle>
                    <CardDescription>
                      Create an account to start managing your shop and customers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...shopkeeperSignupForm}>
                      <form onSubmit={shopkeeperSignupForm.handleSubmit(onShopkeeperSignupSubmit)} className="space-y-4">
                        <FormField
                          control={shopkeeperSignupForm.control}
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
                          control={shopkeeperSignupForm.control}
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
                          control={shopkeeperSignupForm.control}
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
                          control={shopkeeperSignupForm.control}
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
                          control={shopkeeperSignupForm.control}
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
                          control={shopkeeperSignupForm.control}
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
                          control={shopkeeperSignupForm.control}
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
                          control={shopkeeperSignupForm.control}
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
                      onClick={() => setShopkeeperView("login")}
                      disabled={isLoading}
                    >
                      Already have an account? Login
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
