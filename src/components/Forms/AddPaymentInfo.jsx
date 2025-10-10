import TextField from "../Common/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PaymentInfoSuccessPopup from "../Popups/PaymentInfoSuccessPopup";
import { useAppContext } from "../../context/AppContext";

const AddPaymentInfo = () => {
  const [isPaymentMethodAdded, setIsPaymentMethodAdded] = useState(false);
  const navigate = useNavigate();

  const { handleCloseSuccessModal, showSuccessModal } = useAppContext();

  const handleTogglePaymentSucessPopup = () => {
    setIsPaymentMethodAdded((prev) => !prev);
    navigate("/payment-methods");
  };

  const formik = useFormik({
    initialValues: {
      cardHolderName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
    validationSchema: Yup.object({
      cardHolderName: Yup.string()
        .max(25, "Name must be 25 characters or less")
        .required("Card holder name is required"),
      cardNumber: Yup.string()
        .matches(/^\d{16}$/, "Card number must be 16 digits")
        .required("Card number is required"),
      expiry: Yup.string().required("Expiry date is required"),
      cvc: Yup.string()
        .matches(/^\d{3,4}$/, "CVC must be 3 or 4 digits")
        .required("CVC is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setIsPaymentMethodAdded(true);
      resetForm();
    },
  });

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-[350px] flex flex-col items-start gap-4"
      >
        <div className="w-full text-center space-y-3">
          <h1 className="font-semibold text-[32px] leading-none">
            Payment Method
          </h1>
          <p className="text-[var(--secondary-color)]">
            Please enter card details to continue
          </p>
        </div>

        <div className="w-full">
          <img
            src="/image-placeholder.png"
            alt=""
            className="w-[107px] h-[107px] rounded-full object-contain mx-auto"
          />
        </div>

        <div className="w-full space-y-3">
          <TextField
            type="text"
            name="cardHolderName"
            placeholder="Card Holder Name"
            value={formik.values.cardHolderName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.cardHolderName}
            touched={formik.touched.cardHolderName}
          />

          <TextField
            type="number"
            name="cardNumber"
            placeholder="Card Number"
            value={formik.values.cardNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.cardNumber}
            touched={formik.touched.cardNumber}
          />

          <div className="w-full grid grid-cols-2 gap-3">
            <TextField
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={formik.values.expiry}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.expiry}
              touched={formik.touched.expiry}
            />
            <TextField
              type="number"
              name="cvc"
              placeholder="CVC"
              value={formik.values.cvc}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.cvc}
              touched={formik.touched.cvc}
            />
          </div>

          <div className="pt-2">
            <Button type={"submit"} title={`Add`} />
          </div>
        </div>

        <div className="w-full mt-2 flex flex-col items-center gap-4">
          <Link to={`/`} className="font-medium">
            Skip
          </Link>
        </div>
      </form>

      <PaymentInfoSuccessPopup
        showPopup={showSuccessModal}
        handleTogglePopup={handleCloseSuccessModal}
      />
    </>
  );
};

export default AddPaymentInfo;
