import Logo from "@/assets/logos/logo.jpg";
import { UrlMapping } from "@/commons/url-mapping.common";
import { useLogin } from "@/services/apis/auth";
import { useAuthStore } from "@/services/stores/useAuthStore";
import { shortenAddress } from "@/utils/transaction_string";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getWalletAddress, logout, user, login, isAuthenticated } =
    useAuthStore();
  const { mutate: loginMutate } = useLogin();

  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();

  const userImage = user?.image || "https://placehold.co/50x50";
  const walletAddress = getWalletAddress();
  const handleUserIconClick = () => navigate(UrlMapping.user_info);

  const handleDisconnect = () => {
    disconnect();
    logout();
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loginMutate(
        { wallet_address: address },
        {
          onSuccess: async (data) => {
            try {
              login(data);
            } catch (error) {
              alert("Error setting authentication.");
            }
          },
          onError: (error: any) => {
            alert(
              `Login failed: ${error.response?.data?.message || error.message}`
            );
          },
        }
      );
    } else {
      logout();
    }
  }, [isConnected, address, loginMutate, logout, login]);

  return (
    <header
      className={`bg-gradient-to-r from-indigo-600 to-blue-500 shadow-md fixed w-full top-0 z-50 overflow-hidden${
        isScrolled ? "scrolled" : ""
      }`}
      style={{ position: "sticky", top: 0 }}
    >
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-2xl font-bold text-white">King Job</h1>
        </Link>

        {/* Navigation Links */}
        <nav
          className={`${
            isMenuOpen ? "flex flex-col" : "hidden lg:flex"
          } lg:flex-row lg:space-x-6 items-center w-full lg:w-auto`}
        >
          {[
            { label: "Home", path: UrlMapping.home },
            { label: "Jobs", path: UrlMapping.jobs },
            { label: "Info", path: UrlMapping.info },
            { label: "How to Use", path: UrlMapping.how_to_use },
          ].map(({ label, path }) => (
            <Link
              key={label}
              to={path || "#"}
              className="text-white font-medium hover:underline transition duration-300 mt-2 lg:mt-0"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Authenticated User or Connect Wallet */}
        <div
          className={`${
            isMenuOpen ? "flex flex-col mt-4 lg:mt-0" : "hidden lg:flex"
          } items-center lg:space-x-6`}
        >
          {isConnected ? (
            <div className="flex items-center space-x-4">
              <Link
                to={UrlMapping.create || "#"}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-5 rounded-full font-medium shadow-lg transition duration-300"
              >
                Create job
              </Link>

              <div
                className="flex items-center cursor-pointer"
                onClick={handleUserIconClick}
              >
                <img
                  src={userImage}
                  alt="User Icon"
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
                <span className="text-white font-medium ml-2 hidden sm:inline-block">
                  {shortenAddress(walletAddress) || "N/A"}
                </span>
              </div>

              <button
                onClick={handleDisconnect}
                className="bg-red-600 text-white py-2 px-5 rounded-full font-medium shadow-md hover:bg-red-700 transition duration-300"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={openConnectModal}
              className="bg-yellow-400 text-blue-800 py-2 px-5 rounded-full font-medium shadow-md hover:bg-yellow-500 transition duration-300"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden mt-4" onClick={toggleMenu}>
          {isMenuOpen ? (
            <AiOutlineClose className="text-white w-8 h-8 cursor-pointer" />
          ) : (
            <AiOutlineMenu className="text-white w-8 h-8 cursor-pointer" />
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
