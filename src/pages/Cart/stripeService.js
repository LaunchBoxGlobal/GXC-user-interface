import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import i18next from "i18next";
import { CardElement } from "@stripe/react-stripe-js";

/**
 * Create SetupIntent (for saving card)
 */
export const createSetupIntent = async () => {
  const res = await axios.post(
    `${BASE_URL}/payments/setup-intent`,
    {},
    {
      headers: {
        "Accept-Language": i18next.language,
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!res.data?.success) {
    throw new Error("Failed to create SetupIntent");
  }

  return res.data.data.clientSecret;
};

/**
 * Confirm SetupIntent (save card)
 */
export const confirmSetupIntent = async (
  stripe,
  elements,
  user,
  clientSecret,
) => {
  //   const cardElement = elements.getElement("card");
  const cardElement = elements.getElement(CardElement);

  const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: user?.name || "Unknown",
        email: user?.email || "",
      },
    },
  });

  if (error) throw error;

  return setupIntent.payment_method; // pm_xxx
};

/**
 * Confirm one-time payment
 */
export const confirmOneTimePayment = async (stripe, elements, clientSecret) => {
  const cardElement = elements.getElement(CardElement);

  const { error, paymentIntent } = await stripe.confirmCardPayment(
    clientSecret,
    {
      payment_method: {
        card: cardElement,
      },
    },
  );

  if (error) throw error;

  return paymentIntent;
};
