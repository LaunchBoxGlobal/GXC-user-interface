import { RxDashboard } from "react-icons/rx";
import { LuUsersRound } from "react-icons/lu";
import { AiOutlineUser } from "react-icons/ai";
import { IoBagHandleOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

export const PAGE_LINKS = [
  {
    title: "Dashboard",
    page: "/",
    icon: RxDashboard,
    iconWidth: "",
    iconHeight: "",
    iconAltTag: "",
  },
  {
    title: "Communities",
    page: "/communities",
    icon: LuUsersRound,
    iconWidth: "",
    iconHeight: "",
    iconAltTag: "",
  },
  {
    title: "Community Owners",
    page: "/community-owners",
    icon: AiOutlineUser,
    iconWidth: "",
    iconHeight: "",
    iconAltTag: "",
  },
  {
    title: "Products",
    page: "/products",
    icon: IoBagHandleOutline,
    iconWidth: "",
    iconHeight: "",
    iconAltTag: "",
  },
  {
    title: "Order Management",
    page: "/order-management",
    icon: IoCartOutline,
    iconWidth: "",
    iconHeight: "",
    iconAltTag: "",
  },
  {
    title: "Reports",
    page: "/reports",
    icon: MdOutlineReportGmailerrorred,
    iconWidth: "",
    iconHeight: "",
    iconAltTag: "",
  },
  {
    title: "Withdraw Requests",
    page: "/withdraw-requests",
    icon: VscGitPullRequestGoToChanges,
    iconWidth: "",
    iconHeight: "",
    iconAltTag: "",
  },
];
