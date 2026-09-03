import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Cookies from "js-cookie";
import { loadStripe } from "@stripe/stripe-js";
import i18n from "i18next";
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
import { useTranslation } from "react-i18next";
import AddCardForm from "./AddCardForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const UserPaymentMethod = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  saveCard,
  setSaveCard,
}) => {
  const { user } = useAppContext();
  const [savedCards, setSavedCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);
  const [deleteCard, setDeleteCard] = useState(false);

  const { t } = useTranslation("cart");

  // Fetch saved cards
  const fetchSavedCards = async () => {
    if (!user?.id) return;
    try {
      setLoadingCards(true);
      const res = await axios.get(`${BASE_URL}/payments/payment-methods`, {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setSavedCards(res.data?.data?.paymentMethods || []);
    } catch (err) {
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
      enqueueSnackbar(t(`maxTwoCards`), {
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
          headers: {
            "Accept-Language": i18n.language,
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      enqueueSnackbar(res?.data?.message || t(`paymentMethodRemoved`), {
        variant: "success",
      });
      await fetchSavedCards();
    } catch (err) {
      console.error("Error deleting card:", err);
      enqueueSnackbar(t(`failedToDeleteCard`), {
        variant: "error",
      });
    } finally {
      setDeleteCard(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between flex-wrap gap-3 mb-2">
        <p className="font-semibold leading-none whitespace-nowrap">
          {t(`paymentMethod`)}
        </p>
        {!showAddCard && savedCards?.length < 2 && (
          <button
            type="button"
            className="text-xs lg:text-[14px] font-medium leading-none text-[var(--button-bg)]"
            onClick={handleAddCardClick}
          >
            {t(`addNewPaymentMethod`)}
          </button>
        )}
      </div>

      {/* Loading State */}
      {loadingCards && (
        <p className="text-sm text-gray-400">{t(`loadingCards`)}...</p>
      )}

      {/* Existing saved cards */}
      {!loadingCards &&
        savedCards.map((card) => (
          <div className="w-full mt-2 flex flex-col gap-2 mb-4" key={card.id}>
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => handleDeleteCard(card.id)}
                className="text-[13px] font-medium leading-none text-[var(--button-bg)]"
              >
                {t(`removePaymentMethod`)}
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
        <AddCardForm
          user={user}
          onCardAdded={() => {
            setShowAddCard(false);
            fetchSavedCards();
          }}
          saveCard={saveCard}
          setSaveCard={setSaveCard}
        />
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
