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
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Login = () => {
  const [activeTab, setActiveTab] = useState("customer");
  const [shopkeeperView, setShopkeeperView] = useState<"login" | "signup">("login");
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
      password: "",
      confirmPassword: "",
    },
  });

  const onCustomerSubmit = (values: z.infer<typeof customerLoginSchema>) => {
    // Here we'll implement customer login logic (will be implemented with Supabase)
    console.log("Customer login:", values);
    
    toast.success("Logged in as customer!");
    navigate("/dashboard");
  };

  const onShopkeeperLoginSubmit = (values: z.infer<typeof shopkeeperLoginSchema>) => {
    // Here we'll implement shopkeeper login logic (will be implemented with Supabase)
    console.log("Shopkeeper login:", values);
    
    toast.success("Logged in as shopkeeper!");
    navigate("/dashboard");
  };

  const onShopkeeperSignupSubmit = (values: z.infer<typeof shopkeeperSignupSchema>) => {
    // Here we'll implement shopkeeper signup logic (will be implemented with Supabase)
    console.log("Shopkeeper signup:", values);
    
    toast.success("Shop registered successfully!");
    navigate("/dashboard");
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
                              <Input placeholder="Enter your unique customer ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">
                        Login
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
                                <Input type="email" placeholder="Enter your email" {...field} />
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
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">
                          Login
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
                                <Input placeholder="Enter your shop name" {...field} />
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
                                <Input placeholder="Enter your name" {...field} />
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
                                <Input type="email" placeholder="Enter your email" {...field} />
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
                                <Input type="password" placeholder="Create a password" {...field} />
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
                                <Input type="password" placeholder="Confirm your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">
                          Register Shop
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="link" 
                      className="w-full"
                      onClick={() => setShopkeeperView("login")}
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
