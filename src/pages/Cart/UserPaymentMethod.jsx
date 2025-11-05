import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Cookies from "js-cookie";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import Loader from "../../components/Common/Loader";
import { enqueueSnackbar } from "notistack";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const UserPaymentMethod = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => {
  const { user } = useAppContext();
  const [savedCards, setSavedCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);
  const [deleteCard, setDeleteCard] = useState(false);

  console.log("selectedPaymentMethod >> ", selectedPaymentMethod);

  // Fetch saved cards
  const fetchSavedCards = async () => {
    if (!user?.id) return;
    try {
      setLoadingCards(true);
      const res = await axios.get(`${BASE_URL}/payments/payment-methods`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      console.log("user cards >>> ", res?.data);
      setSavedCards(res.data?.data?.paymentMethods || []);
    } catch (err) {
      console.error("Error fetching cards:", err);
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    const savedPaymentMethod = Cookies.get("userSelectedPaymentMethod");
    if (savedPaymentMethod) {
      setSelectedPaymentMethod(JSON.parse(savedPaymentMethod));
    }
    fetchSavedCards();
  }, [user]);

  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    Cookies.set("userSelectedPaymentMethod", JSON.stringify(method));
  };

  const handleAddCardClick = () => {
    if (savedCards.length >= 2) {
      enqueueSnackbar("You can add a maximum of 2 cards.", {
        variant: "error",
      });
      return;
    }
    setShowAddCard(true);
  };

  // remove a saved card
  const handleDeleteCard = async (cardId) => {
    // if (!window.confirm("Are you sure you want to remove this card?")) return;
    setDeleteCard(true);
    try {
      const res = await axios.delete(
        `${BASE_URL}/payments/payment-methods/${cardId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      enqueueSnackbar(
        res?.data?.message || "Payment method removed successfully",
        {
          variant: "success",
        }
      );
      await fetchSavedCards();
    } catch (err) {
      console.error("Error deleting card:", err);
      enqueueSnackbar("Failed to delete card. Try again.", {
        variant: "error",
      });
    } finally {
      setDeleteCard(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between gap-3 mb-2">
        <p className="font-semibold leading-none">Payment Method</p>
        {!showAddCard && savedCards?.length < 2 && (
          <button
            type="button"
            className="text-[15px] font-medium leading-none text-[var(--button-bg)]"
            onClick={handleAddCardClick}
          >
            + Add new payment method
          </button>
        )}
      </div>

      {/* Loading State */}
      {loadingCards && (
        <p className="text-sm text-gray-400">Loading cards...</p>
      )}

      {/* Existing saved cards */}
      {!loadingCards &&
        savedCards.map((card) => (
          <div className="w-full mt-2 flex flex-col gap-2" key={card.id}>
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => handleDeleteCard(card.id)}
                className="text-[13px] font-medium leading-none text-[var(--button-bg)]"
              >
                Remove Payment Method
              </button>
            </div>
            <div className="w-full flex items-center justify-between h-[46px] bg-[#2B3743]/20 rounded-[12px] px-3 border border-[var(--button-bg)]">
              <div className="w-full max-w-[90%] flex items-center gap-3">
                <img
                  src="/stripe-icon.png"
                  alt="stripe icon"
                  className="w-[34px] h-[24px]"
                />
                <p className="text-sm">**** ***** {card.last4}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userPaymentMethod"
                  checked={selectedPaymentMethod?.id === card.id}
                  onChange={() => handleSelectPaymentMethod(card)}
                  className="w-[16px] h-[16px] accent-[var(--button-bg)]"
                />
              </div>
            </div>
          </div>
        ))}

      {/* Add card form */}
      {showAddCard && (
        <Elements stripe={stripePromise}>
          <AddCardForm
            user={user}
            onCardAdded={() => {
              setShowAddCard(false);
              fetchSavedCards();
            }}
          />
        </Elements>
      )}

      {deleteCard && (
        <div className="w-full fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-3">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default UserPaymentMethod;

//
// Nested AddCardForm Component (SetupIntent Flow)
//
const AddCardForm = ({ user, onCardAdded }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // Create SetupIntent when form opens
    const createSetupIntent = async () => {
      try {
        const res = await axios.post(
          `${BASE_URL}/payments/setup-intent`,
          {},
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );

        if (res.data.success) {
          setClientSecret(res.data.data.clientSecret);
        } else {
          console.error("Failed to create SetupIntent:", res.data);
        }
      } catch (err) {
        console.error("Error creating SetupIntent:", err);
      }
    };

    createSetupIntent();
  }, []);

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    try {
      const cardElement = elements.getElement(CardElement);

      const { setupIntent, error } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user?.name || "Unknown User",
              email: user?.email || "",
            },
          },
        }
      );

      if (error) {
        console.error(error);
        enqueueSnackbar(error.message || error?.response?.data?.message, {
          variant: "error",
        });
        setLoading(false);
        return;
      }

      if (setupIntent.status === "succeeded") {
        enqueueSnackbar("Card successfully added!", {
          variant: "success",
        });
        onCardAdded(); // Refresh saved cards
      }
    } catch (err) {
      console.error("Error confirming setup intent:", err);
      enqueueSnackbar("Failed to save card. Try again.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddCard} className="w-full mt-4">
      <CardElement className="p-4 bg-[#2B3743]/20 rounded-[12px]" />
      <button
        type="submit"
        disabled={loading || !clientSecret}
        className="mt-3 w-full bg-[var(--button-bg)] text-white py-2 rounded-[12px] text-[16px] font-medium h-[49px]"
      >
        {loading ? "Saving..." : "Save Card"}
      </button>
    </form>
  );
};
