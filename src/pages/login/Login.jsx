import { useState } from "react";
import { Lock, User, ArrowRight } from "lucide-react";
import logo from "../../assets/ahlogo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/overview");
  };

  const testimonials = [
    {
      id: 1,
      text: "Our vision is premised on using tools agricultural science and technological innovations and strategic partnerships with grassroots communities, governments, research institutions, public/private sector and development partners at different levels to create sustainable life-changing impact and developing working models based on crop value chains, which could be shared widely to further scale up the impact",
      author: "Our Vision",
    },
    {
      id: 2,
      text: "Our mission to disseminate appropriate innovative agricultural technologies and institution approaches through the whole value chain to improve the livelihoods of rural communities",
      author: "Our Mission",
    },
    {
      id: 3,
      text: "Africa Harvest's vision of an Africa free of hunger, poverty and malnutrition is being achieved through the use of science and technology, gender-sensitive, appropriate agricultural technologies and innovative institutional approaches to improve the livelihoods of rural communities, particularly smallholder farmers.",
      author: "Africa Harvest",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-2/5 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-8">
              <img
                src={logo}
                alt="Africa Harvest Logo"
                className="w-48 h-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="text-sm text-gray-500">
              Sign in to continue to Africa Harvest
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={handleLogin}
              className="w-full bg-green-800 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>

            <div className="text-center">
              <a
                href="/forgot-password"
                className="text-sm text-green-600 hover:text-green-700 transition-colors"
              >
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Background with Testimonials and Bubbles */}
      <div className="w-3/5 relative bg-green-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
          alt="Farming"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20"
        />

        {/* Bubbles */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          {[...Array(15)].map((_, i) => {
            const size = `${20 + Math.random() * 60}px`;
            return (
              <div
                key={i}
                className="absolute bg-green-400 opacity-30 rounded-full animate-bubble-move"
                style={{
                  width: size,
                  height: size,
                  top: `${Math.random() * 100}%`,
                  left: `${70 + Math.random() * 30}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                }}
              />
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="w-full max-w-3xl">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex items-center justify-center h-full w-full"
              >
                <blockquote className="text-center max-w-2xl space-y-6">
                  <p className="text-white text-xl font-extralight italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <footer className="mt-4">
                    <div className="text-white">
                      <cite className="font-bold text-yellow-400 italic">
                        {testimonial.author}
                      </cite>
                    </div>
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
