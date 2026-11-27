"use client";

import { useSyncExternalStore } from "react";
import { GraduationCap } from "lucide-react";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";

const subscribeToMount = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Header() {
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <header className="mx-auto flex h-[76px] w-full max-w-6xl items-center justify-between border-b border-white/[0.07] px-5 sm:px-8">
      <a
        href="#top"
        className="flex items-center gap-2.5"
        aria-label="Solana Academy, accueil"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-emerald-300 text-slate-950">
          <GraduationCap aria-hidden="true" size={18} strokeWidth={2.2} />
        </span>
        <span className="text-sm font-semibold tracking-wide">SOLANA ACADEMY</span>
      </a>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-300" />
          Devnet
        </span>
        {isMounted ? (
          <BaseWalletMultiButton
            labels={{
              "change-wallet": "Change Wallet",
              connecting: "Connecting...",
              "copy-address": "Copy Address",
              copied: "Copied",
              disconnect: "Disconnect",
              "has-wallet": "Connect Wallet",
              "no-wallet": "Connect Wallet",
            }}
            className="!h-9 !rounded-md !border !border-slate-700 !bg-slate-900 !px-3 !text-xs !font-medium !text-slate-100 hover:!bg-slate-800"
          />
        ) : (
          <button
            type="button"
            disabled
            aria-hidden="true"
            tabIndex={-1}
            className="wallet-adapter-button !h-9 !rounded-md !border !border-slate-700 !bg-slate-900 !px-3 !text-xs !font-medium !text-slate-100"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
