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
import { Customer, User } from "@/types";

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

  const onCustomerSubmit = (values: z.infer<typeof customerLoginSchema>) => {
    // In a real app, this would query the database for the customer
    console.log("Customer login:", values);
    
    // Simulate checking if customer exists in database
    const mockCustomers: Customer[] = [
      { 
        id: "c1", 
        name: "John Doe", 
        uniqueId: "CUST123", 
        shopId: "1", 
        createdAt: new Date() 
      }
    ];
    
    const customer = mockCustomers.find(c => c.uniqueId === values.uniqueId);
    
    if (customer) {
      // Create a user session for the customer
      const customerUser: User = {
        id: customer.id,
        name: customer.name,
        role: "customer",
        customerId: customer.id,
        shopId: customer.shopId,
        createdAt: customer.createdAt,
      };
      
      // In a real app, this would set the user in localStorage or a state management system
      localStorage.setItem('user', JSON.stringify(customerUser));
      
      toast.success(`Welcome back, ${customer.name}!`);
      navigate("/dashboard");
    } else {
      toast.error("Invalid customer ID. Please check and try again.");
    }
  };

  const onShopkeeperLoginSubmit = (values: z.infer<typeof shopkeeperLoginSchema>) => {
    // In a real app, this would authenticate the shopkeeper against the database
    console.log("Shopkeeper login:", values);
    
    // Simulate checking if shopkeeper exists in database
    // For demo purposes, let's accept any email that ends with @shop.com
    if (values.email.endsWith('@shop.com')) {
      // Create a mock shopkeeper user
      const shopkeeperUser: User = {
        id: "s1",
        name: "Shopkeeper Account",
        role: "shopkeeper",
        shopId: "1",
        email: values.email,
        createdAt: new Date(),
      };
      
      // In a real app, this would set the user in localStorage or a state management system
      localStorage.setItem('user', JSON.stringify(shopkeeperUser));
      
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password. Please try again.");
    }
  };

  const onShopkeeperSignupSubmit = (values: z.infer<typeof shopkeeperSignupSchema>) => {
    // In a real app, this would create a new shop and shopkeeper in the database
    console.log("Shopkeeper signup:", values);
    
    // Create mock shop and user objects
    const newShopId = `shop_${Date.now()}`;
    const newUserId = `user_${Date.now()}`;
    
    const newShop = {
      id: newShopId,
      name: values.shopName,
      ownerId: newUserId,
      address: values.address,
      upiId: values.upiId,
      phone: values.phone,
      createdAt: new Date()
    };
    
    const newShopkeeper: User = {
      id: newUserId,
      name: values.name,
      role: "shopkeeper",
      shopId: newShopId,
      email: values.email,
      phone: values.phone,
      createdAt: new Date()
    };
    
    // In a real app, this would store the data in the database
    console.log("Creating new shop:", newShop);
    console.log("Creating new shopkeeper:", newShopkeeper);
    
    // Store user in localStorage for session management
    localStorage.setItem('user', JSON.stringify(newShopkeeper));
    
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
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
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
                                <Input placeholder="Enter your shop address" {...field} />
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
                                <Input placeholder="Enter your UPI ID" {...field} />
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
