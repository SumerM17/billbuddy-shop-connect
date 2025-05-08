import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-100 to-white py-16 md:py-24">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-brand-blue leading-tight mb-4">
                Simplify Store Credit<br />Management
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-xl">
                BillBuddy connects shopkeepers and customers to manage store credit, track payments, and enable easy UPI payments for pending balances.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/login")}
                  className="bg-brand-blue hover:bg-brand-blue/90"
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/login?tab=shopkeeper")}
                >
                  Register Your Shop
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-md rounded-lg bg-white shadow-xl p-6 border">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Customer: Rahul Sharma</p>
                      <p className="text-sm text-muted-foreground">ID: CUST001</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-orange-500">₹1,550</p>
                      <p className="text-sm text-muted-foreground">Due: 15 May</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly groceries</span>
                    <span className="font-medium">₹550</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Household items</span>
                    <span className="font-medium">₹1,000</span>
                  </div>
                  
                  <Button className="w-full mt-2">Pay Now</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-blue font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Shopkeepers Add Customers</h3>
                <p className="text-gray-600">
                  Shopkeepers create unique IDs for their customers to track their purchases and pending payments.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-blue font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Record Pending Payments</h3>
                <p className="text-gray-600">
                  When customers buy on credit, shopkeepers record the amount, items, and due dates in the system.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-blue font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy UPI Payments</h3>
                <p className="text-gray-600">
                  Customers can view their pending payments and pay easily using any UPI app from anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Shopkeepers Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">For Shopkeepers</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-blue mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Easily manage customer credit accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-blue mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Track pending payments and due dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-blue mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Receive payments directly to your UPI ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-blue mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Maintain digital records of all transactions</span>
                  </li>
                </ul>
                
                <Button 
                  className="mt-6"
                  onClick={() => navigate("/login?tab=shopkeeper")}
                >
                  Register Your Shop
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-6 shadow-inner">
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <h3 className="font-semibold mb-4">Customer Management</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Rahul Sharma</span>
                        <span className="text-sm font-medium">CUST001</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Priya Patel</span>
                        <span className="text-sm font-medium">CUST002</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Amit Singh</span>
                        <span className="text-sm font-medium">CUST003</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full">Add Customer</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Customers Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">For Customers</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-blue mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Access all your store credits in one place</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-blue mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Get notified when payments are due</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-blue mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Pay using your favorite UPI app</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-blue mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Keep track of your payment history</span>
                  </li>
                </ul>
                
                <Button 
                  className="mt-6"
                  onClick={() => navigate("/login")}
                >
                  Login as Customer
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg border">
                  <div className="bg-brand-blue text-white p-4">
                    <h3 className="font-semibold">Your Pending Payments</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="border-b pb-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Sharma General Store</span>
                        <span className="font-medium text-orange-500">₹550</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Monthly grocery items</p>
                      <p className="text-xs text-gray-500 mt-1">Due: 30 May 2023</p>
                      <Button size="sm" variant="outline" className="mt-2">Pay Now</Button>
                    </div>
                    
                    <div className="border-b pb-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Patel Provisions</span>
                        <span className="font-medium text-orange-500">₹1,000</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Household supplies</p>
                      <p className="text-xs text-gray-500 mt-1">Due: 2 June 2023</p>
                      <Button size="sm" variant="outline" className="mt-2">Pay Now</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-brand-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Simplify Your Shop's Credit System?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of shopkeepers and customers who are managing store credit efficiently with BillBuddy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/login?tab=shopkeeper")}
              >
                Register as Shopkeeper
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent text-white hover:bg-white hover:text-brand-blue border-white"
                onClick={() => navigate("/login")}
              >
                Login as Customer
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">BillBuddy</h3>
              <p className="text-gray-400 max-w-md">
                Simplifying store credit management for shopkeepers and customers across India.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-medium mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 BillBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
