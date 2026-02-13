import type { Metadata } from "next";
import DailyClient from "./DailyClient";

export const metadata: Metadata = {
  title: "Daily Challenge | TokamakLearn",
  description:
    "Test your Solidity and Ethereum knowledge with daily fill-in-the-blank challenges.",
};

export default function DailyPage() {
  return <DailyClient />;
}
