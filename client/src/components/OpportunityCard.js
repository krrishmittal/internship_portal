import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function OpportunityCard({ opportunity }) {
  const navigate = useNavigate();
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const checkAppliedStatus = async () => {
      try { 
        const response = await fetch(
          `https://internship-backend-bkhn.onrender.com/auth/applied/${opportunity.id}`,
          { credentials: "include" }
        );
        if (!response.ok) {
          throw new Error("Failed to check applied status");
        }
        const data = await response.json();
        setHasApplied(data.applied);
      } catch (error) {
        console.error("Error checking applied status:", error);
      }
    };
    checkAppliedStatus();
  }, [opportunity.id]);

  const applyOnOpportunity = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login to apply for Opportunity");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("https://internship-backend-bkhn.onrender.com/auth/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          title: opportunity.title,
          company_name: opportunity.company_name,
          duration: opportunity.duration,
        }),
        credentials: "include",
      });
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      if (!response.ok) {
        throw new Error("Application failed");
      }
      const data = await response.json();
      localStorage.setItem("applicationId", data.applicationId);
      setHasApplied(true);
      toast.success("Application successful! ");
      navigate("/dashboard");
    } catch (error) {
      console.error("Application error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="opportunity-card">
      <h1>{opportunity.title}</h1>
      <p><strong>Company:</strong> {opportunity.company_name}</p>
      <p><strong>Stipend:</strong> {opportunity.stipend.salary}</p>
      <p><strong>Duration:</strong> {opportunity.duration}</p>
      <p><strong>Location:</strong> {opportunity.locations && opportunity.locations.length > 0 ? opportunity.locations.map((item) => item.string.trim()).filter((loc) => loc).join(", ")
        : "Remote"}
      </p>
      <button onClick={applyOnOpportunity} disabled={hasApplied}>
        {hasApplied ? "You have already applied" : "Apply Here"}
      </button>
    </div>
  );
}

export default OpportunityCard;