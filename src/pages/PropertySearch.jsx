import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const PropertySearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [userInfo, setUserInfo] = useState(null); // User information
  const navigate = useNavigate();

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

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (input) => {
    try {
      const response = await fetch("https://homesell-test.vercel.app/api/autocomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      setSuggestions(data?.data || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err.message);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    // Fetch autocomplete suggestions if input is at least 5 characters
    if (input.length >= 5) {
      fetchSuggestions(input);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectAddress = async (selected) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://homesell-test.vercel.app/api/skiptrace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selected),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch property data");
      }

      const data = await response.json();

      // Navigate to the results page with the API response
      navigate("/property", { state: { data } });
    } catch (err) {
      console.error("Error during search:", err.message);
      setError("Failed to fetch property data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-800/90 flex flex-col items-center pt-16 pb-32 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="text-white mt-4">Loading...</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          {/* <div className="text-teal-600 font-bold text-xl">Home Sell 9</div>
          <div className="flex gap-4">
            <Link
              to="/who-we-serve"
              className="text-gray-600 hover:text-teal-600"
            >
              Who We Serve
            </Link>
            <Link to="/reviews" className="text-gray-600 hover:text-teal-600">
              Reviews
            </Link>
          </div> */}
        </div>
        <div className="flex gap-4">
          <button className="text-gray-600 hover:text-teal-600">
            Credit: {userInfo && userInfo.credit ? userInfo.credit : "Loading..."}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="text-center px-4 mt-16">
        <h1 className="text-white text-3xl font-bold mb-20">
        Search 157+ Million MLS & Off-Market Properties...
        </h1>
        {/* Search Form */}
        <div className="flex flex-col gap-2 max-w-4xl mx-auto relative">
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Address, city, county, state, zip code, or APN"
            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-teal-500"
          />

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded w-full mt-[3.25rem] shadow-md max-h-[280px] overflow-y-auto z-10">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-teal-500 hover:text-white cursor-pointer"
                  onClick={() =>
                    handleSelectAddress({
                      fulladdress:{
                        address: item.title,
                      city: item.city,
                      state: item.state,
                      zip: item.zip,
                      },
                      id: userId.id,
                    })
                  }
                >
                  {item.title}
                  <div className="text-sm text-gray-500">
                    {item.city}, {item.state} {item.zip}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default PropertySearch;
