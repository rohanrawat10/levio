import React, { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

function PricingPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description:
        "Perfect for beginners starting their interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹99",
      credits: 150,
      description:
        "Great for focused practice and improving your interview skills.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹499",
      credits: 650,
      description:
        "Best value for serious job preparation and interview practice.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skills Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-10 px-5 sm:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <FaArrowLeft className="text-gray-600 text-sm" />
          </motion.button>

          <div className="flex-1 text-center pr-11">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Choose Your Plan
            </h1>

            <p className="text-gray-500 mt-3 text-sm sm:text-lg">
              Flexible pricing to match your interview preparation
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plans.map((plan, index) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              whileHover={
                !plan.default
                  ? {
                      y: -8,
                      scale: 1.02,
                    }
                  : {}
              }
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`
                relative flex flex-col rounded-3xl p-7 sm:p-8
                border transition-all duration-300
                ${
                  isSelected
                    ? "border-emerald-500 bg-white shadow-xl shadow-emerald-100"
                    : "border-gray-200 bg-white/90 shadow-md hover:shadow-xl"
                }
                ${plan.default ? "cursor-default" : "cursor-pointer"}
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-600 text-white text-xs font-semibold px-5 py-1.5 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Default */}
              {plan.default && (
                <div className="absolute top-6 right-6">
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                    Default
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-5">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>

                <p className="text-gray-500 text-sm mt-2 leading-relaxed min-h-[42px]">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-emerald-600">
                    {plan.price}
                  </span>

                  {plan.id !== "free" && (
                    <span className="text-sm text-gray-400 mb-1">one-time</span>
                  )}
                </div>

                <div className="inline-flex mt-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                  {plan.credits} AI Credits
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 mb-6" />

              {/* Features */}
              <div className="space-y-4 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 shrink-0" />

                    <span className="text-gray-700 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button */}
              {!plan.default && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan.id);
                  }}
                  className={`
                    w-full mt-8 py-3.5 rounded-xl
                    font-semibold transition-all duration-200
                    ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
                    }
                  `}
                >
                  {isSelected ? "Proceed to Pay" : "Select Plan"}
                </motion.button>
              )}

              {/* Free plan bottom indicator */}
              {plan.default && (
                <div className="mt-8 w-full py-3.5 rounded-xl bg-gray-100 text-gray-500 text-center font-semibold text-sm">
                  Current Plan
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Note */}
      <p className="text-center text-gray-400 text-xs mt-10">
        Secure payments • Instant credit activation • No subscription
      </p>
    </div>
  );
}

export default PricingPage;
