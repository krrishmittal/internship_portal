import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import video from "../assets/background-video.mp4";

function Dashboard() {
    const [appliedOpportunities, setAppliedOpportunities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const fetchAppliedOpportunities = async () => {
            try {
                const response = await fetch("https://internship-backend-bkhn.onrender.com/auth/applied", {
                    credentials: "include",
                    signal: controller.signal, 
                });
                if (!response.ok) {
                    toast.error("Login to view Dashboard");
                    navigate("/login");
                    return; 
                }
                const data = await response.json();
                setAppliedOpportunities(data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching applied opportunities:", error);
                }
            }
        };
        fetchAppliedOpportunities();
        return () => controller.abort();
    }, [navigate]);

    const handleDeleteOpportunity = async (id) => {
        try {
            const response = await fetch(`https://internship-backend-bkhn.onrender.com/auth/applied/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete opportunity");
            }
            setAppliedOpportunities((prevOpportunities) =>
                prevOpportunities.filter((opportunity) => opportunity._id !== id)
            );
            toast.success("Opportunity deleted successfully");
        } catch (error) {
            console.error("Error deleting opportunity:", error);
            toast.error("Failed to delete opportunity");
        }
    };

    return (
        <div className="dashboard-page">
            <video autoPlay loop muted className="background-video">
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="dashboard">
                <h1>Applied Opportunities</h1>
                {appliedOpportunities.length > 0 ? (
                    <ul>
                        {appliedOpportunities.map((opportunity) => (
                            <li key={opportunity._id}>
                                <h2>{opportunity.title}</h2>
                                <p><strong>Company:</strong> {opportunity.company_name}</p>
                                <p><strong>Duration:</strong> {opportunity.duration}</p>
                                <button onClick={() => handleDeleteOpportunity(opportunity._id)} className="delete-button">Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have not applied to any opportunities yet.</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard; 