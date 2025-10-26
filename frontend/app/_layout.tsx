import {ClerkProvider} from "@clerk/clerk-expo";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <ClerkProvider>
      <Slot />
    </ClerkProvider>
  );
}
