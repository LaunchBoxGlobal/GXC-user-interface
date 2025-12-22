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
import { MdKeyboardArrowRight } from "react-icons/md";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentMethods = ({ setSelectedPaymentMethod }) => {
  const { user } = useAppContext();
  const [savedCards, setSavedCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);
  const [deleteCard, setDeleteCard] = useState(false);

  // Fetch saved cards
  const fetchSavedCards = async () => {
    if (!user?.id) return;
    try {
      setLoadingCards(true);
      const res = await axios.get(`${BASE_URL}/payments/payment-methods`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      // console.log("user cards >>> ", res?.data);
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
    <Elements stripe={stripePromise}>
      <div className="w-full pt-2">
        <h2 className="font-semibold text-[24px] leading-none">
          Payment Method
        </h2>
        <div className="w-full border my-5" />

        {/* Loading State */}
        {loadingCards && (
          <div className="w-full flex justify-center pt-20">
            <Loader />
          </div>
        )}

        {/* Existing saved cards */}
        {!loadingCards &&
          savedCards.map((card) => (
            <div className="w-full mt-2 flex flex-col gap-1" key={card.id}>
              <h3 className="font-medium">Saved Card</h3>
              <div className="w-full flex items-center justify-between h-[46px] bg-[#F5F5F5] rounded-[12px] px-3">
                <div className="w-full max-w-[90%] flex items-center gap-2">
                  <img
                    src="/stripe-icon.png"
                    alt="stripe icon"
                    className="w-[34px] h-[24px] object-contain"
                  />
                  <p className="text-sm text-gray-600 font-medium">
                    **** ***** {card.last4}
                  </p>
                </div>
                <div className="w-full max-w-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="text-[13px] font-medium leading-none text-[var(--button-bg)]"
                  >
                    <img
                      src="/trash-icon-red.png"
                      alt="trash icon"
                      width={14}
                      height={15}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}

        {loadingCards ? (
          <></>
        ) : (
          <>
            {/* add new card button */}
            {!showAddCard && savedCards?.length < 2 && (
              <div className="w-full mt-5">
                <h3 className="font-medium mb-1">Add New Card</h3>
                <div
                  onClick={handleAddCardClick}
                  className="w-full flex items-center justify-between h-[46px] bg-[#F5F5F5] rounded-[12px] px-3 cursor-pointer"
                >
                  <div className="w-full max-w-[90%] flex items-center gap-3">
                    <img
                      src="/stripe-icon.png"
                      alt="stripe icon"
                      className="w-[34px] h-[24px] object-contain"
                    />
                    <p className="text-sm text-gray-600 font-medium">
                      Add New Card
                    </p>
                  </div>
                  <div className="w-full flex justify-end">
                    <MdKeyboardArrowRight className="text-xl text-gray-600" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Add card form */}

        {showAddCard && (
          <AddCardForm
            user={user}
            onCardAdded={() => {
              setShowAddCard(false);
              fetchSavedCards();
            }}
          />
        )}

        {deleteCard && (
          <div className="w-full fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-3">
            <Loader />
          </div>
        )}
      </div>
    </Elements>
  );
};

export default PaymentMethods;

const AddCardForm = ({ user, onCardAdded }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [isSetupIntentPending, setIsSetupIntentIsPending] = useState(false);

  useEffect(() => {
    const createSetupIntent = async () => {
      setIsSetupIntentIsPending(true);
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
      } finally {
        setIsSetupIntentIsPending(false);
      }
    };

    createSetupIntent();
  }, []);

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    async function confirmWithClientSecret(secret) {
      return await stripe.confirmCardSetup(secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.name || "Unknown User",
            email: user?.email || "",
          },
        },
      });
    }

    try {
      // 1️⃣ Try with the existing client secret
      let { setupIntent, error } = await confirmWithClientSecret(clientSecret);

      // 2️⃣ Handle the canceled SetupIntent case
      if (
        error?.code === "setup_intent_unexpected_state" ||
        setupIntent?.status === "canceled"
      ) {
        console.warn("SetupIntent was canceled. Creating a new one...");

        // Create a new SetupIntent
        const res = await axios.post(
          `${BASE_URL}/payments/setup-intent`,
          {},
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );

        const newClientSecret = res?.data?.data?.clientSecret;
        if (!newClientSecret) {
          throw new Error("Failed to get new client secret from backend.");
        }

        setClientSecret(newClientSecret);

        // Retry confirming with the new client secret
        ({ setupIntent, error } = await confirmWithClientSecret(
          newClientSecret
        ));
      }

      // 3️⃣ Handle any final Stripe error
      if (error) {
        enqueueSnackbar(error.message || "Failed to save card.", {
          variant: "error",
        });
        console.error("Stripe error:", error);
        return;
      }

      // 4️⃣ Success!
      if (setupIntent.status === "succeeded") {
        enqueueSnackbar("Card successfully added!", { variant: "success" });
        onCardAdded();
      }
    } catch (err) {
      console.error("Error confirming setup intent:", err);
      enqueueSnackbar("Failed to save card. Please try again.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSetupIntentPending) {
    return (
      <div className="w-full flex justify-center pt-20">
        <Loader />
      </div>
    );
  }

  return (
    <form onSubmit={handleAddCard} className="w-full mt-4">
      {clientSecret && (
        <CardElement className="py-3.5 text-sm bg-[#F5F5F5] rounded-[12px] px-3" />
      )}
      <button
        type="submit"
        disabled={loading || !clientSecret}
        className="mt-3 w-full bg-[var(--button-bg)] text-white py-2 rounded-[12px] text-[16px] font-medium h-[49px] disabled:cursor-not-allowed"
      >
        {loading ? <Loader /> : "Save Card"}
      </button>
    </form>
  );
};
