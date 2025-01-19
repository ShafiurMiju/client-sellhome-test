import React, { useRef, useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Info,
  X,
  Bed,
  Bath,
  SquareIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const OwnerPortfolioView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isBlurred, setIsBlurred] = useState(true); // State to control blur for info
  const [showSkipTracePopup, setShowSkipTracePopup] = useState(false); // State to control popup visibility
  const [showPropertyPopup, setShowPropertyPopup] = useState(false); // Property popup visibility
  const [showText, setShowText] = useState(false);
  const [activeTab, setActiveTab] = useState("owner"); // 'property' or 'owner'
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false); // State for showing the loading indicator
    const [userInfo, setUserInfo] = useState(null); // User information
  
  const [error, setError] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user"));

  
  // Fetch user info by userId
  const fetchUserInfo = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://homesell-test.vercel.app/api/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user info");
      }

      const data = await response.json();
      setUserInfo(data.data); // Set user info if successful
    } catch (err) {
      console.error("Error fetching user info:", err.message);
      setError(err.message);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Fetch user info on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      fetchUserInfo(storedUser.id); // Fetch user info using the stored userId
    } else {
      setError("User ID not found in local storage.");
    }
  }, []); // Empty dependency array ensures this runs only once on page load






  const data = location.state?.data;

  const buttonRef = useRef();

  if (!data) {
    return (
      <div className="text-center mt-16">
        <h1 className="text-2xl font-bold">No Data Found</h1>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded"
        >
          Back to Search
        </button>
      </div>
    );
  }

  const { output } = data?.data || {};
  const { identity, demographics } = output || {};
  const { names, phones, address, emails } = identity || {};

  const handleSkipTrace = () => {
    setShowSkipTracePopup(true); // Show the confirmation popup
  };

  const confirmSkipTrace = async () => {
    try {
      // Call the reduce-credit API
      const response = await fetch("https://homesell-test.vercel.app/api/reduce-credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId.id, // Ensure userId is correctly passed from state
          amount: 10, // Adjust the amount to deduct as needed
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reduce credit.");
      }
  
      const result = await response.json();
      console.log("Credit reduced successfully:", result);
  
  
      setShowSkipTracePopup(false); // Hide the popup
      setIsBlurred(false); // Remove the blur for the info section
    
    } catch (err) {
      console.error("Error reducing credit:", err.message);
    }
  
    if (buttonRef.current) {
      setShowText(true); // Show "Skip Trace Again" button
      buttonRef.current.style.display = "none"; // Hide "Skip Trace" button
    }
  };
  

  const cancelSkipTrace = () => {
    setShowSkipTracePopup(false); // Hide the popup
  };

  //...................
  //for property details
  const handlePropertyClick = async() => {
    try {
      // Call the reduce-credit API
      const response = await fetch("https://homesell-test.vercel.app/api/reduce-credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId.id, // Ensure userId is correctly passed from state
          amount: 2, // Adjust the amount to deduct as needed
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reduce credit.");
      }
  
      const result = await response.json();
      console.log("Credit reduced successfully:", result);
  
  
      setShowPropertyPopup(true); // Show the popup when clicking on the "Property" tab

    
    } catch (err) {
      console.error("Error reducing credit:", err.message);
    }



  };

  // Handle the API call
  const handleApiCall = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("https://homesell-test.vercel.app/api/property-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Replace this with the actual data needed for the API call
          address: address?.formattedAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch property details");
      }

      const data = await response.json(); // Parse the response
      setApiResponse(data); // Store the API response
      setShowPropertyPopup(false); // Close the popup
      setActiveTab("property"); // Switch to the Property tab
    } catch (error) {
      console.error("API call failed:", error.message);
      alert("An error occurred while fetching property details.");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  const cancelPopup = () => {
    setShowPropertyPopup(false); // Close the popup without making the API call
  };






  // property details =======

  // State for collapsible sections
  const [openSections, setOpenSections] = useState({
    characteristics: true,
    mortgage: false,
    facts: false,
    
  });


  const property = {
    address: apiResponse?.data?.data.propertyInfo.address.label,
    location: "Freedom, OK 73842",
    price: 152415,
    beds: apiResponse?.data?.data.propertyInfo.bedrooms,
    baths: apiResponse?.data?.data.propertyInfo.bathrooms,
    sqft: apiResponse?.data?.data.propertyInfo.buildingSquareFeet
    ,
    image:
      "https://img.freepik.com/free-photo/cityscape-wuxi_1127-3968.jpg?ga=GA1.1.1644760819.1734589298&semt=ais_tags_boosted",
    characteristics: [
      { label: "Living Area", value: apiResponse?.data?.data.propertyInfo.buildingSquareFeet },
      { label: "Year Built", value: apiResponse?.data?.data.propertyInfo.yearBuilt },
      { label: "# of Units", value: "0" },
      { label: "Bedrooms", value: apiResponse?.data?.data.propertyInfo.bedrooms },
      { label: "Bathrooms", value: apiResponse?.data?.data.propertyInfo.bathrooms },
      { label: "Heating Type", value: apiResponse?.data?.data.propertyInfo.heatingType },
      { label: "Pool", value: apiResponse?.data?.data?.propertyInfo?.pool ? "Yes" : "No", },
      { label: "Property Type", value: apiResponse?.data?.data.propertyType },
      { label: "Stories", value: apiResponse?.data?.data.propertyInfo.stories },
    ],
  };

  // Toggle function for sections
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // property details =======

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Navigation */}
      <div className="border-b mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("owner")}
              // className="px-4 py-2 text-teal-600 border-b-2 border-teal-600"
              className={`px-4 py-2 ${
                activeTab === "owner"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Owner
            </button>
            <button
              onClick={handlePropertyClick}
              className={`px-4 py-2 ${
                activeTab === "property"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Property
            </button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
              Comps
            </button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
              History
            </button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
              Market
            </button>
          </div>
          <div className="flex items-center gap-4">
            {/* <button className="p-2 hover:bg-gray-100 rounded">
              <ArrowLeft size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <ArrowRight size={20} />
            </button>
            <button className="bg-teal-100 text-teal-700 px-3 py-1.5 rounded flex items-center gap-2">
              <span className="text-lg">+</span> Add
            </button> */}
            <button
              onClick={() => navigate("/property-search")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Content */}

      {activeTab === "property" ? (
        <div className="max-w-7xl mx-auto bg-white pt-8 shadow-lg px-2 pb-3">
          <div className="flex flex-col lg:flex-row gap-[20px]">
            {/* Left side - Image and Text */}
            <div className="relative w-full lg:w-1/2 p-2 sm:p-3 lg:p-0  ">
              <img
                src={property.image}
                alt={property.address}
                className="w-full h-[400px] object-cover"
              />
              {/* Header */}
              <div className="flex justify-between items-start mb-4 pt-4">
                <div>
                  <h1 className="text-base sm:text-lg md:text-2xl font-semibold">
                    {property.address}
                  </h1>
                  <p className="text-gray-600">{property.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-base sm:text-lg md:text-2xl font-bold">
                    ${property.price}
                  </p>
                  <p className="text-sm text-gray-600">Estimated Value</p>
                </div>
              </div>

              {/* Property stats */}
              <div className="flex gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{property.beds}</span>
                  <span className="text-gray-600">Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{property.baths}</span>
                  <span className="text-gray-600">Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <SquareIcon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{property.sqft}</span>
                  <span className="text-gray-600">SqFt</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  Adjustable Loans
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  High Equity
                </span>
              </div>
            </div>

            {/* Right side - Details */}
            <div className="w-full lg:w-1/2 p-2 sm:p-3 lg:p-0">
              {/* Collapsible sections */}
              <div className="space-y-2">
                {/* Mortgage Section */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("mortgage")}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">Mortgage & Equity</span>
                    {openSections.mortgage ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  {openSections.mortgage && (
                    <div className="p-4 border-t">
                      <p>
                        Mortgage details and equity information would go here...
                      </p>
                    </div>
                  )}
                </div>

                {/* Facts Section */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("facts")}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">Public Facts & Zoning</span>
                    {openSections.facts ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  {openSections.facts && (
                    <div className="p-4 border-t">
                      <div className="px-4 py-2">
                        {property.characteristics.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-2 border-b last:border-0"
                          >
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Characteristics Section */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("characteristics")}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">
                      Property Characteristics
                    </span>
                    {openSections.characteristics ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  {openSections.characteristics && (
                    <div className="border-t">
                      <div className="px-4 py-2 ">
                        {property.characteristics.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-2 border-b last:border-0"
                          >
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Owner Information */}
          <div className={`mb-8`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Owner Information</h2>
              {/* <ChevronUp size={20} className="text-gray-500" /> */}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {/* Owner Name */}
                <div className="flex justify-between border-b pb-3">
                  <div className="flex gap-2">
                    <User size={16} className="text-gray-400 mt-[5px]" />
                    <span className="text-gray-500">Owner Name</span>
                  </div>
                  <div className={`text-right`}>
                    {names
                      ? Object.values(names).map((name, index) => (
                          <div key={index}>{name.fullName}</div>
                        ))
                      : "--"}
                  </div>
                </div>

                {/* Mailing Address */}
                <div className="flex justify-between border-b pb-3">
                  <div className="flex gap-2">
                    <Mail size={16} className="text-gray-400 mt-[5px]" />
                    <span className="text-gray-500">Mailing Address</span>
                  </div>
                  <div className={`text-right ${isBlurred ? "blur-sm" : ""}`}>
                    {isBlurred ? (
                      <div>mail address</div>
                    ) : (
                      <div>{address?.formattedAddress || "--"}</div>
                    )}
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex justify-between border-b pb-3">
                  <div className="flex gap-2">
                    <Mail size={16} className="text-gray-400 mt-[5px]" />
                    <span className="text-gray-500">Email Address</span>
                  </div>
                  <div className={`text-right ${isBlurred ? "blur-sm" : ""}`}>
                    {isBlurred ? (
                      <div>mail@exmple.com</div>
                    ) : (
                      <div>{emails?.email1?.email || "--"}</div>
                    )}
                  </div>
                </div>

                {/* Age */}
                <div className="flex justify-between border-b pb-3">
                  <div className="flex gap-2">
                    <Info size={16} className="text-gray-400 mt-[5px]" />
                    <span className="text-gray-500">Age</span>
                  </div>
                  <div className={`text-right ${isBlurred ? "blur-sm" : ""}`}>
                    {isBlurred ? (
                      <div>-- years old</div>
                    ) : (
                      <div>{demographics?.ageDisplay || "--"}</div>
                    )}
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="flex justify-between border-b pb-3">
                  <div className="flex gap-2">
                    <Phone size={16} className="text-gray-400 mt-[5px]" />
                    <span className="text-gray-500">Phone Number(s)</span>
                  </div>
                  <div className={`text-right ${isBlurred ? "blur-sm" : ""}`}>
                    {isBlurred ? (
                      <div>0000000000</div>
                    ) : (
                      phones &&
                      Object.values(phones).map((phone, index) => (
                        <div key={index} className="flex gap-3">
                          <span>{phone.phoneType || "--"}</span>
                          <span>{phone.phoneDisplay || "--"}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skip Trace Button */}
          <div className="mt-6">
            {!showText && (
              <button
                ref={buttonRef}
                onClick={handleSkipTrace}
                className="w-full bg-orange-400 text-white py-3 rounded flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Skip Trace
              </button>
            )}
            {showText && (
              <div className="flex gap-4 justify-center items-center">
                <p className="text-lg text-center text-gray-700 mt-2 ">
                  15-01-2025
                </p>
                <p
                  onClick={handleSkipTrace}
                  className="text-center text-blue-500 hover:text-blue-700 text-lg mt-2 cursor-pointer underline"
                >
                  Skip Trace Again
                </p>
              </div>
            )}
            <p className="text-center text-gray-500 text-sm mt-2">
              Get the owner's phone number(s), email address(es), and more.
            </p>
          </div>

          {/* Confirmation Popup */}
          {showSkipTracePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-md text-center">
                <h2 className="text-lg font-bold mb-1">Confirm Skip Trace</h2>
                <p className="text-base font-semibold mb-3">
                  Total Credit: {userInfo && userInfo.credit ? userInfo.credit : "Loading..."}
                </p>
                <p className="text-gray-600 mb-3">
                  Are you sure you want to reveal this information?
                </p>
                <p className="text-black mb-6 text-sm font-medium">
                  10 Credit Will Be spent
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={confirmSkipTrace}
                    className="px-4 py-2 bg-teal-500 text-white rounded"
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelSkipTrace}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Property Popup */}
      {showPropertyPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
            <p className="text-gray-600 mb-6">
              Do you want to fetch property details?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleApiCall}
                className={`px-4 py-2 bg-teal-500 text-white rounded ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Loading..." : "Yes"}
              </button>
              <button
                onClick={() => setShowPropertyPopup(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                disabled={loading} // Disable "No" button when loading
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default OwnerPortfolioView;
