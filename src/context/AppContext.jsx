import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [user, setUser] = useState(null);

  const handleShowPaymentModal = () => {
    setShowPaymentModal((prev) => !prev);
  };

  const handleShowSuccessModal = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(false);
  };
  return (
    <AppContext.Provider
      value={{
        showPaymentModal,
        handleShowPaymentModal,
        handleShowSuccessModal,
        handleCloseSuccessModal,
        showSuccessModal,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
