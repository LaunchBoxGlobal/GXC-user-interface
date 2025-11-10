export const notificationTypes = [
  {
    title: "New Product Alerts",
    description:
      "Receive instant alerts on your device for newly listed products matching your interests.",
    isEnabled: false,
  },
  {
    title: "Order Updates",
    description:
      "Stay informed about the status of your orders, including confirmations, shipments, and deliveries.",
    isEnabled: true,
  },
];

const NotificationsPage = () => {
  return (
    <div className="w-full relative pt-2">
      <h2 className="text-[24px] font-semibold leading-none">Notifications</h2>
      <div className="w-full border my-5" />

      <div className="w-full space-y-4">
        {notificationTypes?.map((type, index) => {
          return (
            <div
              className="w-full bg-[#F5F5F5] rounded-[12px] p-5 flex items-center justify-between"
              key={index}
            >
              <div className="w-full max-w-[80%]">
                <h3 className="font-semibold text-lg">{type?.title}</h3>
                <p className="">{type?.description}</p>
              </div>
              <div className="">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--button-bg)]"></div>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
